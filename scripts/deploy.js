async function main() {
    const MySongPortal = await ethers.getContractFactory("SongPortal");

    //Start deployment, returning a promise that resolves to a contract object
    const song_portal = await MySongPortal.deploy()

    console.log("Contract deployed to address:", song_portal.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });