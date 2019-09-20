pragma solidity ^0.4.24;

import "./zeppelin/ownership/Ownable.sol";
import "./ReentryProtector.sol";
import "./zeppelin/SafeMath.sol";
import "./Escrow.sol";


/** @title Ecommerce Contract */
contract Ecommerce is Ownable, ReentryProtector {
    
    using SafeMath for uint256;

    function  addStore(
        bytes32 _name, 
        bytes32 _email,
        address _arbiter,
        bytes32 _storeFrontImage,
        address _sellerAddress
    )
        external 
        payable
        notHaveStore(_sellerAddress)
        returns (bool)
    {
        externalEnter();
        storesCount = storesCount.add(1);
        storesById[storesCount] = Store(_sellerAddress, _name, _email, _arbiter, _storeFrontImage, 0/*msg.value*/, 0);
        storesBySellers[_sellerAddress] = storesCount;
        externalLeave();
        return true;
    }

    // ===================================================
    // Fallback
    // ===================================================        
    // this contract will accept any deposit from any person/contract as a donnation when user is creating a store
    // the balance will be added to the EcommerceFactory balance
    function () public payable {
        emit LogDonnationReceived(msg.sender, msg.value);
    }
    
    mapping (uint => Store) public storesById;                   // Stores by id
    mapping (address => mapping(uint => Product)) public stores; // products by stores
    mapping (uint => address) public storesByProductId;          // seller address by product id
    mapping (address => uint) public storesBySellers;            // store by seller address, used to prevent more than one store per user
    mapping (address => uint) public productCountByStore;        // product count by store
    mapping (uint => address) public productsEscrow;             // product escrow control

    uint public storesCount;
    uint public productCount;

    struct Store {
        address storeAddress;
        bytes32 name;
        bytes32 email;
        address arbiter;
        bytes32 storeFrontImage;
        uint balance;
        uint productCount;
    }

    enum ProductCondition {New , Used}
    enum ProductState {ForSale, Sold, Shipped, Received, Deleted}
    struct Product {
        uint id;
        bytes32 name;//
        bytes32 category;//
        bytes32 imageLink;//
        bytes32 descLink;//
        uint startTime;//
        uint price;//
        address buyer;
        ProductCondition productCondition;//
        ProductState productState;//
        bool exists;
    }
    
    modifier notHaveStore(address sellerAddress) { 
        require(!(sellerAddress == storesById[storesBySellers[sellerAddress]].storeAddress), "User already has a store" ); 
        _;
    }
    modifier onlyStoreOwner() { 
        require(storesById[storesBySellers[msg.sender]].storeAddress == msg.sender, "You are not the store owner!" ); 
        _;
    }
    modifier requireProductName(bytes32 _name) { require(!(_name == 0x0), "Product name is mandatory"); _;}
    modifier requireProductCategory(bytes32 _productCategory) { require(!(_productCategory == 0x0), "Product category is mandatory"); _;}
    modifier requireDescLink(bytes32 _descLink) { require(!(_descLink == 0x0), "Product description is mandatory"); _;}
    modifier requireImageLink(bytes32 _imageLink) { require(!(_imageLink == 0x0), "Product image is mandatory"); _;}
    modifier requireStartTime(uint _startTime) { require(_startTime > 0 , "Listing start time is mandatory"); _;}
    modifier requirePrice(uint _price) { require(_price > 0 , "Product price is mandatory"); _;}
    modifier productExists(uint _id) { require( stores[storesByProductId[_id]][_id].exists, "Product not found."); _; }
    modifier verifyCaller (address _caller) { require(msg.sender == _caller, "Caller not authorized to use this function."); _;}
    
    modifier validProductCondition(uint _productCondition) { 
        require(ProductCondition(_productCondition) == ProductCondition.New || ProductCondition(_productCondition) == ProductCondition.Used, "Product name is mandatory"); 
        _;
    }
    modifier forSale (uint _id) { 
        require(stores[storesByProductId[_id]][_id].productState == ProductState.ForSale, "Product not on Sale state"); 
        _; 
    }
    modifier sold (uint _id) { 
        require(stores[storesByProductId[_id]][_id].productState == ProductState.Sold, "Product not on Sold State"); 
        _;
    }
    modifier shipped (uint _id) { 
        require(stores[storesByProductId[_id]][_id].productState == ProductState.Shipped, "Product not on Shipped state"); 
        _;
    }
    modifier received (uint _id) { 
        require(stores[storesByProductId[_id]][_id].productState == ProductState.Received, "Product not on Received state"); 
        _;
    }
    modifier paidEnough(uint _price) { 
        require(msg.value >= _price, "Not paid enough for the product"); 
        _;
    }
    modifier checkValue(uint _id) {
        // refund buyer in case msg.value > product price
        _;
        uint _price = stores[storesByProductId[_id]][_id].price;
        uint _amountToRefund = msg.value.sub(_price);
        stores[storesByProductId[_id]][_id].buyer.transfer(_amountToRefund);
        emit LogCheckValue("Amount to refund", _amountToRefund);
    }

    
    event LogProductRemoved(bytes32 message, uint productCount);
    event LogDonnationReceived(address sender, uint value);
    event LogForSale(bytes32 message, uint id);
    event LogSold(bytes32 message, uint id);
    event LogShipped(bytes32 message, uint id);
    event LogReceived(bytes32 message, uint id);
    event LogCheckValue(bytes32 message, uint _amount);
    event LogEscrowCreated(uint id, address buyer, address seller, address arbiter);
    event LogReleaseAmountToSeller(bytes32 message, uint productId, address caller);
    event LogRefundAmountToBuyer(bytes32 message, uint productId, address caller);
    event LogWithdraw(bytes32 message, uint productId, address caller);
    event LogProductUpdated(bytes32 message, uint productId);


   /** @dev Add product to stores mapping - imageLink and descLink are initialized with blanks,
      * @dev this function should be used in conjunt with addProductDetail, to update imageLink and descLink
      * @param _name product name
      * @param _category product category
      * @param _startTime listing start time
      * @param _price product price in Wei 
      * @param _productCondition product condition
      * @return product index
      */    
    function addProduct(
        bytes32 _name, 
        bytes32 _category, 
        uint _startTime, 
        uint _price, 
        uint _productCondition
    ) 
        external 
        onlyStoreOwner
        requireProductName(_name)
        requireProductCategory(_category)
        requireStartTime(_startTime)
        requirePrice(_price)
        validProductCondition(_productCondition)
    {
        externalEnter();
        
        productCount = productCount.add(1);

        Product memory product = Product(
            productCount,
            _name, 
            _category, 
            "empty", 
            "empty", 
            _startTime, 
            _price, 
            0x0, 
            ProductCondition(_productCondition),  
            ProductState.ForSale,
            true
        );

        stores[msg.sender][productCount] = product; 
        storesByProductId[productCount] = msg.sender;

        // update product count by store
        productCountByStore[msg.sender] = productCountByStore[msg.sender].add(1);        
        emit LogForSale("Product for Sale:", productCountByStore[msg.sender]);
        externalLeave();
    }

     /** @dev Update product image
      * @param _id  product Id
      * @param _imageLink IFPS address of the image
      */    
    function updateProductImage(
        uint _id,
        bytes32 _imageLink
    ) 
        external 
        onlyStoreOwner
        productExists(_id)
        requireImageLink(_imageLink)
    {
        externalEnter();
        stores[storesByProductId[_id]][_id].imageLink = _imageLink;
        emit LogProductUpdated("Product image updated:", _id);
        externalLeave();
    }

     /** @dev Update product description
      * @param _id  product Id
      * @param _descLink IFPS address of product description
      */    
    function updateProductDesc(
        uint _id,
        bytes32 _descLink
    ) 
        external 
        onlyStoreOwner
        productExists(_id)
        requireDescLink(_descLink)
    {
        externalEnter();
        stores[storesByProductId[_id]][_id].descLink = _descLink;
        emit LogProductUpdated("Product description updated:", _id);
        externalLeave();
    }


    /** @dev Update product state to Deleted
      * @param _id product id
      */    
    function removeProduct(uint _id) 
        external 
        onlyStoreOwner
        productExists(_id)
        forSale(_id)
    {
        externalEnter();
        stores[msg.sender][_id].productState = ProductState.Deleted;
        productCountByStore[msg.sender] = productCountByStore[msg.sender].sub(1);
        emit LogProductRemoved("Product removed:", _id);
        externalLeave();
    }
    
    
    /** @dev Get product details 
      * @param _id product index
      * @return Product struct
      */    
    function getProduct(uint _id) 
        external 
        productExists(_id)
        view 
        returns(
            uint id, 
            bytes32 name, 
            bytes32 category, 
            uint startTime, 
            uint price, 
            address buyer, 
            ProductCondition condition,
            ProductState productState
        ) 
    {
        Product memory product = stores[storesByProductId[_id]][_id]; // load product from memory
        return (
            product.id, 
            product.name, 
            product.category, 
            product.startTime,
            product.price, 
            product.buyer, 
            product.productCondition,
            product.productState
        );
    }


    /** @dev Get product IFPS addresses for details 
      * @param _id product index
      * @return Product image link , product Desciption link
      */    
    function getProductDetails(uint _id) 
        external 
        productExists(_id)
        view 
        returns(
            bytes32 imageLink, 
            bytes32 descLink
        ) 
    {
        Product memory product = stores[storesByProductId[_id]][_id]; // load product from memory
        return (
            product.imageLink, 
            product.descLink
        );
    }

    
    /** @dev Buy a product 
      * @param _id product name
      * @return product index
      */    
    function buyProduct(uint _id) 
        external 
        payable 
        productExists(_id)
        forSale(_id)
        paidEnough(stores[storesByProductId[_id]][_id].price)
        checkValue(_id)

    {
        
        externalEnter();

        stores[storesByProductId[_id]][_id].buyer = msg.sender;
        stores[storesByProductId[_id]][_id].productState = ProductState.Sold;
        emit LogSold("Product sold", _id);

        //function initEscrow(uint _id, uint _value, address _buyer)
        
        initEscrow(_id, stores[storesByProductId[_id]][_id].price, msg.sender); // create Escrow contract       
        
        externalLeave();
    }


    /** @dev set product state to Shipped
     * @param _id product index
     */ 
    function shipItem(uint _id) 
        external 
        sold(_id) 
        productExists(_id) 
        verifyCaller(storesByProductId[_id]) 
    {
        externalEnter();
        stores[storesByProductId[_id]][_id].productState = ProductState.Shipped;
        emit LogShipped("Product shipped", _id);
        externalLeave();
    }

    /** @dev set product state to Received
     * @param _id product index
     */ 
    function receiveItem(uint _id) 
        external 
        shipped(_id) 
        productExists(_id) 
        verifyCaller(stores[storesByProductId[_id]][_id].buyer) 
    {
        externalEnter();
        stores[storesByProductId[_id]][_id].productState = ProductState.Received;
        emit LogReceived("Product received", _id);
        externalLeave();
    }
    
    
    /** @dev get product escrow details
      * @param _id product index
      * @return Escrow contract details
      */    
    function escrowDetails(uint _id)
        external
        productExists(_id)
        view 
        returns (address, address, address, uint, bool, uint, uint)
    {
        return Escrow(productsEscrow[_id]).escrowDetails();
    }
    
    
    /** @dev Function to release amount to the seller
      * @param _id product index
      */      
    function releaseAmountToSeller(uint _id) 
        external 
        productExists(_id)
    {
        externalEnter();
        Escrow(productsEscrow[_id]).releaseAmountToSeller(msg.sender);
        emit LogReleaseAmountToSeller("Amount released to Seller", _id, msg.sender);
        externalLeave();
    }


    /** @dev Function to refund amount to buyer
      * @param _id product index
      * @return product index
      */      
    function refundAmountToBuyer(uint _id)
        external 
        productExists(_id)
    {
        externalEnter();
        Escrow(productsEscrow[_id]).refundAmountToBuyer(msg.sender);
        emit LogRefundAmountToBuyer("Amount refunded to Buyer", _id, msg.sender);
        externalLeave();
    }
    
    /** @dev Function to refund amount to buyer
      * @param _id product index
      * @return product index
      */      
    function withdraw(uint _id)
        external 
        productExists(_id)
    {
        externalEnter();
        Escrow(productsEscrow[_id]).withdraw(msg.sender);
        emit LogWithdraw("Withdraw request", _id, msg.sender);
        externalLeave();
    }

    /** @dev internal function to instantiate a escrow contract for the purchased product
     * @param _id product index
     * @param _value product value
     * @param _buyer buyer address
     */ 
    function initEscrow(uint _id, uint _value, address _buyer)
        internal
    {
        // create escrow contract
        emit LogEscrowCreated(_value, _buyer, 0x0, 0x0);

        Escrow escrow = (new Escrow).value(_value)(
            _id, 
            _buyer,
            storesByProductId[_id],  //seller
            storesById[storesBySellers[storesByProductId[_id]]].arbiter //load arbiter from the Store
        );
        productsEscrow[_id] = escrow;
        
        emit LogEscrowCreated(_id, _buyer, storesByProductId[_id], storesById[storesBySellers[storesByProductId[_id]]].arbiter);

    }
    
}