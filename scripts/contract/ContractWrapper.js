const {deployments, ethers, upgrades} = require("hardhat");
const hre = require("hardhat");
const SettingsDao = require("../settings/SettingsDao");
const {mkdir, ShellString} = require("shelljs");
const { resolve } = require("path");

class ContractWrapper {

    constructor(network, contractName, contractInstanceName) {
        this.contractName = contractName;
        this.contractInstanceName = contractInstanceName;
        this.settingsDao = new SettingsDao(network);
        this.network = network;
        this.confirmations = 1;
        try {
            this.resultMetadata = require(`${this.metadataDir}/${network}`);
        } catch (e) {
            this.resultMetadata = {
                [this.contractInstanceName]: {}
            }
        }
    }

    async deployContract(...args) {
        console.log(`deployContract: ${this.contractName}:[${args}]`);
        const {deploy} = deployments;
        const instance = await deploy(this.contractName, {
            from: await this.getSigner(),
            args: args,
            // 跳过相同合约检查，用于重复部署合约
            fieldsToCompare: false
        });
        await ethers.provider.waitForTransaction(instance.transactionHash, this.confirmations);
        const metadata = {
            "contractName": this.contractName,
            "args": args,
            "address": instance.address,
            "type": "normal"
        }
        this.setMetadata(metadata);
        return instance;
    }

    async deployUpgradeContract(...args) {
        console.log(`deployUpgradeContract: ${this.contractName}:[${args}]`);
        const factory = await ethers.getContractFactory(this.contractName);
        const instance = await upgrades.deployProxy(factory, args);
        await instance.deployed();
        const metadata = {
            "contractName": this.contractName,
            "args": args,
            "address": instance.address,
            "type": "proxy"
        }
        this.setMetadata(metadata);
        return instance;
    }

    async upgradeContract() {
        console.log(`upgradeContract: ${this.contractName}`);
        const factory = await ethers.getContractFactory(this.contractName);
        const instance = await upgrades.upgradeProxy(this.address, factory);
        return instance;
    }

    async getSigner() {
        const signers = await ethers.getSigners();
        const address = signers[0].getAddress();
        return address;
    }

    async getInstance() {
        const instance = await ethers.getContractAt(this.contractName, this.address);
        return instance;
    }

    get metadata() {
        return this.resultMetadata[this.contractInstanceName];
    }

    get address() {
        return this.resultMetadata[this.contractInstanceName].address;
    }

    get metadataDir() {
        return resolve("metadata");
    }

    setMetadata(metadata) {
        this.resultMetadata[this.contractInstanceName] = metadata;
        mkdir("-p", this.metadataDir);
        ShellString(JSON.stringify(this.resultMetadata, null, 2)).to(`${this.metadataDir}/${this.network}.json`);
    }

    async verify() {
        const address = this.resultMetadata[this.contractInstanceName].address;
        const args = this.resultMetadata[this.contractInstanceName].args;
        console.log(address, args);
        if(address) {
            await hre.run("verify:verify", {
                address: address,
                constructorArguments: args
            })
        } else {
            console.log("contract not exist!");
        }
    }
}

module.exports = ContractWrapper;