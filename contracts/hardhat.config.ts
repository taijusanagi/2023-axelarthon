import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./plugins/hardhat-omnideployer";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
};

export default config;
