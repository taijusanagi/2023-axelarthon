import { extendEnvironment } from "hardhat/config";

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    ommniDeploy: () => Promise<void>;
  }
}

extendEnvironment((hre) => {
  hre.ommniDeploy = async function () {
    console.log("xDeploy called");
  };
});
