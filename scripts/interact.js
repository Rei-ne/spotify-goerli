const main = async () => {
    const API_KEY = process.env.API_KEY;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    // For Hardhat
    const contract = require("../artifacts/contracts/SongPortal.sol/SongPortal.json");
    console.log(JSON.stringify(contract.abi));

    // Provider
    const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);

    // Signer
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

    // Contract
    const songPortalContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

    // wave
    let songTxn = await songPortalContract.wave("A message!");
    await songTxn.wait(); //Wait for the transaction to be mined

    // let songTxn2 = await songPortalContract.wave("This is message 2!");
    // await songTxn2.wait(); //Wait for the transaction to be mined


    let allSongs = await songPortalContract.getAllSongs();
    console.log(allSongs);

};

const runMain = async () => {
    try {
        await main();
        process.exit(0); // exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }

};

runMain();