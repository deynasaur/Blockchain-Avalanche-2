import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [storeItems, setStoreItems] = useState([]);
  const [myRackets, setMyRackets] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const rawBalance = await atm.getBalance();
      setBalance(ethers.utils.formatEther(rawBalance));
    }
  };
  
  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      try{
        let tx = await atm.withdraw(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
      } catch (err){
        console.error("Transaction error: ", err);
        alert("Error: "+ err.message);
      }
      
    }
  };

  const showStore = async () => {
    if (atm) {
      const store = await atm.showStore();
      setStoreItems(store);
    }
  };

  const buyRacket = async (racketID) => {
    if (atm) {
      try {
        const tx = await atm.buyRacket(racketID, {value: ethers.utils.parseEther("1")});
        await tx.wait();
        getBalance();
        showStore();
        showMyRackets();
      } catch (err) {
        console.error("Error buying racket:", err);
        alert("Error: " + err.message);
      }
    }
  };

  const showMyRackets = async () => {
    if (atm) {
      const racks = await atm.showMyRackets();
      setMyRackets(racks);
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask to have access for this store.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet.</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    if (storeItems.length === 0) {
      showStore();
    }

    return (
      <div>
        <p>Account Address: {account}</p>
        <p>Balance: {balance} ETH</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>

          <h2>Products</h2>
        <div>
          {storeItems.map((item, index) => (
            <div key={index}>
              <p>{item.model} - {ethers.utils.formatEther(item.cost)} ETH</p>
              <button onClick={() => buyRacket(item.model)}>Buy</button>
            </div>
          ))}
        </div>

        <br></br>

        <div style={{ display: 'flex', justifyContent: 'center'}}>
            <h2>My Rackets</h2>
            <ol>
            {myRackets.map((racket, index) => (
              <li key={index}>{racket}</li>
            ))}
          </ol>
        </div>

      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>Ethereum Badminton Racket Store</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
