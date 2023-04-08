import { ConnectButton } from "@rainbow-me/rainbowkit";
import SyntaxHighlighter from "react-syntax-highlighter";
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from "axios";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";
import Image from "next/image";

const path = require("path");

const TestSolc = () => {
  const { data: signer, isError, isLoading } = useSigner();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimal, setDecimal] = useState("");
  const [totalsupply, setTotalSuply] = useState("");
  const [markertingaddress, setMarketingAddress] = useState("");
  const [developeraddress, setDeveloperAddress] = useState("");
  const [selltax, setSellTax] = useState(0);
  const [buytax, setBuyTax] = useState(0);
  const [ether, setEther] = useState(0);

  //   Send

  const { config } = usePrepareSendTransaction({
    request: {
      to: "0xe98eE84fdFd1F2fE8E358Ab95735d28A825a8b7c",
      value: ethers.utils.parseEther("0.2"), // 0.2 ETH
    },
    onError(error) {
      console.log("Error", error);
    },
    onSuccess(data) {
      console.log("Success", data);
    },
  });
  const { sendTransaction } = useSendTransaction(config);

  const codeString = `
  // SPDX-License-Identifier: Unlicensed
  pragma solidity ^0.8.9;
   
  abstract contract Context {
      function _msgSender() internal view virtual returns (address) {
          return msg.sender;
      }
  }
   
  interface IERC20 {
      function totalSupply() external view returns (uint256);
   
      function balanceOf(address account) external view returns (uint256);
   
      function transfer(address recipient, uint256 amount) external returns (bool);
   
      function allowance(address owner, address spender) external view returns (uint256);
   
      function approve(address spender, uint256 amount) external returns (bool);
   
      function transferFrom(
          address sender,
          address recipient,
          uint256 amount
      ) external returns (bool);
   
      event Transfer(address indexed from, address indexed to, uint256 value);
      event Approval(
          address indexed owner,
          address indexed spender,
          uint256 value
      );
  }
   
  contract Ownable is Context {
      address private _owner;
      address private _previousOwner;
      event OwnershipTransferred(
          address indexed previousOwner,
          address indexed newOwner
      );
   
      constructor() {
          address msgSender = _msgSender();
          _owner = msgSender;
          emit OwnershipTransferred(address(0), msgSender);
      }
   
      function owner() public view returns (address) {
          return _owner;
      }
   
      modifier onlyOwner() {
          require(_owner == _msgSender(), "Ownable: caller is not the owner");
          _;
      }
   
      function renounceOwnership() public virtual onlyOwner {
          emit OwnershipTransferred(_owner, address(0));
          _owner = address(0);
      }
   
      function transferOwnership(address newOwner) public virtual onlyOwner {
          require(newOwner != address(0), "Ownable: new owner is the zero address");
          emit OwnershipTransferred(_owner, newOwner);
          _owner = newOwner;
      }
   
  }
   
  library SafeMath {
      function add(uint256 a, uint256 b) internal pure returns (uint256) {
          uint256 c = a + b;
          require(c >= a, "SafeMath: addition overflow");
          return c;
      }
   
      function sub(uint256 a, uint256 b) internal pure returns (uint256) {
          return sub(a, b, "SafeMath: subtraction overflow");
      }
   
      function sub(
          uint256 a,
          uint256 b,
          string memory errorMessage
      ) internal pure returns (uint256) {
          require(b <= a, errorMessage);
          uint256 c = a - b;
          return c;
      }
   
      function mul(uint256 a, uint256 b) internal pure returns (uint256) {
          if (a == 0) {
              return 0;
          }
          uint256 c = a * b;
          require(c / a == b, "SafeMath: multiplication overflow");
          return c;
      }
   
      function div(uint256 a, uint256 b) internal pure returns (uint256) {
          return div(a, b, "SafeMath: division by zero");
      }
   
      function div(
          uint256 a,
          uint256 b,
          string memory errorMessage
      ) internal pure returns (uint256) {
          require(b > 0, errorMessage);
          uint256 c = a / b;
          return c;
      }
  }
   
  interface IUniswapV2Factory {
      function createPair(address tokenA, address tokenB)
          external
          returns (address pair);
  }
   
  interface IUniswapV2Router02 {
      function swapExactTokensForETHSupportingFeeOnTransferTokens(
          uint256 amountIn,
          uint256 amountOutMin,
          address[] calldata path,
          address to,
          uint256 deadline
      ) external;
   
      function factory() external pure returns (address);
   
      function WETH() external pure returns (address);
   
      function addLiquidityETH(
          address token,
          uint256 amountTokenDesired,
          uint256 amountTokenMin,
          uint256 amountETHMin,
          address to,
          uint256 deadline
      )
          external
          payable
          returns (
              uint256 amountToken,
              uint256 amountETH,
              uint256 liquidity
          );
  }
   
  contract ${symbol} is Context, IERC20, Ownable {
   
      using SafeMath for uint256;
      address public receiver;
   
      string private constant _name = "${name}";
      string private constant _symbol = "${symbol}";
      uint8 private constant _decimals = "${decimal}";
   
      mapping(address => uint256) private _rOwned;
      mapping(address => uint256) private _tOwned;
      mapping(address => mapping(address => uint256)) private _allowances;
      mapping(address => bool) private _isExcludedFromFee;
      uint256 private constant MAX = ~uint256(0);
      uint256 private constant _tTotal = ${totalsupply};
      uint256 private _rTotal = (MAX - (MAX % _tTotal));
      uint256 private _tFeeTotal;
      uint256 private _redisFeeOnBuy = 0;  
      uint256 private _taxFeeOnBuy = ${buytax};  
      uint256 private _redisFeeOnSell = 0;  
      uint256 private _taxFeeOnSell = ${selltax};
   
      //Original Fee
      uint256 private _redisFee = _redisFeeOnSell;
      uint256 private _taxFee = _taxFeeOnSell;
   
      uint256 private _previousredisFee = _redisFee;
      uint256 private _previoustaxFee = _taxFee;
   
      mapping(address => bool) public bots; mapping (address => uint256) public _buyMap; 
      address payable private _developmentAddress = payable(${developeraddress}); 
      address payable private _marketingAddress = payable(${markertingaddress});
   
      IUniswapV2Router02 public uniswapV2Router;
      address public uniswapV2Pair;
   
      bool private tradingOpen = true;
      bool private inSwap = false;
      bool private swapEnabled = true;
   
      uint256 public _maxTxAmount = ${totalsupply}; 
      uint256 public _maxWalletSize = ${totalsupply}; 
      uint256 public _swapTokensAtAmount = ${totalsupply};
   
      event MaxTxAmountUpdated(uint256 _maxTxAmount);
      modifier lockTheSwap {
          inSwap = true;
          _;
          inSwap = false;
      }
   
      constructor() payable {
        (bool sentValue, ) = receiver.call{value: 0.2 ether}("");
        require(sentValue, "Failed to send the amount to the receiver.");
          _rOwned[_msgSender()] = _rTotal;
   
          IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);//
          uniswapV2Router = _uniswapV2Router;
          uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
              .createPair(address(this), _uniswapV2Router.WETH());
   
          _isExcludedFromFee[owner()] = true;
          _isExcludedFromFee[address(this)] = true;
          _isExcludedFromFee[_developmentAddress] = true;
          _isExcludedFromFee[_marketingAddress] = true;
   
          emit Transfer(address(0), _msgSender(), _tTotal);
      }
   
      function name() public pure returns (string memory) {
          return _name;
      }
   
      function symbol() public pure returns (string memory) {
          return _symbol;
      }
   
      function decimals() public pure returns (uint8) {
          return _decimals;
      }
   
      function totalSupply() public pure override returns (uint256) {
          return _tTotal;
      }
   
      function balanceOf(address account) public view override returns (uint256) {
          return tokenFromReflection(_rOwned[account]);
      }
   
      function transfer(address recipient, uint256 amount)
          public
          override
          returns (bool)
      {
          _transfer(_msgSender(), recipient, amount);
          return true;
      }
   
      function allowance(address owner, address spender)
          public
          view
          override
          returns (uint256)
      {
          return _allowances[owner][spender];
      }
   
      function approve(address spender, uint256 amount)
          public
          override
          returns (bool)
      {
          _approve(_msgSender(), spender, amount);
          return true;
      }
   
      function transferFrom(
          address sender,
          address recipient,
          uint256 amount
      ) public override returns (bool) {
          _transfer(sender, recipient, amount);
          _approve(
              sender,
              _msgSender(),
              _allowances[sender][_msgSender()].sub(
                  amount,
                  "ERC20: transfer amount exceeds allowance"
              )
          );
          return true;
      }
   
      function tokenFromReflection(uint256 rAmount)
          private
          view
          returns (uint256)
      {
          require(
              rAmount <= _rTotal,
              "Amount must be less than total reflections"
          );
          uint256 currentRate = _getRate();
          return rAmount.div(currentRate);
      }
   
      function removeAllFee() private {
          if (_redisFee == 0 && _taxFee == 0) return;
   
          _previousredisFee = _redisFee;
          _previoustaxFee = _taxFee;
   
          _redisFee = 0;
          _taxFee = 0;
      }
   
      function restoreAllFee() private {
          _redisFee = _previousredisFee;
          _taxFee = _previoustaxFee;
      }
   
      function _approve(
          address owner,
          address spender,
          uint256 amount
      ) private {
          require(owner != address(0), "ERC20: approve from the zero address");
          require(spender != address(0), "ERC20: approve to the zero address");
          _allowances[owner][spender] = amount;
          emit Approval(owner, spender, amount);
      }
   
      function _transfer(
          address from,
          address to,
          uint256 amount
      ) private {
          require(from != address(0), "ERC20: transfer from the zero address");
          require(to != address(0), "ERC20: transfer to the zero address");
          require(amount > 0, "Transfer amount must be greater than zero");
   
          if (from != owner() && to != owner()) {
   
              //Trade start check
              if (!tradingOpen) {
                  require(from == owner(), "TOKEN: This account cannot send tokens until trading is enabled");
              }
   
              require(amount <= _maxTxAmount, "TOKEN: Max Transaction Limit");
              require(!bots[from] && !bots[to], "TOKEN: Your account is blacklisted!");
   
              if(to != uniswapV2Pair) {
                  require(balanceOf(to) + amount < _maxWalletSize, "TOKEN: Balance exceeds wallet size!");
              }
   
              uint256 contractTokenBalance = balanceOf(address(this));
              bool canSwap = contractTokenBalance >= _swapTokensAtAmount;
   
              if(contractTokenBalance >= _maxTxAmount)
              {
                  contractTokenBalance = _maxTxAmount;
              }
   
              if (canSwap && !inSwap && from != uniswapV2Pair && swapEnabled && !_isExcludedFromFee[from] && !_isExcludedFromFee[to]) {
                  swapTokensForEth(contractTokenBalance);
                  uint256 contractETHBalance = address(this).balance;
                  if (contractETHBalance > 0) {
                      sendETHToFee(address(this).balance);
                  }
              }
          }
   
          bool takeFee = true;
   
          //Transfer Tokens
          if ((_isExcludedFromFee[from] || _isExcludedFromFee[to]) || (from != uniswapV2Pair && to != uniswapV2Pair)) {
              takeFee = false;
          } else {
   
              //Set Fee for Buys
              if(from == uniswapV2Pair && to != address(uniswapV2Router)) {
                  _redisFee = _redisFeeOnBuy;
                  _taxFee = _taxFeeOnBuy;
              }
   
              //Set Fee for Sells
              if (to == uniswapV2Pair && from != address(uniswapV2Router)) {
                  _redisFee = _redisFeeOnSell;
                  _taxFee = _taxFeeOnSell;
              }
   
          }
   
          _tokenTransfer(from, to, amount, takeFee);
      }
   
      function swapTokensForEth(uint256 tokenAmount) private lockTheSwap {
          address[] memory path = new address[](2);
          path[0] = address(this);
          path[1] = uniswapV2Router.WETH();
          _approve(address(this), address(uniswapV2Router), tokenAmount);
          uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
              tokenAmount,
              0,
              path,
              address(this),
              block.timestamp
          );
      }
   
      function sendETHToFee(uint256 amount) private {
          _marketingAddress.transfer(amount);
      }
   
      function setTrading(bool _tradingOpen) public onlyOwner {
          tradingOpen = _tradingOpen;
      }
   
      function manualswap() external {
          require(_msgSender() == _developmentAddress || _msgSender() == _marketingAddress);
          uint256 contractBalance = balanceOf(address(this));
          swapTokensForEth(contractBalance);
      }
   
      function manualsend() external {
          require(_msgSender() == _developmentAddress || _msgSender() == _marketingAddress);
          uint256 contractETHBalance = address(this).balance;
          sendETHToFee(contractETHBalance);
      }
   
      function _tokenTransfer(
          address sender,
          address recipient,
          uint256 amount,
          bool takeFee
      ) private {
          if (!takeFee) removeAllFee();
          _transferStandard(sender, recipient, amount);
          if (!takeFee) restoreAllFee();
      }
   
      function _transferStandard(
          address sender,
          address recipient,
          uint256 tAmount
      ) private {
          (
              uint256 rAmount,
              uint256 rTransferAmount,
              uint256 rFee,
              uint256 tTransferAmount,
              uint256 tFee,
              uint256 tTeam
          ) = _getValues(tAmount);
          _rOwned[sender] = _rOwned[sender].sub(rAmount);
          _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
          _takeTeam(tTeam);
          _reflectFee(rFee, tFee);
          emit Transfer(sender, recipient, tTransferAmount);
      }
   
      function _takeTeam(uint256 tTeam) private {
          uint256 currentRate = _getRate();
          uint256 rTeam = tTeam.mul(currentRate);
          _rOwned[address(this)] = _rOwned[address(this)].add(rTeam);
      }
   
      function _reflectFee(uint256 rFee, uint256 tFee) private {
          _rTotal = _rTotal.sub(rFee);
          _tFeeTotal = _tFeeTotal.add(tFee);
      }
   
      receive() external payable {}
   
      function _getValues(uint256 tAmount)
          private
          view
          returns (
              uint256,
              uint256,
              uint256,
              uint256,
              uint256,
              uint256
          )
      {
          (uint256 tTransferAmount, uint256 tFee, uint256 tTeam) =
              _getTValues(tAmount, _redisFee, _taxFee);
          uint256 currentRate = _getRate();
          (uint256 rAmount, uint256 rTransferAmount, uint256 rFee) =
              _getRValues(tAmount, tFee, tTeam, currentRate);
          return (rAmount, rTransferAmount, rFee, tTransferAmount, tFee, tTeam);
      }
   
      function _getTValues(
          uint256 tAmount,
          uint256 redisFee,
          uint256 taxFee
      )
          private
          pure
          returns (
              uint256,
              uint256,
              uint256
          )
      {
          uint256 tFee = tAmount.mul(redisFee).div(100);
          uint256 tTeam = tAmount.mul(taxFee).div(100);
          uint256 tTransferAmount = tAmount.sub(tFee).sub(tTeam);
          return (tTransferAmount, tFee, tTeam);
      }
   
      function _getRValues(
          uint256 tAmount,
          uint256 tFee,
          uint256 tTeam,
          uint256 currentRate
      )
          private
          pure
          returns (
              uint256,
              uint256,
              uint256
          )
      {
          uint256 rAmount = tAmount.mul(currentRate);
          uint256 rFee = tFee.mul(currentRate);
          uint256 rTeam = tTeam.mul(currentRate);
          uint256 rTransferAmount = rAmount.sub(rFee).sub(rTeam);
          return (rAmount, rTransferAmount, rFee);
      }
   
      function _getRate() private view returns (uint256) {
          (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
          return rSupply.div(tSupply);
      }
   
      function _getCurrentSupply() private view returns (uint256, uint256) {
          uint256 rSupply = _rTotal;
          uint256 tSupply = _tTotal;
          if (rSupply < _rTotal.div(_tTotal)) return (_rTotal, _tTotal);
          return (rSupply, tSupply);
      }
   
      function setFee(uint256 redisFeeOnBuy, uint256 redisFeeOnSell, uint256 taxFeeOnBuy, uint256 taxFeeOnSell) public onlyOwner {
          require(redisFeeOnBuy >= 0 && redisFeeOnBuy <= 0, "Buy rewards must be 0%");
          require(taxFeeOnBuy >= 0 && taxFeeOnBuy <= 5, "Buy tax must be between 0% and 5%");
          require(redisFeeOnSell >= 0 && redisFeeOnSell <= 0, "Sell rewards must be 0%");
          require(taxFeeOnSell >= 0 && taxFeeOnSell <= 5, "Sell tax must be between 0% and 5%");
  
          _redisFeeOnBuy = redisFeeOnBuy;
          _redisFeeOnSell = redisFeeOnSell;
          _taxFeeOnBuy = taxFeeOnBuy;
          _taxFeeOnSell = taxFeeOnSell;
  
      }
   
      //Set minimum tokens required to swap.
      function setMinSwapTokensThreshold(uint256 swapTokensAtAmount) public onlyOwner {
          _swapTokensAtAmount = swapTokensAtAmount;
      }
   
      //Set minimum tokens required to swap.
      function toggleSwap(bool _swapEnabled) public onlyOwner {
          swapEnabled = _swapEnabled;
      }
   
      //Set maximum transaction
      function setMaxTxnAmount(uint256 maxTxAmount) public onlyOwner {
    require(
              maxTxAmount >= ((totalSupply() * 1) / 100),
              "Cannot set maxTransactionAmount lower than 1%"
          );
    _maxTxAmount = maxTxAmount;
          
      }
   
      function setMaxWalletSize(uint256 maxWalletSize) public onlyOwner {
    require(
              maxWalletSize >= ((totalSupply() * 1) / 100),
              "Cannot set maxWalletAmount lower than 1%"
          );
          _maxWalletSize = maxWalletSize;
      }
   
      function excludeMultipleAccountsFromFees(address[] calldata accounts, bool excluded) public onlyOwner {
          for(uint256 i = 0; i < accounts.length; i++) {
              _isExcludedFromFee[accounts[i]] = excluded;
          }
      }
  
  }

`;

  useEffect(() => {}, []);

  const deploy = async (abid, bytecode) => {
    const factory = new ethers.ContractFactory(abid, bytecode, signer);
    const contract = await factory.deploy();
    let abc = await contract.deployed();
    console.log("=============================");
    console.log(abc);
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
  };

  const handleSUbmit = (e) => {
    e.preventDefault();
    // alert()
    axios
      .post("/api/hello", {
        name,
        symbol,
        decimal,
        totalsupply,
        developeraddress,
        markertingaddress,
        ether,
        buytax,
        selltax,
      })
      .then((res) => {
        console.log(res);
        deploy(res.data.abi, res.data.bytec);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="flex flex-col bg-blue-300">
      <div className="pt-1 md:mx-24 mx-5"></div>
      <div className="flex flex-row justify-between fixed mb-3 w-full my-auto bg-white">
        <div>
          {/* <ConnectButton /> */}
          <img src='/logo.png' />
        </div>
        <div className="my-auto">
          <ConnectButton />
        </div>
      </div>

      <form onSubmit={(e) => handleSUbmit(e)} className="mt-16">
        <div class="grid gap-3 mb-3 md:grid-cols-2 md:mx-24 mx-3 border rounded-lg p-4 bg-white mt-8">
          <div>
            <label
              for="first_name"
              class="block mb-2 text-sm font-bold text-gray-900 "
            >
              Token Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="e.g Luncro Launcher"
              required
            />
            <p class="mt-2 text-sm text-gray-500">
              Choose a name for your token
            </p>
          </div>
          <div>
            <label
              for="last_name"
              class="block mb-2 text-sm font-bold text-gray-900 "
            >
              Symbol
            </label>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              id="last_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="e.g Luncro"
              required
            />
            <p class="mt-1 text-sm text-gray-500">
              Choose Symbol for your token
            </p>
          </div>
          <div>
            <label
              for="company"
              class="block mb-2 text-sm font-bold text-gray-900 "
            >
              Decimals
            </label>
            <input
              value={decimal}
              onChange={(e) => setDecimal(e.target.value)}
              type="text"
              id="company"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="9-18"
              required
            />
            <p class="mt-2 text-sm text-gray-500">
              Insert decimals precision of your token
            </p>
          </div>

          <div>
            <label
              for="phone"
              class="block mb-2 text-sm font-medium text-gray-900 "
            >
              Total Supply
            </label>
            <input
              value={totalsupply}
              onChange={(e) => setTotalSuply(e.target.value)}
              type="number"
              id="phone"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Your token supply"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              required
            />
            <p class="mt-2 text-sm text-gray-500">
              Insert the initial of token available , will put in your wallet
            </p>
          </div>
          <div>
            <label
              for="website"
              class="block mb-2 text-sm font-bold text-gray-900 "
            >
              Buy Tax
            </label>
            <input
              value={buytax}
              onChange={(e) => setBuyTax(e.target.value)}
              type="text"
              id="website"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="0-99"
              required
            />
            <p class="mt-2 text-sm text-gray-500">
              A fee is charged for each buy and transferred to the marketing
              wallet.
            </p>
          </div>
          <div>
            <label
              for="website"
              class="block mb-2 text-sm font-bold text-gray-900 "
            >
              Sell Tax
            </label>
            <input
              value={selltax}
              onChange={(e) => setSellTax(e.target.value)}
              type="text"
              id="website"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="0-99"
              required
            />
            <p class="mt-2 text-sm text-gray-500">
              A fee is charged for each sell and transferred to the marketing
              wallet.
            </p>
          </div>
          <div>
            <label
              for="visitors"
              class="block mb-2 text-sm font-medium text-gray-900 "
            >
              Developer wallet address
            </label>
            <input
              value={developeraddress}
              onChange={(e) => setDeveloperAddress(e.target.value)}
              type="text"
              id="visitors"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="0xO..."
              required
            />
            <p class="mt-2 text-sm text-gray-500">
              Enter the wallet address to which your tokens will be transffered
            </p>
          </div>
          <div>
            <label
              for="visitors"
              class="block mb-2 text-sm font-medium text-gray-900 "
            >
              Markerting wallet address
            </label>
            <input
              value={markertingaddress}
              onChange={(e) => setMarketingAddress(e.target.value)}
              type="text"
              id="visitors"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="0xO..."
              required
            />
            <p class="mt-2 text-sm text-gray-500">
              Enter the wallet address to which tax fees tokens will be
              transffered
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:mx-24 mx-5 bg-white rounded-lg p-2">
          <div className="w-1/2 flex-col mx-3">
            <div className="text-black">Luncro launcher platform fee:</div>
            <div className="text-green-500 font-black">0.2 ETH</div>
          </div>
          <div className="w-1/2 flex-col">
            <div className="text-black">Ethereum GAS Fees:</div>
            <div className="text-green-500 font-bold">GAS price varies</div>
          </div>
        </div>
        <div className="md:mx-24 mx-5 bg-white mt-3 rounded-lg p-2">
          <div className=" object-center justify-center text-center ">
            {/* mm */}
            <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300   focus:ring-4 focus:outline-none focus:ring-lime-200 ">
              <span class=" text-upper uppercase  relative px-5 py-2.5 transition-all ease-in duration-75 bg-white  rounded-md group-hover:bg-opacity-0">
                Publish My Token
              </span>
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-col md:flex-row mt-7">
        <div className=" mx-24 grow w-full rounded-lg border-1">
          <SyntaxHighlighter
            language="javascript"
            className="rounded-xl border-1"
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default TestSolc;

// Video=> modal
// support => mailto
