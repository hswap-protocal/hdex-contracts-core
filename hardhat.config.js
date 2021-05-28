require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("hardhat-spdx-license-identifier");
require("@nomiclabs/hardhat-etherscan");

const env = require("./constants");

module.exports = {
    solidity: {
        compilers:[
            {
                version:"0.6.6",
                settings: {
                    evmVersion:"istanbul",
                    optimizer: {
                        enabled: true,
                        runs: 1000
                    }
                }
            },
            {
                version:"0.5.16",
                settings:{
                    evmVersion:"istanbul",
                    optimizer: {
                        enabled: true,
                        runs: 1000
                    }
                }
            },
            {
                version:"0.4.18",
                settings:{
                    evmVersion:"istanbul"
                }
            },
        ]
    },
    spdxLicenseIdentifier: {
        overwrite: true,
        runOnCompile: true,
    },
    networks: {
        heco: {
            url: env.HECO_URL,
            accounts: [env.HECO_PRIVATE_KEY],
            saveDeployments: false
        },
        heco_test: {
            url: env.HECO_TEST_URL,
            accounts: [env.HECO_TEST_PRIVATE_KEY],
            saveDeployments: false
        }
    },
    etherscan: {
        apiKey: env.API_KEY
    }
};

