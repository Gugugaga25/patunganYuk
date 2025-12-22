// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Chainlink VRF & Automation Imports
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

/**
 * @title PatunganEscrow
 * @dev Escrow contract with Chainlink VRF, Automation, and Destination Account Locking.
 */
contract PatunganEscrow is VRFConsumerBaseV2Plus, ReentrancyGuard, AutomationCompatibleInterface {
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                                 ENUMS
    //////////////////////////////////////////////////////////////*/

    enum Status { OPEN, FUNDED, VALIDATING, RELEASED, REFUNDED }

    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct Patungan {
        address creator;
        uint256 targetAmount;
        uint256 perUserAmount;
        uint256 deadline;
        uint256 collectedAmount;
        uint256 validatorDeadline;
        string destinationAccount; // Rekening tujuan yang dikunci
        Status status;
        address[] participants;
        address[] selectedValidators;
    }

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    IERC20 public immutable idrx;
    address public bridgeWallet; // Wallet sistem untuk proses off-ramp
    uint256 public patunganCount;
    uint256 public constant MIN_APPROVALS = 2;
    uint256 public constant VALIDATION_PERIOD = 3 hours;

    mapping(uint256 => Patungan) public patungans;
    mapping(uint256 => mapping(address => uint256)) public userContributions;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    mapping(uint256 => uint256) public currentApprovalCount;

    // Chainlink VRF Variables (Base Sepolia)
    uint256 public s_subscriptionId;
    address public vrfCoordinator = 0x5C210eF8133f1584111B2224851441579fA56a73; // Fixed Checksum
    bytes32 public keyHash = 0x9e1344a2172f29393e8e7a0210217a80a22ed505c87a554f676b714f36a4d7d9;
    uint32 public callbackGasLimit = 500000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 3;

    mapping(uint256 => uint256) public vrfRequestToPatunganId;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event PatunganCreated(uint256 indexed id, address creator, uint256 target, string destinationAccount);
    event Joined(uint256 indexed id, address indexed participant, uint256 amount);
    event VRFRequested(uint256 indexed patunganId, uint256 requestId);
    event ValidationStarted(uint256 indexed id, address[] validators, uint256 deadline);
    event FundsReleased(uint256 indexed id, uint256 amount, address bridge);
    event RefundClaimed(uint256 indexed id, address indexed participant, uint256 amount);

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _idrx, uint256 _subscriptionId, address _bridgeWallet) 
        VRFConsumerBaseV2Plus(vrfCoordinator) 
    {
        idrx = IERC20(_idrx);
        s_subscriptionId = _subscriptionId;
        bridgeWallet = _bridgeWallet;
    }

    /*//////////////////////////////////////////////////////////////
                             CORE FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Membuat patungan baru dengan mengunci info rekening tujuan
     * @param _target Total dana yang dibutuhkan
     * @param _pCount Jumlah peserta
     * @param _duration Durasi dalam detik
     * @param _destAccount Info rekening tujuan (Contoh: "BCA - 12345678 - A/N Budi")
     */
    function createPatungan(
        uint256 _target, 
        uint256 _pCount, 
        uint256 _duration,
        string calldata _destAccount
    ) external returns (uint256) {
        require(_target > 0 && _pCount > 0, "Invalid params");
        
        uint256 id = patunganCount++;
        Patungan storage p = patungans[id];
        
        p.creator = msg.sender;
        p.targetAmount = _target;
        p.perUserAmount = _target / _pCount;
        p.deadline = block.timestamp + _duration;
        p.destinationAccount = _destAccount;
        p.status = Status.OPEN;

        emit PatunganCreated(id, msg.sender, _target, _destAccount);
        return id;
    }

    function joinPatungan(uint256 _id) external nonReentrant {
        Patungan storage p = patungans[_id];
        require(p.status == Status.OPEN, "Not open");
        require(block.timestamp < p.deadline, "Deadline passed");
        require(userContributions[_id][msg.sender] == 0, "Already joined");

        idrx.safeTransferFrom(msg.sender, address(this), p.perUserAmount);
        
        userContributions[_id][msg.sender] = p.perUserAmount;
        p.participants.push(msg.sender);
        p.collectedAmount += p.perUserAmount;

        emit Joined(_id, msg.sender, p.perUserAmount);

        if (p.collectedAmount >= p.targetAmount) {
            p.status = Status.FUNDED;
            _requestRandomValidators(_id);
        }
    }

    function approveRelease(uint256 _id) external {
        Patungan storage p = patungans[_id];
        require(p.status == Status.VALIDATING, "Not in validation");
        require(_isValidator(_id, msg.sender), "Not a validator");
        require(!hasApproved[_id][msg.sender], "Already approved");

        hasApproved[_id][msg.sender] = true;
        currentApprovalCount[_id]++;

        if (currentApprovalCount[_id] >= MIN_APPROVALS) {
            _releaseFunds(_id);
        }
    }

    function claimRefund(uint256 _id) external nonReentrant {
        Patungan storage p = patungans[_id];
        
        bool isExpired = block.timestamp > p.deadline && p.status == Status.OPEN;
        bool validationMIA = block.timestamp > p.validatorDeadline && p.status == Status.VALIDATING;
        
        require(isExpired || validationMIA, "Not eligible for refund");
        
        uint256 amount = userContributions[_id][msg.sender];
        require(amount > 0, "No balance");

        userContributions[_id][msg.sender] = 0;
        idrx.safeTransfer(msg.sender, amount);

        emit RefundClaimed(_id, msg.sender, amount);
    }

    /*//////////////////////////////////////////////////////////////
                           CHAINLINK LOGIC
    //////////////////////////////////////////////////////////////*/

    function _requestRandomValidators(uint256 _id) internal {
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
            })
        );

        vrfRequestToPatunganId[requestId] = _id;
        emit VRFRequested(_id, requestId);
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        uint256 id = vrfRequestToPatunganId[_requestId];
        Patungan storage p = patungans[id];

        delete p.selectedValidators;
        currentApprovalCount[id] = 0;

        uint256 pCount = p.participants.length;
        for (uint i = 0; i < numWords; i++) {
            uint256 index = _randomWords[i] % pCount;
            p.selectedValidators.push(p.participants[index]);
        }

        p.status = Status.VALIDATING;
        p.validatorDeadline = block.timestamp + VALIDATION_PERIOD;

        emit ValidationStarted(id, p.selectedValidators, p.validatorDeadline);
    }

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        for (uint256 i = 0; i < patunganCount; i++) {
            if (patungans[i].status == Status.VALIDATING && block.timestamp > patungans[i].validatorDeadline) {
                return (true, abi.encode(i));
            }
        }
        return (false, "");
    }

    function performUpkeep(bytes calldata performData) external override {
        uint256 id = abi.decode(performData, (uint256));
        Patungan storage p = patungans[id];

        if (p.status == Status.VALIDATING && block.timestamp > p.validatorDeadline) {
            _requestRandomValidators(id);
        }
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL HELPERS
    //////////////////////////////////////////////////////////////*/

    function _releaseFunds(uint256 _id) internal {
        Patungan storage p = patungans[_id];
        p.status = Status.RELEASED;
        
        // Dana dikirim ke Bridge Wallet untuk diteruskan ke Bank oleh Backend
        idrx.safeTransfer(bridgeWallet, p.collectedAmount);
        
        emit FundsReleased(_id, p.collectedAmount, bridgeWallet);
    }

    function _isValidator(uint256 _id, address _user) internal view returns (bool) {
        address[] memory v = patungans[_id].selectedValidators;
        for(uint i=0; i < v.length; i++) {
            if(v[i] == _user) return true;
        }
        return false;
    }
}