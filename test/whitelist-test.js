const { expect } = require("chai");
const { BigNumber } = require("bn.js");

describe("Whitelist", function() {
    let whitelist;
    let admin;
    let alice;
    let bob;
    let clark

    beforeEach(async () => {
        signers = await ethers.getSigners();
        admin = signers[0];
        alice = signers[1];
        bob = signers[2];
        clark = signers[3];
        const whitelistFactory = await ethers.getContractFactory("HdexWhitelist");
        whitelist = await whitelistFactory.deploy();
        await whitelist.deployed();
    })

    it("whitelist add user, delete first", async function() {
        await whitelist.addWhitelist(alice.address);
        await whitelist.addWhitelist(bob.address);
        await whitelist.addWhitelist(clark.address);
        let whitelistLen = await whitelist.whitelistLength();

        expect(whitelistLen.toString()).to.equal("3");
        expect(await whitelist.whitelist("0")).to.equal(alice.address);
        expect(await whitelist.whitelist("1")).to.equal(bob.address);
        expect(await whitelist.whitelist("2")).to.equal(clark.address);
        expect(await whitelist.whitelistIndex(alice.address)).to.equal("1");
        expect(await whitelist.whitelistIndex(bob.address)).to.equal("2");
        expect(await whitelist.whitelistIndex(clark.address)).to.equal("3");

        await whitelist.removeWhitelist(alice.address);
        whitelistLen = await whitelist.whitelistLength();

        expect(whitelistLen.toString()).to.equal("2");
        expect(await whitelist.whitelist("1")).to.equal(bob.address);
        expect(await whitelist.whitelist("0")).to.equal(clark.address);
        await expect(
            whitelist.whitelist("2")
        ).to.be.reverted;
        expect(await whitelist.whitelistIndex(bob.address)).to.equal("2");
        expect(await whitelist.whitelistIndex(clark.address)).to.equal("1");
        expect(await whitelist.whitelistIndex(alice.address)).to.equal("0");
    })

    it("whitelist add user, delete last", async function() {
        await whitelist.addWhitelist(alice.address);
        await whitelist.addWhitelist(bob.address);
        await whitelist.addWhitelist(clark.address);
        let whitelistLen = await whitelist.whitelistLength();

        expect(whitelistLen.toString()).to.equal("3");
        expect(await whitelist.whitelist("0")).to.equal(alice.address);
        expect(await whitelist.whitelist("1")).to.equal(bob.address);
        expect(await whitelist.whitelist("2")).to.equal(clark.address);
        expect(await whitelist.whitelistIndex(alice.address)).to.equal("1");
        expect(await whitelist.whitelistIndex(bob.address)).to.equal("2");
        expect(await whitelist.whitelistIndex(clark.address)).to.equal("3");

        await whitelist.removeWhitelist(clark.address);
        whitelistLen = await whitelist.whitelistLength();

        expect(whitelistLen.toString()).to.equal("2");
        expect(await whitelist.whitelist("0")).to.equal(alice.address);
        expect(await whitelist.whitelist("1")).to.equal(bob.address);
        await expect(
            whitelist.whitelist("2")
        ).to.be.reverted;
        expect(await whitelist.whitelistIndex(alice.address)).to.equal("1");
        expect(await whitelist.whitelistIndex(bob.address)).to.equal("2");
        expect(await whitelist.whitelistIndex(clark.address)).to.equal("0");
    })

    it("whitelist add user, delete mid", async function() {
        await whitelist.addWhitelist(alice.address);
        await whitelist.addWhitelist(bob.address);
        await whitelist.addWhitelist(clark.address);
        let whitelistLen = await whitelist.whitelistLength();

        expect(whitelistLen.toString()).to.equal("3");
        expect(await whitelist.whitelist("0")).to.equal(alice.address);
        expect(await whitelist.whitelist("1")).to.equal(bob.address);
        expect(await whitelist.whitelist("2")).to.equal(clark.address);
        expect(await whitelist.whitelistIndex(alice.address)).to.equal("1");
        expect(await whitelist.whitelistIndex(bob.address)).to.equal("2");
        expect(await whitelist.whitelistIndex(clark.address)).to.equal("3");

        await whitelist.removeWhitelist(bob.address);
        whitelistLen = await whitelist.whitelistLength();

        expect(whitelistLen.toString()).to.equal("2");
        expect(await whitelist.whitelist("0")).to.equal(alice.address);
        expect(await whitelist.whitelist("1")).to.equal(clark.address);
        await expect(
            whitelist.whitelist("2")
        ).to.be.reverted;
        expect(await whitelist.whitelistIndex(alice.address)).to.equal("1");
        expect(await whitelist.whitelistIndex(bob.address)).to.equal("0");
        expect(await whitelist.whitelistIndex(clark.address)).to.equal("2");
    })
})