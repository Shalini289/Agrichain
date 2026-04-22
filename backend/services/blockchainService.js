import { contract } from "../config/blockchain.js";

// ➕ Add crop to blockchain
export const addCropOnChain = async (name, quantity, price) => {
  const tx = await contract.addCrop(name, quantity, price);
  await tx.wait();

  return tx.hash;
};

// 🔁 Transfer ownership
export const transferOwnershipOnChain = async (cropId, to) => {
  const tx = await contract.transferOwnership(cropId, to);
  await tx.wait();

  return tx.hash;
};