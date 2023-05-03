require("dotenv").config()

async function storeImages(imagesFilePath) {
    const pinataSDK = require("@pinata/sdk")
    const path = require("path")
    const fs = require("fs")
    const pinata_api_key = process.env.PINATA_API_KEY
    const pinata_secret_api_key = process.env.PINATA_SECRET_KEY
    const pinata = pinataSDK(pinata_api_key, pinata_secret_api_key)
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    console.log("Uploading to IPFS!")

    for (fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        try {
            console.log(`Currently working on: ${files[fileIndex]}`)
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

module.exports = { storeImages }
