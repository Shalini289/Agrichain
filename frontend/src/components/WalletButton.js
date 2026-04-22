"use client";
import { useState } from "react";
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
    <button className="btn" onClick={connectWallet}>
      {account ? account.slice(0,6)+"..." : "Connect Wallet"}
    </button>
  );
}