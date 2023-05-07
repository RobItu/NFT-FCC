const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts()
    const basicNft = await ethers.getContract("BasicNft", deployer)
    const basicMintTx = await basicNft.mintNft()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`)

    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const randomMintFee = await randomIpfsNft.getMintFee()
    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 30000)
        randomIpfsNft.once("NftMinted", async function () {
            resolve()
        })
        const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
            value: randomMintFee.toString(),
        })
        const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)
        if (developmentChains.includes(network.name)) {
            const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            //await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
        }
    })
    console.log(`Random IPFS Nft index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)

    const highValue = ethers.utils.parseEther("4000")
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicSvgNftTx = await dynamicSvgNft.mintNft(highValue.toString())
    await dynamicSvgNftTx.wait(1)
    console.log(`Dynamic SVG Nft index 0 Token URI: ${await dynamicSvgNft.tokenURI(0)}`)
}
