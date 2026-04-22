import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying AgriChain...");

  const AgriChain = await hre.ethers.getContractFactory("AgriChain");

  const contract = await AgriChain.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("✅ Contract deployed successfully!");
  console.log("📍 Address:", address);

  console.log("\n👉 Save this in your backend .env:");
  console.log(`CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});