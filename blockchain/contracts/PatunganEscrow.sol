// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
    uint256 public totalAdminFees; 
    
    address[] public participants;
    address[] public validators;
    mapping(address => uint256) public contributions;
    mapping(address => bool) public hasApproved;
    uint256 public approvalCount;

    event Deposited(address indexed user, uint256 baseAmount, uint256 feeAmount);
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
        uint256 _deadline
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

    function deposit(uint256 _amount, uint256 _fee) external nonReentrant {
        require(info.status == Status.Open, "Patungan ditutup");
        require(block.timestamp < info.deadline, "Melewati deadline");

        uint256 totalToTransfer = _amount + _fee;
        IERC20(info.tokenAddress).transferFrom(msg.sender, address(this), totalToTransfer);
        
        if (contributions[msg.sender] == 0) {
            participants.push(msg.sender);
        }
        
        contributions[msg.sender] += _amount;
        info.currentBalance += _amount; 
        totalAdminFees += _fee;        

        emit Deposited(msg.sender, _amount, _fee);

        if (info.currentBalance >= info.targetAmount) {
            info.status = Status.Funded;
            _selectValidators();
        }
    }

    // Fungsi withdraw untuk Penerima (Hanya dana pokok)
    function withdraw() external {
        require(msg.sender == recipient, "Bukan penerima");
        require(currentBalance >= targetAmount, "Target belum tercapai");
        require(!isWithdrawn, "Dana sudah ditarik");

        isWithdrawn = true;
        token.transfer(recipient, currentBalance);
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
      
        uint256 amountToRecipient = info.currentBalance;
        IERC20(info.tokenAddress).transfer(info.recipient, amountToRecipient);

        emit Disbursed(info.recipient, amountToRecipient);
    }

    function withdrawAdminFees() external onlyAdmin nonReentrant {
        uint256 amountToWithdraw = totalAdminFees;
        require(amountToWithdraw > 0, "Tidak ada fee untuk ditarik");
        
        totalAdminFees = 0; 
        IERC20(info.tokenAddress).transfer(platformAdmin, amountToWithdraw);
    }

    function withdrawETH() external onlyAdmin {
        uint256 ethBalance = address(this).balance;
        require(ethBalance > 0, "Tidak ada ETH");
        (bool success, ) = payable(platformAdmin).call{value: ethBalance}("");
        require(success, "Gagal mengirim ETH");
    }

    function getCurrentBalance() external view returns (uint256) {
        return info.currentBalance;
    }
}