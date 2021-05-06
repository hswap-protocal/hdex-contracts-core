const ContractWrapper = require("../scripts/contract/ContractWrapper");

const func = async function(hre) {
    let contractName = "Multicall";
    const contractWrapper = new ContractWrapper(hre.network.name, contractName, contractName);
    const instance = await contractWrapper.deployContract();
    console.log(`${contractName} deployed | address: ${instance.address}`);
};

func.tags = ["multicall"];
module.exports = func;

