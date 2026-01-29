// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PatunganEscrow is ReentrancyGuard {
    enum Status { Open, Funded, Disbursed, Cancelled }

    struct RoomInfo {
        string title;
        address organizer;
        address recipient; 
        address tokenAddress; 
        uint256 targetAmount;
        uint256 currentBalance;
        uint256 deadline;
        Status status;
    }

    RoomInfo public info;
    address public platformAdmin;
    address[] public participants;
    address[] public validators;
    mapping(address => uint256) public contributions;
    mapping(address => bool) public hasApproved;
    uint256 public approvalCount;

    event Deposited(address indexed user, uint256 amount);
    event ValidatorsSelected(address[] selectedValidators);
    event Disbursed(address indexed recipient, uint256 amount);
    event ETHReceived(address indexed sender, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == platformAdmin, "Hanya platform admin");
        _;
    }

    modifier onlyValidator() {
        bool isValidator = false;
        for (uint256 i = 0; i < validators.length; i++) {
            if (validators[i] == msg.sender) {
                isValidator = true;
                break;
            }
        }
        require(isValidator, "Hanya validator");
        _;
    }

    constructor(
        string memory _title,
        address _organizer,
        address _recipient,
        address _tokenAddress,
        uint256 _targetAmount,
        uint256 _duration,
        address _platformAdmin
    ) {
        info = RoomInfo({
            title: _title,
            organizer: _organizer,
            recipient: _recipient,
            tokenAddress: _tokenAddress,
            targetAmount: _targetAmount,
            currentBalance: 0,
            deadline: block.timestamp + _duration,
            status: Status.Open
        });
        platformAdmin = _platformAdmin;
    }

    receive() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }

    function deposit(uint256 _amount) external nonReentrant {
        require(info.status == Status.Open, "Patungan ditutup");
        require(block.timestamp < info.deadline, "Melewati deadline");

        IERC20(info.tokenAddress).transferFrom(msg.sender, address(this), _amount);
        
        if (contributions[msg.sender] == 0) {
            participants.push(msg.sender);
        }
        
        contributions[msg.sender] += _amount;
        info.currentBalance += _amount;

        emit Deposited(msg.sender, _amount);

        if (info.currentBalance >= info.targetAmount) {
            info.status = Status.Funded;
            _selectValidators();
        }
    }

    function _selectValidators() internal {
        uint256 total = participants.length;
        uint256 count;

        if (total < 10) {
            count = total / 2;
            if (count < 2) count = 2;
            if (count > 3) count = 3;
            if (count > total) count = total;
        } else if (total <= 50) {
            count = 5;
        } else {
            count = 11;
        }

        address[] memory pool = participants;
        for (uint256 i = 0; i < count; i++) {
            uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, i, msg.sender))) % (pool.length - i);
            validators.push(pool[rand]);
            pool[rand] = pool[pool.length - 1 - i];
        }
        emit ValidatorsSelected(validators);
    }

    function getValidators() external view returns (address[] memory) {
        return validators;
    }

    function voteApproval() external onlyValidator nonReentrant {
        require(info.status == Status.Funded, "Belum Funded");
        require(!hasApproved[msg.sender], "Sudah vote");

        hasApproved[msg.sender] = true;
        approvalCount++;

        if (approvalCount == validators.length) {
            _disburseFunds();
        }
    }

    function _disburseFunds() internal {
        info.status = Status.Disbursed;
        
        uint256 fee = (info.currentBalance * 1) / 100;
        uint256 minFee = 2000 * 10**6; 
        if (fee < minFee) fee = minFee;

        uint256 amountToRecipient = info.currentBalance - fee;
        IERC20(info.tokenAddress).transfer(info.recipient, amountToRecipient);

        emit Disbursed(info.recipient, amountToRecipient);
    }

    function withdrawAdminFees() external onlyAdmin nonReentrant {
        require(info.status == Status.Disbursed, "Dana patungan harus dicairkan ke penerima dulu");
        
        uint256 balance = IERC20(info.tokenAddress).balanceOf(address(this));
        require(balance > 0, "Tidak ada fee untuk ditarik");
        IERC20(info.tokenAddress).transfer(platformAdmin, balance);
    }

    function withdrawETH() external onlyAdmin {
        require(info.status == Status.Disbursed || info.status == Status.Cancelled, "Hanya bisa tarik ETH setelah proyek selesai");
        
        uint256 ethBalance = address(this).balance;
        require(ethBalance > 0, "Tidak ada ETH");

        (bool success, ) = payable(platformAdmin).call{value: ethBalance}("");
        require(success, "Gagal mengirim ETH");
    }

    function getCurrentBalance() external view returns (uint256) {
        return info.currentBalance;
    }

    function getRemainingAmount() external view returns (uint256) {
        if (info.currentBalance >= info.targetAmount) return 0;
        return info.targetAmount - info.currentBalance;
    }
}