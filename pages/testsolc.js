import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { useSigner } from 'wagmi';
const path = require('path');
// const solc = require('solc');
// import solc from 'solc';
// const fs = require('fs-extra');

const TestSolc = () => {
  const { data: signer, isError, isLoading } = useSigner()
  

  useEffect(()=>{
   

  },[])

  const compile=()=>{
    axios.get('/api/hello')
    .then(res=>{
      console.log(res)
      deploy(res.data.abi, res.data.bytec)
    }).catch(e=>{
      console.log(e)
    })
  }

  const deploy=async(abid, bytecode)=>{
  //   const price = ethers.utils.formatUnits(await provider.getGasPrice(), 'gwei')
  // const options = {gasLimit: 100000, gasPrice: ethers.utils.parseUnits(price, 'gwei')}
  const abi=[
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unlockTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
 
    const factory = new ethers.ContractFactory(abid, bytecode, signer)
  const contract = await factory.deploy()
  await contract.deployed()
  console.log(`Deployment successful! Contract Address: ${contract.address}`)
  }

    return ( 
        <>
       <ConnectButton />

       

        <button onClick={()=>compile()}>Hey</button>
        </>
     );
}
 
export default TestSolc;