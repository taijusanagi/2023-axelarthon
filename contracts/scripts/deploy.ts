import { ethers, network } from "hardhat";
import { axelarConfigs } from "../configs";
import {
  OmniFactory__factory,
  Create2Deployer__factory,
} from "../typechain-types";

import { DeterministicDeployer } from "@account-abstraction/sdk";

async function main() {
  let networkName;
  if (network.name === "hardhat") {
    networkName = "goerli";
  } else {
    networkName = network.name;
  }
  if (
    networkName !== "goerli" &&
    networkName !== "bscTestnet" &&
    networkName !== "mumbai"
  ) {
    throw new Error("Unsupported network");
  }
  const [signer] = await ethers.getSigners();
  const deterministicDeployer = new DeterministicDeployer(
    ethers.provider,
    signer
  );
  const axelar = axelarConfigs[networkName];
  const create2DeployerAddress =
    await deterministicDeployer.deterministicDeploy(
      Create2Deployer__factory.bytecode
    );
  const create2Deployer = Create2Deployer__factory.connect(
    create2DeployerAddress,
    signer
  );
  await create2Deployer.deployed();
  console.log("create2DeployerAddress", create2DeployerAddress);
  const omniFactoryInterface = OmniFactory__factory.createInterface();
  const init = omniFactoryInterface.encodeFunctionData("initialize", [
    axelar.gatewayAddress,
    axelar.gasServiceAddress,
    create2DeployerAddress,
  ]);
  const salt = process.env.DEPLOYMENT_SALT || ethers.constants.HashZero;
  const omniFactoryAddress = await create2Deployer.deployedAddress(
    OmniFactory__factory.bytecode,
    signer.address,
    salt
  );
  const deployTx = await create2Deployer.deployAndInit(
    OmniFactory__factory.bytecode,
    salt,
    init
  );
  await deployTx.wait();
  console.log("omniFactoryAddress", omniFactoryAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
