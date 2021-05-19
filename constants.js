const dotenv = require("dotenv")
const { resolve, join } = require("path")

dotenv.config({ path: resolve(__dirname, ".env") })

const ROOT_DIR = __dirname

module.exports = {
    HECO_URL: `${process.env["HECO_URL"]}`,
    HECO_TEST_URL: `${process.env["HECO_TEST_URL"]}`,
    HECO_PRIVATE_KEY: `${process.env["HECO_PRIVATE_KEY"]}`,
    HECO_TEST_PRIVATE_KEY: `${process.env["HECO_TEST_PRIVATE_KEY"]}`,
    API_KEY: `${process.env["APY_KEY"]}`,
    ROOT_DIR
}
