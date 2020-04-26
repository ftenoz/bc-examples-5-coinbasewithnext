import Web3 from 'web3';

async function getAccounts(value){
    const accounts = await web3.eth.getAccounts();
    console.log(web3.utils.toWei(value,'ether'))
    console.log(accounts);
}

let web3;

if(typeof window !== 'undefined' && window.web3 !== 'undefined'){
    //in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
    console.log('client'+web3);
    getAccounts('1');

}
if(typeof window !== 'undefined' && window.ethereum !== undefined)
{
    window.web3 = new Web3(ethereum);
    new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            web3 = new Web3(window.ethereum);
            try {
              // Request account access if needed
              await window.ethereum.enable();
              // Acccounts now exposed
              resolve(web3);
            } catch (error) {
              reject(error);
            }
        });
    });

}else{
    //we are on the server OR the user is not running metamask
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/337c9886c0234b4b90df23da4d1a79b6');
    web3 = new Web3(provider);
    console.log('server:' +web3);
    getAccounts('2');
}

// let web3;

// if (window.ethereum) {
//     web3 = new Web3(window.ethereum.enable());
//   }
// if(typeof window !== 'undefined' && window.web3 !== 'undefined'){
//     web3 = new Web3(window.web3.currentProvider);
// }
// else{
//     const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/337c9886c0234b4b90df23da4d1a79b6');
//     web3 = new Web3(provider);
//     console.log('server:' +web3);
//     getAccounts('2');
// }

export default web3;