import AuthenticationContract from '../../../build/contracts/Authentication.json'
import EcommerceContract from '../../../build/contracts/Ecommerce.json'
import store from 'store'

const contract = require('truffle-contract')

export const escrowRelease = (data) => ({
    type: 'ESCROW_RELEASE',
    data
});

export const escrowRefund = (data) => ({
    type: 'ESCROW_REFUND',
    data
})

export const escrowWithdraw = (data) => ({
  type: 'ESCROW_WITHDRAW',
  data
})

export const purchaseProduct = (data) => ({
  type: 'BUY_PRODUCT',
  data
})


export function buyProduct(data) {
  
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
  
        // Get current ethereum wallet.
        web3.eth.getCoinbase((error, coinbase) => {
          // Log errors, if any.
          if (error) {
            console.error(error);
          }

                    //for testing
                    // data.buyer = coinbase;
                    // data.productState = "Sold";
                    // dispatch(purchaseProduct(data));
                    // return;
  
          Ecommerce.deployed().then(function(instance) {
            ecommerce = instance
  
            ecommerce.buyProduct(data.id, {from: coinbase, value: web3.toWei(data.price, "ether")})
            .then(function(result) {
              data.buyer = coinbase;
              data.productState = "Sold";
              dispatch(purchaseProduct(data));
            })
            .catch(function(error) {
              console.error('Error obj in buyProduct ', error)
            })
          })
        })
      }
  } else {
    console.error('Web3 is not initialized.');
  }
};

export function releaseEscrow(data) {
  
    let web3 = store.getState().web3.web3Instance
    
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {
          // dispatch(escrowRelease(data));
          // return;
          // Using truffle-contract we create the authentication object.
          const authentication = contract(AuthenticationContract)
          authentication.setProvider(web3.currentProvider)
          const Ecommerce = contract(EcommerceContract)
          Ecommerce.setProvider(web3.currentProvider)
    
          // Declaring this for later so we can chain functions on Authentication.
          var ecommerce
    
          // Get current ethereum wallet.
          web3.eth.getCoinbase((error, coinbase) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
    
            Ecommerce.deployed().then(function(instance) {
              ecommerce = instance
    
              ecommerce.releaseAmountToSeller(data.product_id, {from: coinbase})
              .then(function(result) {
                dispatch(escrowRelease(data));
              })
              .catch(function(error) {
                console.error('Error obj in releaseEscrow ', error)
              })
            })
          })
        }
    } else {
      console.error('Web3 is not initialized.');
    }
};

export function refundEscrow(data) {
  
  let web3 = store.getState().web3.web3Instance
  
  if (typeof web3 !== 'undefined') {

      return function(dispatch) {
        const authentication = contract(AuthenticationContract)
        authentication.setProvider(web3.currentProvider)
        const Ecommerce = contract(EcommerceContract)
        Ecommerce.setProvider(web3.currentProvider)
  
        // Declaring this for later so we can chain functions on Authentication.
        var ecommerce
  
        // Get current ethereum wallet.
        web3.eth.getCoinbase((error, coinbase) => {
          // Log errors, if any.
          if (error) {
            console.error(error);
          }
  
          Ecommerce.deployed().then(function(instance) {
            ecommerce = instance
  
            ecommerce.refundAmountToBuyer(data.product_id, {from: coinbase})
            .then(function(result) {
              dispatch(escrowRefund(data));
            })
            .catch(function(error) {
              console.error('Error obj in refundEscrow ', error)
            })
          })
        })
      }
  } else {
    console.error('Web3 is not initialized.');
  }
};



export function withdrawEscrow(data) {
  
  let web3 = store.getState().web3.web3Instance
  
  if (typeof web3 !== 'undefined') {

      return function(dispatch) {
        const authentication = contract(AuthenticationContract)
        authentication.setProvider(web3.currentProvider)
        const Ecommerce = contract(EcommerceContract)
        Ecommerce.setProvider(web3.currentProvider)
  
        // Declaring this for later so we can chain functions on Authentication.
        var ecommerce
  
        // Get current ethereum wallet.
        web3.eth.getCoinbase((error, coinbase) => {
          // Log errors, if any.
          if (error) {
            console.error(error);
          }
  
          Ecommerce.deployed().then(function(instance) {
            ecommerce = instance
  
            ecommerce.withdraw(data.product_id, {from: coinbase})
            .then(function(result) {
              dispatch(escrowWithdraw(data));
            })
            .catch(function(error) {
              console.error('Error obj in withdrawEscrow ', error)
            })
          })
        })
      }
  } else {
    console.error('Web3 is not initialized.');
  }
};
