// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.17;

import "hardhat/console.sol";

// Defines a contract named `SongPortal`.
// A contract is a collection of functions and data (its state). Once deployed, a contract resides at a specific address on the Ethereum blockchain. Learn more: https://solidity.readthedocs.io/en/v0.5.10/structure-of-a-contract.html
contract SongPortal {
    uint256 totalSongs;

    //Emitted when wave function is called
    //Smart contract events are a way for your contract to communicate that something happened on the blockchain to your app front-end, which can be 'listening' for certain events and take action when they happen.
    event NewSong(address indexed from, uint256 timestamp, string message);
    //Structs are a collection of variables/objects stored together
    struct SongData {
        address waver; // the address of the user who sent a song
        string message;
        uint256 timestamp; // timestamp of the song
    }

    // an array of songs
    SongData[] songs;

    /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved/sent a song at us.
     */

    mapping(address => uint256) public lastWavedAt;

    // Similar to many class-based object-oriented languages, a constructor is a special function that is only executed upon contract creation.
    // Constructors are used to initialize the contract's data. Learn more:https://solidity.readthedocs.io/en/v0.5.10/contracts.html#constructors
    constructor() {
        console.log("This is Reine's contract and I am smart!");
    }

    // A public function that lets a user send a message every 1 minute
    function wave(string memory _message) public {
        /*
         * We need to make sure the current timestamp is at least 1-minute bigger than the last timestamp we stored
         */
        require(
            lastWavedAt[msg.sender] + 50 seconds < block.timestamp,
            "Please wait for at least 1 minute before sending a song"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalSongs += 1;
        console.log("%s has sent a song!", msg.sender);

        songs.push(SongData(msg.sender, _message, block.timestamp));

        emit NewSong(msg.sender, block.timestamp, _message);
    }

    function getAllSongs() public view returns (SongData[] memory) {
        return songs;
    }

    function getTotalSongs() public view returns (uint256) {
        return totalSongs;
    }
}
