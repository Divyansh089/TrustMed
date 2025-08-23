
//npx hardhat run scripts/deploy.js --network localhost
//npx hardhat run scripts/deploy.js --network holesky
const hre = require("hardhat");

async function main() {
  const Healthcare = await hre.ethers.getContractFactory("Healthcare");
  const healthcare = await Healthcare.deploy();

  await healthcare.deployed();

  console.log(` Contract Address: ${healthcare.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
