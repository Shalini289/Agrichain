const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS missing in .env");
  }

  const AgriChain = await hre.ethers.getContractFactory("AgriChain");
  const contract = AgriChain.attach(contractAddress);

  console.log("Connected to:", contractAddress);

  const tx = await contract.addCrop("Tomato", 100, 30);
  await tx.wait();

  console.log("Crop added. Tx:", tx.hash);

  const crop = await contract.getCrop(1);
  console.log("Crop Data:", crop);
}

main().catch((error) => {
  console.error("Interaction failed:", error);
  process.exitCode = 1;
});
