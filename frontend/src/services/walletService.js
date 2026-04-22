import { ethers } from "ethers";

// 🔗 Connect wallet
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  const accounts = await provider.send("eth_requestAccounts", []);

  return accounts[0];
};

// ✍ Sign message (for wallet login)
export const signMessage = async (message) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const signature = await signer.signMessage(message);

  return signature;
};