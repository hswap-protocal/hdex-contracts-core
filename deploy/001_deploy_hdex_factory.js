const ContractWrapper = require("../scripts/contract/ContractWrapper");
const injectInitCodeHash = require("../scripts/contract/RenderHdexLibrary");

const func = async function(hre) {
    let contractName = "HdexFactory";
    const contractWrapper = new ContractWrapper(hre.network.name, contractName, contractName);
    const instance = await contractWrapper.deployContract();
    const contract = await contractWrapper.getInstance();
    // open whitelist
    await contract.changeCheck(true);
    let init_code_hash = await contract.getInitCode();
    init_code_hash = init_code_hash.replace("0x", "");
    let metadata = contractWrapper.metadata;
    metadata["init_code_hash"] = init_code_hash;
    contractWrapper.setMetadata(metadata);
    await injectInitCodeHash(init_code_hash);
    console.log(`${contractName} deployed | address: ${instance.address}`);
}

func.tags = ["factory"];
module.exports = func;
