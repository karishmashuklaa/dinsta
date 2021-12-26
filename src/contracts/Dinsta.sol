pragma solidity ^0.5.0;

contract Dinsta {
    string public name = "Dinsta";

    // store images
    uint public imageCount = 0;
    mapping(uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    // create images
    function uploadImage(string memory _imgHash, string memory _description) public {

        require(bytes(_imgHash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0x0));

        imageCount ++;

        // add image to contract
        images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);

        // trigger the event
        emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
    }
}