pragma solidity ^0.4.24;

import "./zeppelin/SafeMath.sol";


/** @title Escrow Contract - used to control money release on a market. */
contract Escrow  {
    
    using SafeMath for uint256;

    address public buyer;
    address public seller;
    address public arbiter;
    address public owner;

    uint public productId;
    uint public amount;   // price per product
    uint public releaseCount;
    uint public refundCount;

    mapping(address => bool) releaseAmount;
    mapping(address => bool) refundAmount;
    mapping(address => uint) pendingWithdraws;

    bool public fundsDisbursed;
    
    
    event LogReleaseAmountToSeller(string message, address caller, uint releaseCount, uint amount);
    event LogRefundAmountToBuyer(string message, address caller, uint refundCount, uint amount);
    
    
    constructor (
        uint _productId,
        address _buyer,
        address _seller,
        address _arbiter
    ) 
        public 
        payable
    {
        productId = _productId;
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
        fundsDisbursed = false;
        amount = msg.value;
        owner = msg.sender;
    }
    
    
    function escrowDetails() public view returns (address, address, address, uint, bool, uint, uint) {
        return (buyer, seller, arbiter, address(this).balance, fundsDisbursed, releaseCount, refundCount);
    }
    
    function releaseAmountToSeller(address _caller) public {
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        require(_caller == buyer || _caller == seller || _caller == arbiter);
        require(releaseAmount[_caller] != true);

        releaseAmount[_caller] = true;
        releaseCount = releaseCount.add(1);
        
        // two parties have participated of the process, so the money can be released
        if (releaseCount == 2) {
            pendingWithdraws[seller] = pendingWithdraws[seller].add(amount);
            // seller.transfer(amount);
            fundsDisbursed = true;
        }
        
        emit LogReleaseAmountToSeller("Amount released to Seller", _caller, releaseCount, amount);
    }
    
    
    function refundAmountToBuyer(address _caller) public {
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        require(_caller == buyer || _caller == seller || _caller == arbiter);
        require(refundAmount[_caller] != true);

        refundAmount[_caller] = true;
        refundCount = refundCount.add(1);

        // two parties have participated of the process, so the money can be released
        if (refundCount == 2) {
            pendingWithdraws[buyer] = pendingWithdraws[buyer].add(amount);
            // buyer.transfer(amount);
            fundsDisbursed = true;
        }
        
        emit LogRefundAmountToBuyer("Amount refunded to Buyer", _caller, refundCount, amount);
    }

    /** @dev user effectivelly request withdraw
     */
    function withdraw(address _caller) public 
    {
        require(pendingWithdraws[_caller] > 0);
        require(msg.sender == owner);
        require(fundsDisbursed == true);

        uint pendingAmount = pendingWithdraws[_caller];
        pendingWithdraws[_caller] = 0;
        _caller.transfer(pendingAmount);
    }


}