const ContractWrapper = require("../scripts/contract/ContractWrapper");

const func = async function(hre) {
    let contractName = "HdexRecommendedToken";
    const contractWrapper = new ContractWrapper(hre.network.name, contractName, contractName);
    const config = contractWrapper.settingsDao.settingsCached.hdexRouter;
    const instance = await contractWrapper.deployContract();
    console.log(`${contractName} deployed | address: ${instance.address}`);
}

func.tags = ["recommendedToken"];
module.exports = func;
