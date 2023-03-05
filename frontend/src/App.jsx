import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";

// import abi
// import abi from '../../artifacts/contracts/SongPortal.sol/SongPortal.json'

import abi from './SongPortal-abi.json'

const App = () => {

  /*
 * Just a state variable we use to store our user's public wallet.
 */
  const [currentAccount, setCurrentAccount] = useState("");
  const [songCount, setSongCount] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [message, setMessage] = useState("");

  const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  const contractAddress = "0xb65CFEE0bc2F4a1D9E263da81180C37Dd19bc7C5";

  const contractABI = abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);



      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }

  }
  /**
 * connect wallet method implemented
 */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask! Please add the metamask extension to your browser");

        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error)
    }
  }

  const song = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        /*
          * using contractABI here
          */
        const songPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // console.log(songPortalContract)

        let count = await songPortalContract.getAllSongs();

        console.log("Retrieved total song count...", count.length);
        // /*
        //    * Execute the actual wave from your smart contract
        //    */

        const songTxn = songPortalContract.wave(message, { gasLimit: 300000 });
        console.log("Mining...", songTxn.hash);


        console.log("Mined -- ", songTxn.hash);

        count = songPortalContract.getAllSongs();

        if (count) {
          setSongCount(count.length)
          console.log(songCount)
        }
        console.log("Retrieved total song count...", count.length);
      } else {
        alert("something went wrong, please try again later");
        console.log("could not add song or retrieve song count");
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  }



  /*
   * Create a method that gets all waves from your contract
   */
  const getAllSongs = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const songPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        /*
        * Call the getAllSongs method from your Smart Contract
        */
        const songs = await songPortalContract.getAllSongs();



        const songCollection = songs.map(song => {
          return {
            address: song.waver,
            timestamp: new Date(song.timestamp * 1000),
            message: song.message,
          };
        });
        /*
          * Store our data in React State
          */
        setAllSongs(songCollection);
        // console.log(songCollection);
      } else {
        console.log("Error getting the song collection from the smart contract");
      }
    } catch (error) {
      console.log("could not connect, ethereum object not found");

    }
  }

  /**
   * Listen in for emitter events!
   */
  useEffect(() => {

    let songPortalContract;

    const onNewSong = (from, timestamp, message) => {
      console.log("NewSong", from, timestamp, message);
      setAllSongs(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      songPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      songPortalContract.on("NewSong", onNewSong);
    }

    return () => {
      if (songPortalContract) {
        songPortalContract.off("NewSong", onNewSong);
      }
    };

  },)





  const handleMessage = (e) => {
    setMessage(e.target.value);

  }

  const handleClick = e => {

    e.preventDefault();

    if (message.trim().length !== 0) {

      song();


    } else {

      alert('please enter a message');
    }
  };


  useEffect(() => {
    checkIfWalletIsConnected(); getAllSongs();
  }, [])

  const msgVariable = message

  // console.log(msgVariable)

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hello there!
        </div>

        <div className="bio">

          <p>
            I am <span>Reine</span>, I love music and web3 <br />
          </p>
          <p>
            I created a decentralized app where you can send me a spotify song on the ethereum blockchain!
          </p>
          <p>
            It is a testnet application so don't worry you won't be charged real money, you can get fake money to test it <a href="https://goerlifaucet.com/">here</a>
          </p>
          <p>
            All you have to do is connect your goerli testnet wallet on metamask, type in the song link and send.

          </p>



        </div>


        <input placeholder='your message / song' value={message} onChange={handleMessage} />


        <div className="buttonDiv">
          <button className="waveButton sendWaveButton" onClick={handleClick}>
            Send a song
          </button>
        </div>


        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <div className="buttonDiv">
            <button className="waveButton connectWalButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        )}
        <div className="messageCon">
          {allSongs.slice(0).reverse().map((song, id) => {
            return (

              <div key={id} className="messageContainer">
                <div>sender: {song.address}</div>
                <div className="messageDiv">
                  <h1> song: {song.message}</h1>

                </div>

              </div>

            )
          })}
        </div>


      </div>

    </div>
  );
}

export default App