const { ethers } = require("hardhat")

//Define network - addresses configurations
const networkConfig = {
    5: {
        name: "goerli",
    },
    31337: {
        name: "hardhat",
        TOKEN_URI:
            "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json",
        initialTokenCounter: "0",
    },
}

const developmentChains = ["hardhat", "localhost", 31337]

module.exports = {
    networkConfig,
    developmentChains,
}
