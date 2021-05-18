const { expect } = require("chai");
const { BigNumber } = require("bn.js");

describe("Factory", function() {
    let admin;
    let alice;
    let bob;
    let clark;
    let factory;

    beforeEach(async () => {
        signers = await ethers.getSigners();
        admin = signers[0];
        alice = signers[1];
        bob = signers[2];
        clark = signers[3];
        const Factory = await ethers.getContractFactory("HdexFactory");
        factory = await Factory.deploy();
        await factory.deployed();
    })

    it("set feeTo", async function() {
        let feeTo = await factory.feeTo();
        expect(feeTo).to.equal("0x0000000000000000000000000000000000000000");
        await factory.setFeeTo(admin.address);
        feeTo = await factory.feeTo();
        expect(feeTo).to.equal(admin.address);
    })

    it("set feeToRate", async function() {
        let feeToRate = await factory.feeToRate();
        expect(feeToRate.toString()).to.equal("1");
        // 设置feeToRate为100%
        await factory.setFeeToRate(1);
        feeToRate = await factory.feeToRate();
        expect(feeToRate.toString()).to.equal("0");
        // 设置feeToRate为1%
        await factory.setFeeToRate(100);
        feeToRate = await factory.feeToRate();
        expect(feeToRate.toString()).to.equal("99");
    })

    it("set setFlashSwap", async function() {
        let isFlashSwapOn = await factory.isFlashSwapOn();
        expect(isFlashSwapOn).to.equal(false);

        await factory.setFlashSwap(true);
        isFlashSwapOn = await factory.isFlashSwapOn();
        expect(isFlashSwapOn).to.equal(true);
    })

})