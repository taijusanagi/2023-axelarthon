import { ommniDeploy } from "hardhat";

async function main() {
  const val = "val";
  ommniDeploy("Sample", [val]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
