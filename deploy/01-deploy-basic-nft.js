const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config.js")
const { verify } = require("../utils/verify.js")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("------------------------")
    const initialTokenCounter = networkConfig[network.config.chainId]["initialTokenCounter"]
    const args = [initialTokenCounter]
    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        verify(basicNft.address, args)
    }
    log("------------------------")
}

module.exports.tags = ["all", "basic"]
