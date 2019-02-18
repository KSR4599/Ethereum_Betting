const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () =>{
  accounts = await web3.eth.getAccounts();
  lottery =  await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from : accounts[0], gas: '1000000'})
})

describe('Lottery Contract', () => {
  it('deploys a contract', () =>{
    assert.ok(lottery.options.address);
  })

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({   //enters into the contract names lottery
      from: accounts[0],                    //who is entering. We are passing the first account the ganache gave us.
      value : '200000000000000000'//web3.utils.toWei('0.02', 'ether')//ethers we are paying to enter. Since the module acceots the currency only in wei, we made of of converter provided by the web3 to convert the ethers into wei.

    })

    await lottery.methods.enter().send({   //enters into the contract names lottery
      from: accounts[1],                    //who is entering. We are passing the first account the ganache gave us.
      value :  '200000000000000000'

    })

    await lottery.methods.enter().send({   //enters into the contract names lottery
      from: accounts[2],                    //who is entering. We are passing the first account the ganache gave us.
      value : '200000000000000000'


    })

    const players = await lottery.methods.getPlayers().call({  //getting all the entered players into an array.
      from: accounts[0]    //who is calling this method.
    })


    assert.equal(accounts[0], players[0]);   //tetsing whether the first account is equal to first account in players
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);         //if so players array length must be equal to 1
  })

  it('requires a minimum amount of ether to enter', async () => {
    try {
    await lottery.methods.enter().send({
      from : accounts[0],
      value : 0                     //Deliberately setting the value to zero, so that this statement throws the error
    });
    assert(false); //Just to make double sure
  } catch(err){
    assert(err);            //assertion that error has occured , so that the test can pass.
  }
  })

  it('only manager can call pickWinner', async () => {
    try{
      await lottery.methods.pickWinner().send({
        from: accounts[1]              //Deliberately setting the value other than manager account which is zero.
      });
      assert(false);
    } catch(err){
      assert(err);                 //assertion that error has occured , so that the test can pass.
    }
  })


//Note:- Here to make our lives easy, we are actually sending in only one player and making sure he gets the money.
  it('sends money to the winner and resets the players array', async () => {
     await lottery.methods.enter().send({
       from: accounts[0],                   //Making the first player (manager) to enter the players array.
       value: web3.utils.toWei('2','ether')
     })

     const initialBalance = await web3.eth.getBalance(accounts[0]);   //balance before picking Winner.
     await lottery.methods.pickWinner().send({ from :accounts[0] });  //Calling the pickWinner from manager account (only he is supposed to do so).
     const finalBalance = await web3.eth.getBalance(accounts[0]);    //balance after pickWinner
     const difference = finalBalance - initialBalance;  //caluclating the amount of difference before and after the pickWinner()
     console.log('Amount transfered is',finalBalance - initialBalance);  //Console logging the balance.
     assert(difference > web3.utils.toWei('1.8','ether'));  //2(something less coz some amount is spent on gas) ether is definetely greater than 1.8, so this assertion must be  true.
     assert(players.length,0);  //Making sure the players list is empty
  })
})
