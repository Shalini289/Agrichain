import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let contract;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const normalizePrivateKey = () => {
  let privateKey = process.env.PRIVATE_KEY?.trim();

  if (!privateKey) {
    throw new Error("PRIVATE_KEY missing in .env");
  }

  if (!privateKey.startsWith("0x")) {
    privateKey = `0x${privateKey}`;
  }

  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error("Invalid private key. Expected 64 hex characters.");
  }

  return privateKey;
};

export const getContract = () => {
  if (contract) return contract;

  const rpcUrl = process.env.SEPOLIA_RPC_URL || process.env.RPC_URL;

  if (!rpcUrl) {
    throw new Error("SEPOLIA_RPC_URL or RPC_URL missing in .env");
  }

  if (!process.env.CONTRACT_ADDRESS) {
    throw new Error("CONTRACT_ADDRESS missing in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(normalizePrivateKey(), provider);
  const abiPath = path.join(__dirname, "abi.json");
  const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);
  return contract;
};
