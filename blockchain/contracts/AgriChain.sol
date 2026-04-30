// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgriChain {
    struct Crop {
        uint id;
        string name;
        uint quantity;
        uint price;
        address farmer;
        address currentOwner;
        uint timestamp;
    }

    struct Transfer {
        address from;
        address to;
        uint timestamp;
    }

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

    event CropAdded(uint id, string name, address farmer);
    event OwnershipTransferred(uint cropId, address from, address to);
    event PaymentCreated(uint cropId, uint amount);
    event PaymentReleased(uint cropId);

    function addCrop(
        string memory _name,
        uint _quantity,
        uint _price
    ) public {
        require(bytes(_name).length > 0, "Name required");
        require(_quantity > 0, "Quantity required");
        require(_price > 0, "Price required");

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

    function transferOwnership(uint _cropId, address _to) public {
        require(_cropId > 0 && _cropId <= cropCount, "Crop not found");
        require(_to != address(0), "Invalid recipient");
        require(crops[_cropId].currentOwner == msg.sender, "Not owner");

        history[_cropId].push(Transfer(msg.sender, _to, block.timestamp));
        crops[_cropId].currentOwner = _to;

        emit OwnershipTransferred(_cropId, msg.sender, _to);
    }

    function createPayment(uint _cropId, address _seller) public payable {
        require(_cropId > 0 && _cropId <= cropCount, "Crop not found");
        require(msg.value > 0, "No ETH sent");
        require(_seller == crops[_cropId].currentOwner, "Seller is not owner");
        require(
            payments[_cropId].amount == 0 || payments[_cropId].released,
            "Payment already active"
        );

        payments[_cropId] = Payment(msg.sender, _seller, msg.value, false);

        emit PaymentCreated(_cropId, msg.value);
    }

    function releasePayment(uint _cropId) public {
        Payment storage p = payments[_cropId];

        require(p.amount > 0, "Payment not found");
        require(msg.sender == p.buyer, "Only buyer can release");
        require(!p.released, "Already released");

        p.released = true;

        (bool sent, ) = payable(p.seller).call{value: p.amount}("");
        require(sent, "Payment transfer failed");

        emit PaymentReleased(_cropId);
    }

    function getHistory(uint _cropId)
        public view returns (Transfer[] memory)
    {
        return history[_cropId];
    }

    function getCrop(uint _cropId)
        public view returns (Crop memory)
    {
        return crops[_cropId];
    }

    function getPayment(uint _cropId)
        public view returns (Payment memory)
    {
        return payments[_cropId];
    }
}
