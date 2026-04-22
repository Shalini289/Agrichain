import { ethers } from "ethers";
import fs from "fs";
import path from "path";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// ⚠️ MUST be real private key (not API key)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load ABI safely
const abiPath = path.resolve("config/abi.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);