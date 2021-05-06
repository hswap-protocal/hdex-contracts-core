const ContractWrapper = require("../scripts/contract/ContractWrapper");

const func = async function(hre) {
    let contractName = "HdexRouter";
    const contractWrapper = new ContractWrapper(hre.network.name, contractName, contractName);
    const factoryWrapper = new ContractWrapper(hre.network.name, "HdexFactory", "HdexFactory");
    const config = contractWrapper.settingsDao.settingsCached.hdexRouter;
    const instance = await contractWrapper.deployContract(factoryWrapper.address, config.wht);
    console.log(`${contractName} deployed | address: ${instance.address}`);
}

func.tags = ["router"];
module.exports = func;
