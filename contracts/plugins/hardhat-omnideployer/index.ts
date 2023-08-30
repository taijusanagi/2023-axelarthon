import { extendEnvironment } from "hardhat/config";
import { axelarTestnetConfigs } from "../../configs";
import { DeterministicDeployer } from "@account-abstraction/sdk";
import {
  Create2Deployer,
  Create2Deployer__factory,
  OmniFactory__factory,
} from "../../typechain-types";

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    ommniDeploy: (
      gui: boolean,
      contractName: string,
      constractorArguments: any[],
      destinationChain?: string,
      salt?: string
    ) => Promise<void>;
  }
}

extendEnvironment((hre) => {
  hre.ommniDeploy = async function (
    gui: boolean,
    contractName: string,
    constractorArguments: any[],
    destinationChain?: string,
    salt: string = hre.ethers.constants.HashZero
  ) {
    const sourceChainId = hre.network.config.chainId;
    if (
      !sourceChainId ||
      (sourceChainId !== 5 &&
        sourceChainId !== 97 &&
        sourceChainId !== 80001 &&
        sourceChainId !== 420 &&
        sourceChainId !== 421613)
    ) {
      throw new Error("Unsupported network");
    }
    console.log("=== OmmniDeploy with Axelar Network ===");
    console.log(">> gui mode", gui);
    console.log(">> contractName", contractName);
    console.log(">> constractorArguments", constractorArguments);
    const sourceChain = axelarTestnetConfigs[sourceChainId].name;
    console.log(">> sourceChain", sourceChain);
    const isCrossChainDeployEnabled =
      destinationChain && sourceChain !== destinationChain;
    if (isCrossChainDeployEnabled) {
      console.log(
        ">> cross-chain deploy with Axelar is enabled",
        destinationChain
      );
      console.log(">> destinationChain", destinationChain);
    }
    console.log(">> salt", salt);
    const [signer] = await hre.ethers.getSigners();
    console.log(">> signer", signer.address);
    const deterministicDeployer = new DeterministicDeployer(
      hre.ethers.provider,
      signer
    );
    const axelar = axelarTestnetConfigs[sourceChainId];
    const create2DeployerAddress =
      await deterministicDeployer.deterministicDeploy(
        Create2Deployer__factory.bytecode
      );
    const create2Deployer: Create2Deployer = await new Promise((resolve) => {
      const checkCreate2DeployerIntervalId = setInterval(async () => {
        try {
          const create2Deployer = Create2Deployer__factory.connect(
            create2DeployerAddress,
            signer
          );
          const deployed = await create2Deployer.deployed();
          clearInterval(checkCreate2DeployerIntervalId);
          return resolve(deployed);
        } catch (e) {
          console.log(">> waiting for Create2Deployer to be deployed...");
        }
      }, 1000);
    });
    console.log(">> create2DeployerAddress", create2DeployerAddress);
    const omniFactoryInterface = OmniFactory__factory.createInterface();
    const init = omniFactoryInterface.encodeFunctionData("initialize", [
      axelar.gatewayAddress,
      axelar.gasServiceAddress,
      create2DeployerAddress,
    ]);
    const omniFactoryAddress = await create2Deployer.deployedAddress(
      OmniFactory__factory.bytecode,
      signer.address,
      process.env.DEPLOYMENT_SALT || hre.ethers.constants.HashZero
    );
    console.log(">> omniFactoryAddress", omniFactoryAddress);
    if ((await hre.ethers.provider.getCode(omniFactoryAddress)) === "0x") {
      console.log(">> OmniFactory is not deployed yet, deploying...");
      const deployTx = await create2Deployer.deployAndInit(
        OmniFactory__factory.bytecode,
        salt,
        init
      );
      await deployTx.wait();
      console.log(">> OmniFactory deployed");
    }
    const omniFactory = OmniFactory__factory.connect(
      omniFactoryAddress,
      signer
    );
    const Contract = await hre.ethers.getContractFactory(contractName);
    const creationCode = hre.ethers.utils.solidityPack(
      ["bytes", "bytes"],
      [Contract.bytecode, Contract.interface.encodeDeploy(constractorArguments)]
    );
    const expectedDeployedAddress = await omniFactory.deployedAddress(
      creationCode,
      signer.address,
      salt
    );
    console.log(">> expectedDeployedAddress", expectedDeployedAddress);
    if (gui) {
      console.log(">> gui mode enabled");
      console.log(">> service uri", "https://omni-deployer.vercel.app/");
      console.log(">> creationCode", creationCode);
      console.log(">> salt", salt);
    } else {
      console.log(">> deploying...");
      if (!isCrossChainDeployEnabled) {
        const tx = await omniFactory.deploy(creationCode, salt, "0x");
        await tx.wait();
        const deployedCode = await hre.ethers.provider.getCode(
          expectedDeployedAddress
        );
        console.log(">> deployed", deployedCode !== "0x");
      } else {
        const value = hre.ethers.utils.parseEther("0.01"); // should use gas service in Prod
        const tx = await omniFactory.omniDeploy(
          destinationChain,
          creationCode,
          salt,
          "0x",
          value,
          { value }
        );
        await tx.wait();
        console.log(">> tx sent to Axelar Network", tx.hash);
      }
    }
  };
});
