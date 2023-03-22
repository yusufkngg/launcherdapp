// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import solc from 'solc';
export default function handler(req, res) {

  console.log(req.body.name)
  console.log("hellow world")

  // string public name = "${req.body.name}";
  //         string public symbol = "${req.body.symbol}";
  //         uint256 public totalSupply = "${req.body.totalsupply}";
  //         uint256 public decimals = "${req.body.decimal}";
  const source=`
      // SPDX-License-Identifier: MIT
      pragma solidity ^0.8.0;

      contract MyToken {
          string public name = "${req.body.name}";
          string public symbol = "${req.body.symbol}";
          uint256 public totalSupply = ${req.body.totalsupply};
          uint256 public decimals = ${req.body.decimal};
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
      const input = {
        language: 'Solidity',
        sources: {
          'MyToken.sol': {
            content: source,
          },
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };
      
      //compile contract
      var output = JSON.parse(solc.compile(JSON.stringify(input)));
      
      //create build folder
      // fs.ensureDirSync(builtPath);
      let abi=output.contracts['MyToken.sol']['MyToken'].abi
      let bytec=output.contracts['MyToken.sol']['MyToken'].evm.bytecode.object;
      // console.log(output.contracts['MyToken.sol']['MyToken'].evm.bytecode);
  res.status(200).json(
    { 
      name: 'John Doe',
      abi: abi,
      bytec: bytec,
     }
    )
}
