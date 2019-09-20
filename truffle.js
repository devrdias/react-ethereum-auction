module.exports = {
  networks: {
    development: {
          host: "localhost",
          port: 8545,
          network_id: "*", // Match any network id
          gas: 4000000 * 100
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/<infura-key>");
      },
      gas: 4500000,
      gasPrice: 25000000000,
      network_id: 4
    },
    ropsten: {
      provider: function() {
        new HDWalletProvider(mnemonic, "https://ropsten.infura.io/<infura-key>");
      },
      gas: 4500000,
      gasPrice: 25000000000,
      network_id: 3
    }
  }
};
