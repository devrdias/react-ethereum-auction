pragma solidity ^0.4.24;

import "./zeppelin/ownership/Ownable.sol";
import "./zeppelin/lifecycle/Killable.sol";
import "./ReentryProtector.sol";
import "./zeppelin/SafeMath.sol";
import "./Ecommerce.sol";

/** @title Authentication contract */
contract Authentication is Ownable, Killable, ReentryProtector {
    using SafeMath for uint256;

    Ecommerce ecommerce;

    constructor(address ecommerceAddress) public payable {
        ecommerce = Ecommerce(ecommerceAddress);
    }

    // ===================================================
    // Fallback
    // ===================================================        
    // this contract will accept any deposit from any person/contract as a donnation when user is creating a store
    // the balance will be added to the EcommerceFactory balance
    function () public payable {
        emit LogDonnationReceived(owner, msg.value);
    }
    
    enum UserType {Buyer, Seller, Arbiter, Owner}
    enum UserState {Pending, Approved}
    struct User {
        bytes32 name;
        bytes32 email;
        bytes32 phoneNumber;
        string profilePicture;
        UserType userType;
        UserState userState;
        bool exists;
    }

    mapping (address => User) public users;
    mapping (uint => address) public usersById;
    // mapping (address => address) public storesBySellers;
    mapping (uint => address) public sellersById;
    mapping (address => uint) public pendingWithdraws;

    uint public usersCount;  
    uint public sellersCount;   

    modifier onlyExistingUser(address user) { require( owner == msg.sender || users[user].exists, "User is not registered"); _; }
    modifier onlyExistingUserID(uint userid) { require(usersById[userid] != 0, "User ID is not registered"); _; }
    modifier onlyValidName(bytes32 name) { require(name.length > 0, "Invalid name"); _; }
    modifier onlyValidEmail(bytes32 email) { require(!(email == 0x0), "Invalid email"); _; }
    modifier onlyValidPhone(bytes32 phoneNumber) { require(!(phoneNumber == 0x0), "Invalid phone number"); _; }
    // modifier onlyValidProfilePicture(bytes32 profilePicture) { require(!(profilePicture == 0x0), "Invalid profile picture"); _; }
    modifier onlyPendingState(address user) { require( users[user].userState == UserState.Pending, "User not on Pending state."); _; }
    modifier onlyApprovedState() { require( users[msg.sender].userState == UserState.Approved, "User not on Approved state."); _; }
    modifier onlySeller { require(users[msg.sender].userType == UserType.Seller, "User is not an seller."); _; }
    // modifier doesNotHaveStore { require(storesBySellers[msg.sender] !=  0x0 , "User already has a store"); _; }
    modifier requireArbiter(address _arbiter) { require( users[_arbiter].userType == UserType.Arbiter , "A store require an arbiter."); _; }

    event LogDonnationReceived(address sender, uint value);
    event LogUserSignUp(address from);
    event LogUserUpdated(address from);
    event LogUpdateUserState(address userAddress , UserState userState);
    event LogUpdateUserType(address userAddress , UserType userType);
    event LogCreateStore(string message, address storeAddress, address seller);

    /** @dev Login a user an returns its data
        * @return User struct
        */   
    function login() 
        external
        view
        onlyExistingUser(msg.sender)
        returns (bytes32, bytes32, bytes32, string, UserType, UserState) 
    {
        if (owner == msg.sender) 
        {
            return (
                stringToBytes32("Owner"),
                stringToBytes32("owner@owner.com"),
                stringToBytes32("12345678"),
                "QmYjh5NsDc6LwU3394NbB42WpQbGVsueVSBmod5WACvpte",
                UserType.Owner,
                UserState.Approved
            );
        } 

        return (
            users[msg.sender].name,
            users[msg.sender].email,
            users[msg.sender].phoneNumber,
            users[msg.sender].profilePicture,
            users[msg.sender].userType,
            users[msg.sender].userState
        );
    }

    /** @dev convert strint to bytes32
     */
    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    /** @dev signup function to register the user
        * @dev Check if user exists.
        * @dev If yes, return user data.
        * @dev If no, check if name was sent.
        * @dev If yes, create and return user.
        * @param _name uset name
        * @param _email  user email  
        * @param _phoneNumber  user phone number
        * @param _profilePicture  user profile picture
        * @param _userType  user type
        * @return name, email, phoneNumber, profilePicture, userType 
        */
    function signup(
        string _name,
        string _email,
        string _phoneNumber,
        string _profilePicture,
        UserType _userType
    )
        external
        payable
        // onlyValidName(_name)
        // onlyValidEmail(_email)
        // onlyValidPhone(_phoneNumber)
        // onlyValidProfilePicture(_profilePicture)
        returns (uint) 
    {

        if (users[msg.sender].exists)  return 0;   //exisitng user

        externalEnter();
        User memory newbie;
        newbie.name = stringToBytes32(_name);
        newbie.email = stringToBytes32(_email);
        newbie.phoneNumber = stringToBytes32(_phoneNumber);
        newbie.profilePicture = _profilePicture;
        
        require(newbie.name.length > 0, "Invalid name");
        require(newbie.email.length > 0, "Invalid email");
        require(newbie.phoneNumber.length > 0, "Invalid phoneNumber");
        // require(newbie.profilePicture.length > 0, "Invalid profilePicture");
        
        newbie.userType = _userType;
        newbie.exists = true;

        if (_userType == UserType.Buyer) {
            newbie.userState = UserState.Approved;
        } else {
            newbie.userState = UserState.Pending;
        }

        emit LogUserSignUp(msg.sender);
        
        users[msg.sender] = newbie;
        
        usersCount = usersCount.add(1);
        usersById[usersCount] = msg.sender;
    
        externalLeave();

        return usersCount;
    }

    /** @dev update user data
    *
    */
    function update(
        bytes32 _name,
        bytes32 _email,
        bytes32 _phoneNumber,
        string _profilePicture
    )
        external
        payable
        onlyValidName(_name)
        onlyValidEmail(_email)
        onlyValidPhone(_phoneNumber)
        // onlyValidProfilePicture(_profilePicture)
        onlyExistingUser(msg.sender)
        returns (bytes32, bytes32, bytes32, string) 
    {
        externalEnter();
        emit LogUserUpdated(msg.sender);
        users[msg.sender].name = _name;
        users[msg.sender].email = _email;
        users[msg.sender].phoneNumber = _phoneNumber;
        users[msg.sender].profilePicture = _profilePicture;
        externalLeave();

        return (
            users[msg.sender].name,
            users[msg.sender].email,
            users[msg.sender].phoneNumber,
            users[msg.sender].profilePicture
        );
    }


    /** @dev Update user State {Pending, Approved}
        * @param _userAddress user address to update
        * @param _userState new user State
        */    
    function updateUserState(address _userAddress, UserState _userState) 
        external 
        payable
        onlyOwner
        onlyExistingUser(_userAddress)
        onlyPendingState(_userAddress)
    {
        externalEnter();
        emit LogUpdateUserState(_userAddress, _userState);
        users[_userAddress].userState = _userState;
        externalLeave();
    }

    /** @dev Update user Type {Buyer, Seller, Arbiter}
        * @param _userAddress  user address to update
        * @param _userType new user type
        */    
    function updateUserType (address _userAddress, UserType _userType) 
        external 
        payable
        onlyOwner 
    {
        externalEnter();
        emit LogUpdateUserType(_userAddress , _userType);
        users[_userAddress].userType = _userType;
        externalLeave();
    }

    /** @dev using withdraw pattern to prevent attacks 
    *   @dev user has to request withdraw before properly transfer the value 
    */
    function requestWithdraw() 
        external 
        payable 
        onlyOwner
        returns (bool) 
    {
        if (msg.value > 0) {
            pendingWithdraws[msg.sender] = pendingWithdraws[msg.sender].add(msg.value);
            return true;
        } else {
            return false;
        }
    }

    /** @dev user effectivelly request withdraw
     */
    function withdraw()  
        external 
        payable 
        onlyOwner
    {
        uint amount = pendingWithdraws[msg.sender];
        pendingWithdraws[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    /** @dev Create new Ecommerce Contract 
      * @param _name store/market name 
      * @param _email contact email from store
      * @param _storeImage IFPS address of the image
      * @param _arbiter address of the partie which is responsible for escrows for the created store
      * @return contract address of the store just created and next store number
      */    
    function createStore(
        bytes32 _name, 
        bytes32 _email, 
        bytes32 _storeImage,
        address _arbiter
    ) 
        external 
        payable 
        onlySeller
        onlyApprovedState
        // doesNotHaveStore
        onlyValidName(_name)
        onlyValidEmail(_email)
        // onlyValidProfilePicture(_storeImage)
        requireArbiter(_arbiter)
        returns (bool) 
    {
        externalEnter();   
        bool addStoreResult = ecommerce.addStore(_name, _email, _arbiter, _storeImage, msg.sender);
        if(addStoreResult)
        {
            sellersCount = sellersCount.add(1); 
            sellersById[sellersCount] = msg.sender;
            emit LogCreateStore("New store created", msg.sender, msg.sender);
        }
        externalLeave();

        return addStoreResult;
    }


    /** @dev get a user's data
    * @return User struct
    */
    function getUser(uint _id) 
        external
        view
        onlyExistingUserID(_id)
        returns ( address, bytes32, bytes32, bytes32, string, UserType, UserState) 
    {
        User memory user = users[usersById[_id]]; // load product from memory
        return (
            usersById[_id],
            user.name,
            user.email,
            user.phoneNumber,
            user.profilePicture,
            user.userType,
            user.userState
        );
    }
}


