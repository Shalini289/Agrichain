// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgriChain {

    // 🌾 Crop Structure
    struct Crop {
        uint id;
        string name;
        uint quantity;
        uint price;
        address farmer;
        address currentOwner;
        uint timestamp;
    }

    // 🔁 Ownership Transfer History
    struct Transfer {
        address from;
        address to;
        uint timestamp;
    }

    // 💳 Payment Escrow
    struct Payment {
        address buyer;
        address seller;
        uint amount;
        bool released;
    }

    uint public cropCount;

    mapping(uint => Crop) public crops;
    mapping(uint => Transfer[]) public history;
    mapping(uint => Payment) public payments;

    // 📢 Events
    event CropAdded(uint id, string name, address farmer);
    event OwnershipTransferred(uint cropId, address from, address to);
    event PaymentCreated(uint cropId, uint amount);
    event PaymentReleased(uint cropId);

    // 🌾 Add Crop
    function addCrop(
        string memory _name,
        uint _quantity,
        uint _price
    ) public {

        cropCount++;

        crops[cropCount] = Crop(
            cropCount,
            _name,
            _quantity,
            _price,
            msg.sender,
            msg.sender,
            block.timestamp
        );

        emit CropAdded(cropCount, _name, msg.sender);
    }

    // 🔁 Transfer Ownership
    function transferOwnership(uint _cropId, address _to) public {
        require(
            crops[_cropId].currentOwner == msg.sender,
            "Not owner"
        );

        history[_cropId].push(
            Transfer(msg.sender, _to, block.timestamp)
        );

        crops[_cropId].currentOwner = _to;

        emit OwnershipTransferred(_cropId, msg.sender, _to);
    }

    // 💳 Create Payment (Escrow)
    function createPayment(uint _cropId, address _seller) public payable {
        require(msg.value > 0, "No ETH sent");

        payments[_cropId] = Payment(
            msg.sender,
            _seller,
            msg.value,
            false
        );

        emit PaymentCreated(_cropId, msg.value);
    }

    // 💰 Release Payment
    function releasePayment(uint _cropId) public {
        Payment storage p = payments[_cropId];

        require(!p.released, "Already released");

        payable(p.seller).transfer(p.amount);

        p.released = true;

        emit PaymentReleased(_cropId);
    }

    // 📜 Get Transfer History
    function getHistory(uint _cropId)
        public view returns (Transfer[] memory)
    {
        return history[_cropId];
    }

    // 📄 Get Crop Details
    function getCrop(uint _cropId)
        public view returns (Crop memory)
    {
        return crops[_cropId];
    }

    // 💳 Get Payment Info
    function getPayment(uint _cropId)
        public view returns (Payment memory)
    {
        return payments[_cropId];
    }
}