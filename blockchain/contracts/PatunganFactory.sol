// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PatunganEscrow.sol";

contract PatunganFactory {
    address public platformAdmin;
    address[] public allRooms;

    event RoomCreated( 
        address indexed roomAddress, 
        address indexed organizer, 
        address indexed recipient, 
        string title
    );

    constructor() {
        platformAdmin = msg.sender; 
    }

    function createRoom(
        string memory _title,
        address _recipient, 
        address _tokenAddress,
        uint256 _targetAmount,
        uint256 _duration
    ) external returns (address) {
        PatunganEscrow newRoom = new PatunganEscrow(
            _title,
            msg.sender,     
            _recipient,     
            _tokenAddress,  
            _targetAmount,  
            _duration,      
            platformAdmin   
        );

        address roomAddress = address(newRoom);
        allRooms.push(roomAddress);

        emit RoomCreated(roomAddress, msg.sender, _recipient, _title);
        
        return roomAddress;
    }

    function getAllRooms() external view returns (address[] memory) {
        return allRooms;
    }
    
    function setPlatformAdmin(address _newAdmin) external {
        require(msg.sender == platformAdmin, "Hanya admin");
        platformAdmin = _newAdmin;
    }
}