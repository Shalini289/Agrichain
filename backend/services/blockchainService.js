import { getContract } from "../config/blockchain.js";

// ➕ Add crop to blockchain
export const addCropOnChain = async (name, quantity, price) => {
  const contract = getContract();
  const tx = await contract.addCrop(name, Number(quantity), Number(price));
  await tx.wait();

  return tx.hash;
};

// 🔁 Transfer ownership
export const transferOwnershipOnChain = async (cropId, to) => {
  const contract = getContract();
  const tx = await contract.transferOwnership(Number(cropId), to);
  await tx.wait();

  return tx.hash;
};
