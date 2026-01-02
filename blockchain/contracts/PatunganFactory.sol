// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PatunganEscrow} from "./PatunganEscrow.sol";

contract PatunganFactory {
    address public platformAdmin;
    address[] public allRooms;

    event RoomCreated(address indexed roomAddress, address indexed organizer, string title);

    constructor() {
        platformAdmin = msg.sender; // Orang yang deploy factory jadi admin default
    }

    function createRoom(
        string memory _title,
        address _tokenAddress,
        uint256 _targetAmount,
        uint256 _duration
    ) external returns (address) {
        // Deploy kontrak PatunganEscrow baru
        PatunganEscrow newRoom = new PatunganEscrow(
            _title,
            msg.sender, // Penyelenggara adalah orang yang memanggil fungsi ini
            _tokenAddress,
            _targetAmount,
            _duration,
            platformAdmin
        );

        address roomAddress = address(newRoom);
        allRooms.push(roomAddress);

        emit RoomCreated(roomAddress, msg.sender, _title);
        
        return roomAddress;
    }

    function getAllRooms() external view returns (address[] memory) {
        return allRooms;
    }
    
    // Fungsi untuk mengganti admin jika diperlukan di masa depan
    function setPlatformAdmin(address _newAdmin) external {
        require(msg.sender == platformAdmin, "Hanya admin");
        platformAdmin = _newAdmin;
    }
}