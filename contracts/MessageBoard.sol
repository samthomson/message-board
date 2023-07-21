// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MessageBoard {
    struct Message {
        address author;
        string content;
    }

    Message[] public messages;

    function writeMessage(string calldata message) public {
        messages.push(Message(msg.sender, message));
    }

    function getMessagesCount() public view returns (uint256) {
        return messages.length;
    }
}
