export const constants = {
  // https://github.com/lifinance/create3-factory/tree/main
  CREATE3FACTORY_ADDRESS: "0x93FEC2C00BfE902F733B57c5a6CeeD7CD1384AE1",
};

export const axelarConfigs = {
  goerli: {
    name: "ethereum-2",
    gatewayAddress: "0xe432150cce91c13a887f7D836923d5597adD8E31",
    gasServiceAddress: "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
  },
  bscTestnet: {
    name: "binance",
    gatewayAddress: "0x4D147dCb984e6affEEC47e44293DA442580A3Ec0",
    gasServiceAddress: "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
  },
  mumbai: {
    name: "Polygon",
    gatewayAddress: "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
    gasServiceAddress: "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
  },
};
