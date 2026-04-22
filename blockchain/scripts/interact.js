import hre from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  const AgriChain = await hre.ethers.getContractFactory("AgriChain");
  const contract = AgriChain.attach(contractAddress);

  console.log("🔗 Connected to:", contractAddress);

  // 🌾 Add Crop
  const tx = await contract.addCrop("Tomato", 100, 30);
  await tx.wait();

  console.log("✅ Crop added! Tx:", tx.hash);

  // 📄 Read Crop
  const crop = await contract.getCrop(1);

  console.log("🌾 Crop Data:", crop);
}

main().catch(console.error);