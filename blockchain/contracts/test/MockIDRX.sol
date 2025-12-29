// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockIDRX is ERC20 {
    constructor() ERC20("Mock IDRX", "IDRX") {
        // Cetak 1 Miliar token untuk testing
        _mint(msg.sender, 1000000000 * 10**decimals());
    }

    // Fungsi agar kita bisa minta token gratis saat testing
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    
    // Sesuaikan desimal jika ingin mirip IDRX asli (biasanya 2 atau 6)
    function decimals() public view virtual override returns (uint8) {
        return 6; 
    }
}