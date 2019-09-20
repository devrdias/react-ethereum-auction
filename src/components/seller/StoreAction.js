import AuthenticationContract from '../../../build/contracts/Authentication.json'
import EcommerceContract from '../../../build/contracts/Ecommerce.json'
import store from 'store'

const contract = require('truffle-contract')

export const storecreate = (data) => ({
    type: 'CREATE_STORE',
    data
});

export const productcreate = (data) => ({
    type: 'CREATE_PRODUCT',
    data
})

export function CreateStore(data) {

    // return function(dispatch) {
    //     dispatch(storecreate(data))
    // }
    let web3 = store.getState().web3.web3Instance
    
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {
          // Using truffle-contract we create the authentication object.
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
    
              authenticationInstance.createStore(data.name, data.email, data.storeFrontImage, data.arbiter, {from: coinbase})
              .then(function(result) {
                dispatch(storecreate(data));
              })
              .catch(function(error) {
                console.error('Error obj ', error)
              })
            })
          })
        }
    } else {
    console.error('Web3 is not initialized.');
    }
};



export function CreateProduct(data) {
  
  let web3 = store.getState().web3.web3Instance
  
  if (typeof web3 !== 'undefined') {

      return function(dispatch) {
        
        // Using truffle-contract we create the authentication object.
        const authentication = contract(AuthenticationContract)
        authentication.setProvider(web3.currentProvider)
        const Ecommerce = contract(EcommerceContract)
        Ecommerce.setProvider(web3.currentProvider)
  
        // Declaring this for later so we can chain functions on Authentication.
        var ecommerce
        var prodCount = 0;
        // Get current ethereum wallet.
        web3.eth.getCoinbase((error, coinbase) => {
          // Log errors, if any.
          if (error) {
            console.error(error);
          }
  
          Ecommerce.deployed().then(function(instance) {
            ecommerce = instance
  
            let wei = web3.toWei(data.price, "ether");
            //data.price = wei;
            ecommerce.addProduct(data.name, data.category, data.startTime, wei, data.productCondition, {from: coinbase})
            .then(function(result) {
              return ecommerce.productCount.call();
            })
            .then(function(result) {
              prodCount = result.toNumber();
              data.id = prodCount;
              data.seller = coinbase;
              return ecommerce.updateProductImage(data.id, data.imageLink, {from: coinbase});
            })
            .then(function(result) {
              return ecommerce.updateProductDesc(data.id, data.descLink, {from: coinbase});
            })
            .then(function(result) {
              dispatch(productcreate(data));
            })
            .catch(function(error) {
              console.error('Error obj in CreateProduct ', error)
            })
          })
        })
      }
  } else {
    console.error('Web3 is not initialized.');
  }
};