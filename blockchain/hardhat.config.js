require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {},

    // Ethereum Sepolia Testnet
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 11155111,
    },
  },

  mocha: {
    timeout: 20000,
  },
};
