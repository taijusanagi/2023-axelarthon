import { extendEnvironment } from "hardhat/config";
import { OMNI_FACTORY_ADDRESS } from "../../configs";

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    ommniDeploy: (contractName: string, args: any[]) => Promise<void>;
  }
}

extendEnvironment((hre) => {
  hre.ommniDeploy = async function (contractName: string, args: any[]) {
    console.log("ommniDeploy");
    console.log("contractName", contractName);
    console.log("args", args);

    const code = await hre.ethers.provider.getCode(OMNI_FACTORY_ADDRESS);
    if (code === "0x") {
    }

    console.log("xDeploy called");
    const Contract = await hre.ethers.getContractFactory(contractName);
    const argument = hre.ethers.utils.defaultAbiCoder.encode(["address"], args);
    const factoryDeploymentCode = hre.ethers.utils.solidityPack(
      ["bytes", "bytes"],
      [Contract.bytecode, argument]
    );
  };
});
