const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
//const {interface, bytecode} = require('./compile');
const compiledFactory = require('./build/CampaignFactory.json')

require('dotenv').config({path: '../.env'});
console.log(process.env.MNEMONIC);
const provider = new HDWalletProvider(process.env.MNEMONIC,'https://rinkeby.infura.io/v3/337c9886c0234b4b90df23da4d1a79b6' );

const web3 = new Web3(provider);


const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('from account:', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
     .deploy({data: '0x' + compiledFactory.bytecode}) // add 0x bytecode
     .send({from: accounts[0]}); // remove 'gas'

     console.log(result.options.address);

};
deploy();

//address of the deployed contract 
//manager - 0x410905e64Bc8e7401D258715575ab6986D1ED356
//contract - 0x93d64C2409a45F909983F77DdD1E8Ae0b2085fC8

