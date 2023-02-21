// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Locks {
    struct Lock {
        uint amount;
        uint unlockTime;
    }
    mapping(address => Lock) private locks;

    event Withdrawal(address who, uint amount, uint when);

    function lock(uint unlockTime) external payable {
        require(block.timestamp < unlockTime, "Unlock time should be in the future");
        require(locks[msg.sender].amount == 0, "Lock already exists - only one lock allowed per address");

        locks[msg.sender] = Lock(msg.value, unlockTime);
    }

    function withdraw() external {
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        require(locks[msg.sender].amount > 0, "You have no locked funds");
        require(block.timestamp >= locks[msg.sender].unlockTime, "You can't withdraw yet");

        emit Withdrawal(msg.sender, locks[msg.sender].amount, block.timestamp);

        payable(msg.sender).transfer(locks[msg.sender].amount);
        delete locks[msg.sender];
    }
}
