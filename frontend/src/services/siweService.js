import { ethers } from "ethers";

export const signInWithEthereum = async () => {
  if (!window.ethereum) throw new Error("Install MetaMask");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const address = await signer.getAddress();

  // 1️⃣ Get nonce
  const nonceRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/nonce`
  );
  const { nonce } = await nonceRes.json();

  // 2️⃣ Create message
  const message = `Sign this message to login: ${nonce}`;

  // 3️⃣ Sign
  const signature = await signer.signMessage(message);

  // 4️⃣ Verify
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/siwe`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        address,
        signature,
        message,
      }),
    }
  );

  if (!res.ok) throw new Error("SIWE failed");

  return res.json();
};