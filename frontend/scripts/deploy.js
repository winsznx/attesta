const hre = require("hardhat");

async function main() {
  console.log("Deploying AttestaCertificate contract to Base Sepolia...");

  // Get the contract factory
  const AttestaCertificate = await hre.ethers.getContractFactory(
    "AttestaCertificate"
  );

  // Deploy the contract
  console.log("Deploying contract...");
  const certificate = await AttestaCertificate.deploy();

  await certificate.waitForDeployment();

  const address = await certificate.getAddress();

  console.log("✅ AttestaCertificate deployed to:", address);
  console.log("");
  console.log("Next steps:");
  console.log("1. Add this address to your .env.local:");
  console.log(`   NEXT_PUBLIC_NFT_CONTRACT_BASE_SEPOLIA=${address}`);
  console.log("");
  console.log("2. Verify the contract on BaseScan:");
  console.log(`   npx hardhat verify --network base-sepolia ${address}`);
  console.log("");
  console.log("3. View on BaseScan:");
  console.log(`   https://sepolia.basescan.org/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });