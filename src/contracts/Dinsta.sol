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

    event ImageTipped(
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

    // tip images
    // TODO: @ Check Tipper gives ether > 0
    function tipImageOwner(uint _id) public payable {
        // make sure id is valid
        require(_id > 0 && _id <= imageCount);
        // fetch image
        Image memory _image = images[_id];

        address payable _author = _image.author;

        // pay author by sending ether
        address(_author).transfer(msg.value);

        // increment tip amount
        _image.tipAmount = _image.tipAmount + msg.value;

        // update the image
        images[_id] = _image;

        emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
    }
}