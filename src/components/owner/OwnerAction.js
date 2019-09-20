import AuthenticationContract from '../../../build/contracts/Authentication.json'
import store from '../../store'

const contract = require('truffle-contract')

export const changeType = (type,id) => ({
    type: 'CHANGE_USER_TYPE',
    data:{
        type,
        id
    }
});

export const changeState = (status,id) => ({
    type: 'CHANGE_USER_STATE',
    data:{
        status,
        id
    }
});

export function changeUserState(status, userid) {
    let web3 = store.getState().web3.web3Instance
    if (typeof web3 !== 'undefined') {
        return (dispatch) => {
            const authentication = contract(AuthenticationContract)
            authentication.setProvider(web3.currentProvider)

            // Declaring this for later so we can chain functions on Authentication.
            var authenticationInstance

            // Get current ethereum wallet.
            web3.eth.getCoinbase((error, coinbase) => {
                // Log errors, if any.
                if (error) {
                    console.error(error);
                }

                authentication.deployed().then(function(instance) {
                    authenticationInstance = instance
                    let index = 0;
                    let userdata = store.getState().common.data.userData;
                    userdata.forEach((key, i) => {
                        if(key.id === userid) index = i;
                    });
                    authenticationInstance.updateUserState(userdata[index].address, status === "Approved" ? 1 : 0,{from: coinbase})
                    .then(function(result) {
                        return dispatch(changeState(status, userid));
                    })
                    .catch(function(err) {
                        alert("check your metamask!");
                        console.log(err);
                    })
                });
            });
        }; 
    }else {
        alert('Web3 is not initialized.');
    }
};

export function changeUserType(type, userid) {
    let numUserType = 2;
    if(type === 'Buyer')   numUserType = 0;
    else if(type === 'Seller')   numUserType = 1;
    
    let web3 = store.getState().web3.web3Instance
    if (typeof web3 !== 'undefined') {
        return (dispatch) => {
            const authentication = contract(AuthenticationContract)
            authentication.setProvider(web3.currentProvider)

            // Declaring this for later so we can chain functions on Authentication.
            var authenticationInstance

            // Get current ethereum wallet.
            web3.eth.getCoinbase((error, coinbase) => {
                // Log errors, if any.
                if (error) {
                    console.error(error);
                }

                authentication.deployed().then(function(instance) {
                    authenticationInstance = instance
                    let index = 0;
                    let userdata = store.getState().common.data.userData;
                    userdata.forEach((key, i) => {
                        if(key.id === userid) index = i;
                    });
                    authenticationInstance.updateUserType(userdata[index].address, numUserType,{from: coinbase})
                    .then(function(result) {
                        return dispatch(changeType(type,userid));
                    })
                    .catch(function(err) {
                        alert("check your metamask!");
                        console.log(err);
                    })
                });          
            });
        }; 
    }else {
        alert('Web3 is not initialized.');
    }
};
