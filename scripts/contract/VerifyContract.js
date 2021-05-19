const {deployments, ethers, upgrades} = require("hardhat");
const hre = require("hardhat");
const ContractWrapper = require("./ContractWrapper");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    let contractName;
    let contractWrapper;
    contractName = "Multicall";
    contractWrapper = new ContractWrapper(hre.network.name, contractName, "Multicall");
    await contractWrapper.verify();
    await sleep(3000);

    contractName = "HdexFactory";
    contractWrapper = new ContractWrapper(hre.network.name, contractName, "HdexFactory");
    await contractWrapper.verify();
    await sleep(3000);

    contractName = "HdexRouter";
    contractWrapper = new ContractWrapper(hre.network.name, contractName, "HdexRouter");
    await contractWrapper.verify();
    await sleep(3000);

    contractName = "HdexRecommendedToken";
    contractWrapper = new ContractWrapper(hre.network.name, contractName, "HdexRecommendedToken");
    await contractWrapper.verify();
    await sleep(3000);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
    process.exit(1);
});