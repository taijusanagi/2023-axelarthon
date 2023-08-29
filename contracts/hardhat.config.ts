import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./plugins/hardhat-omnideployer";

import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 5,
      forking: {
        url: "https://rpc.ankr.com/eth_goerli",
      },
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
