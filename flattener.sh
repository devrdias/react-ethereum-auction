rm -rf flats/*

./node_modules/.bin/truffle-flattener contracts/Authentication.sol > contracts_flat/Authentication_flat.sol
