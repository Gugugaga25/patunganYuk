// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PatunganEscrow {
    IERC20 public token; // IDRX
    address public recipient;
    address public admin; // Alamat untuk menarik biaya aplikasi
    uint256 public targetAmount;
    uint256 public deadline;
    
    // Pemisahan Saldo
    uint256 public currentBalance;    // Saldo murni patungan
    uint256 public adminFeeBalance;   // Saldo biaya aplikasi (platform fee)
    
    bool public isWithdrawn = false;

    constructor(
        address _token,
        address _recipient,
        address _admin,
        uint256 _targetAmount,
        uint256 _deadline
    ) {
        token = IERC20(_token);
        recipient = _recipient;
        admin = _admin;
        targetAmount = _targetAmount;
        deadline = _deadline;
    }

    // MODIFIKASI: Fungsi deposit sekarang menerima rincian dana dari Backend/Frontend
    function deposit(uint256 _amount, uint256 _fee) external {
        require(block.timestamp <= deadline, "Patungan sudah berakhir");
        
        // Total yang ditarik dari wallet user adalah dana pokok + fee
        uint256 totalTransfer = _amount + _fee;
        require(token.transferFrom(msg.sender, address(this), totalTransfer), "Transfer gagal");

        // Alokasi Dana
        currentBalance += _amount;      // Masuk ke target patungan
        adminFeeBalance += _fee;        // Masuk ke tabungan admin
    }

    // Fungsi withdraw untuk Penerima (Hanya dana pokok)
    function withdraw() external {
        require(msg.sender == recipient, "Bukan penerima");
        require(currentBalance >= targetAmount, "Target belum tercapai");
        require(!isWithdrawn, "Dana sudah ditarik");

        isWithdrawn = true;
        token.transfer(recipient, currentBalance);
    }

    // Fungsi withdraw khusus Admin (Hanya biaya aplikasi)
    function withdrawAdminFee() external {
        require(msg.sender == admin, "Bukan admin");
        uint256 amountToWithdraw = adminFeeBalance;
        adminFeeBalance = 0; // Reset saldo fee setelah ditarik
        token.transfer(admin, amountToWithdraw);
    }

    function isGoalReached() public view returns (bool) {
        return currentBalance >= targetAmount;
    }
}