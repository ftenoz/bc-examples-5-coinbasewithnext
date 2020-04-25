import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && window.web3 !== 'undefined'){
    //in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
}else{
    //we are on the server OR the user is not running metamask
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/337c9886c0234b4b90df23da4d1a79b6');
    web3 = new Web3(provider);
}

export default web3;