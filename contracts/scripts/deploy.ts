import { ethers, network } from "hardhat";
import { axelarConfigs, constants } from "../configs";
import { OmniFactory__factory } from "../typechain-types";

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
  const axelar = axelarConfigs[networkName];
  const create3Factory = await ethers.getContractAt(
    "ICREATE3Factory",
    constants.CREATE3FACTORY_ADDRESS
  );
  const salt = process.env.DEPLOYMENT_SALT || ethers.constants.HashZero;
  const deploymentArgument = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "address"],
    [
      axelar.gatewayAddress,
      axelar.gasServiceAddress,
      constants.CREATE3FACTORY_ADDRESS,
    ]
  );
  const creationCode = ethers.utils.solidityPack(
    ["bytes", "bytes"],
    [OmniFactory__factory.bytecode, deploymentArgument]
  );
  const deployed = await create3Factory.getDeployed(signer.address, salt);
  const deployTx = await create3Factory.deploy(salt, creationCode);
  await deployTx.wait();
  console.log("Deployed", deployed);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
