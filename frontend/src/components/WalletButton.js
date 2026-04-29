"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { ethers } from "ethers";

export default function WalletButton() {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    setAccount(accounts[0]);
  };

  return (
    <button onClick={connectWallet}>
      <Wallet size={16} />
      {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Wallet"}
    </button>
  );
}
