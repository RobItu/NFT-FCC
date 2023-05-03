const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config.js")
const { verify } = require("../utils/verify.js")
const { storeImages } = require("../scripts/uploadToPinata.js")

const imagesLocation = "./images/randomNft"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let tokenUris
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }
    log(
        "-----------------------------------------------------------------------------------------------------------"
    )
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const dogTokenUris = networkConfig[chainId]["dogTokenUris"]
    const mintFee = networkConfig[chainId]["mintFee"]

    await storeImages(imagesLocation)

    // const args = [
    //     vrfCoordinatorV2Address,
    //     subscriptionId,
    //     gasLane,
    //     callbackGasLimit,
    //     dogTokenUris,
    //     mintFee,
    // ]

    async function handleTokenUris() {
        tokenUris = []
        return tokenUris
    }
}

module.exports.tags = ["all", "main", "randomipfs"]
