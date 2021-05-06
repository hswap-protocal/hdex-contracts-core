const heco = require("./heco.json");
const heco_test = require("./heco_test.json");
const hardhat = require("./hardhat.json");

class SettingsDao {

    constructor(network) {
        switch (network) {
            case "heco":
                this.settingsCached = heco;
                break
            case "heco_test":
                this.settingsCached = heco_test;
                break
            case "hardhat":
                this.settingsCached = hardhat;
                break;
            default:
                throw new Error(`Network not found=${network}`)
        }
    }
}

module.exports = SettingsDao;