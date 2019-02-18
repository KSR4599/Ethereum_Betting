const path = require('path'); //For cross-platform compatibility. Since we are using solidity and not plain javascipt.
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname,'contracts','Lottery.sol'); //creating a variable called inboxPath to hold the inbox.sol file present in the contracts folder of Inbox.
const source = fs.readFileSync(lotteryPath, 'utf8');  //Getting the entire source code of the contract into the variable.

module.exports = solc.compile(source, 1).contracts[':Lottery'];  //we are getting only the contract named Inbox (that too just byte code and interface) and letting it be available to the other modules as well.
