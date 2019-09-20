# Project details

An open Marketplace, built on top of Ethereum network, using smart contracts to provide interaction between buyers, sellers and arbiters.

The contract also has a Escrow process implemented, to prevent frauds.

### Main functionallities:
* Sellers can sell products and receive in Ether
* Buyers can buy products using Ether
* An Escrow process will take care of releasing the Ether to buyer or seller
* Contract owner is responsible to aprove Sellers and Arbiters for them to start using the Plataform
* Arbiters are responsible to reslease or refund balandes to users, depending on each case.


### Users functinalitty
* if you are the contract Owner, you can simple login, not need to sign up
* if you are a buyer, seller or an arbiter , you need to sign up to interact with the contracts
* buyers don't need to be aproved by contract owner to interact with the website
* sellers/arbiters needs to be aproved to interact with the website


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Requirements

To run and interact with this project, you will need the following tools installed on your local environment:

* ```node v8.11.1```
* ```npm v.6.1.0``` 
* ```truffle v.4.1.12 ```
* ```ganache-cli v6.1.3```
* [Metamask](https://metamask.io/) or [Brave Browser](https://brave.com/)

### To get started

Download or clone this repo
```
git clone https://www.gitthub.com/devrdias/marketh marketh
```
Install all dependencies
```
npm install
```
Run ganache-cli on port 8545
```
ganache-cli --gasLimit 800000000
```
Migrate all contracts to your ganache running instance
```
truffle migrate --reset
```
Run the project
```
npm start
```

```
It's recommended to starat Ganache with gasLimit of 800000000 to migrate contracts
```


## Running the tests

```
truffle test
```


## Additional Notes

This project was built as a Final Project of [Consensys Academy 2018 Developer Program](https://consensys.net/academy/2018developer/)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

