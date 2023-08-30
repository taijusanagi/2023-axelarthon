import { ommniDeploy } from "hardhat";

async function main() {
  ommniDeploy(true, "Sample", ["This is test deployment."]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
