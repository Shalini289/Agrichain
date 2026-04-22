require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {},

    // 🔥 Polygon Amoy Testnet
    amoy: {
      url: process.env.RPC_URL,          // Alchemy / Infura URL
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 80002
    }
  },

  // Optional: cleaner logs
  mocha: {
    timeout: 20000
  }
};