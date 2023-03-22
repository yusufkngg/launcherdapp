import { ConnectButton } from '@rainbow-me/rainbowkit';
import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useSigner } from 'wagmi';

const path = require('path');


const TestSolc = () => {
  const { data: signer, isError, isLoading } = useSigner()
  const [name, setName]=useState('')
  const [symbol, setSymbol]=useState('')
  const [decimal, setDecimal]=useState('')
  const [totalsupply, setTotalSuply]=useState('')
  
  const codeString = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken {
    string public name = "${name}";
    string public symbol = "${symbol}";
    uint256 public totalSupply = "${totalsupply}";
    uint256 public decimals = "${decimal}";
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool success) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}

`
  

  useEffect(()=>{
   

  },[])

  const compile=()=>{
    
  }

  const deploy=async(abid, bytecode)=>{
  
 
    const factory = new ethers.ContractFactory(abid, bytecode, signer)
  const contract = await factory.deploy()
  await contract.deployed()
  console.log(`Deployment successful! Contract Address: ${contract.address}`)
  }

  const handleSUbmit=(e)=>{
    e.preventDefault()
    // alert()
    axios.post('/api/hello',
    {
      name,symbol,decimal,totalsupply
    })
    .then(res=>{
      console.log(res)
      deploy(res.data.abi, res.data.bytec)
    }).catch(e=>{
      console.log(e)
    })
  }

    return ( 
      <div className="flex flex-col">
      <div>
      <ConnectButton />

      

        
      </div>

      <div className='flex flex-col md:flex-row mt-7'>
        <div className='md:w-1/2 w-full'>


<form onSubmit={(e)=>handleSUbmit(e)}>
  
  
  <div class="grid md:grid-cols-2 md:gap-6">
    <div class="relative z-0 w-full mb-6 group">
        <input type="text"
        value={name} onChange={(e)=>setName(e.target.value)}
         name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Token Name</label>
    </div>
    <div class="relative z-0 w-full mb-6 group">
        <input type="text" 
        value={symbol} onChange={(e)=>setSymbol(e.target.value)}
        name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Symbol</label>
    </div>
  </div>
  <div class="grid md:grid-cols-2 md:gap-6">
    <div class="relative z-0 w-full mb-6 group">
        <input type="number" 
        value={totalsupply} onChange={(e)=>setTotalSuply(e.target.value)}
         name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Total Supply</label>
    </div>
    <div class="relative z-0 w-full mb-6 group">
        <input type="text" name="floating_company"
        value={decimal} onChange={(e)=>setDecimal(e.target.value)}
         id="floating_company" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_company" class="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Number of decimals</label>
    </div>
  </div>
  <button type="submit" value={'Deploy ERC20'} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Deploy ERC20</button>
</form>

          

        </div>
        <div className='md:w-1/2 w-full rounded-lg border-1'>
        <SyntaxHighlighter language="javascript" className="rounded-xl border-1">
      {codeString}
    </SyntaxHighlighter>

        </div>

      </div>
      
      
      
        
      
    </div>
     );
}
 
export default TestSolc;