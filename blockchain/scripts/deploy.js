const hre = require("hardhat");

async function main() {
  console.log("Deploying AgriChain...");

  const AgriChain = await hre.ethers.getContractFactory("AgriChain");
  const contract = await AgriChain.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("Contract deployed successfully.");
  console.log("Address:", address);
  console.log("\nSave this in backend/.env and blockchain/.env:");
  console.log(`CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
