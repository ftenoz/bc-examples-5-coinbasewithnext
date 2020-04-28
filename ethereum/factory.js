import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';



const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x7662B0DE7C84a4b09096Ec838226Fb15B1ce6b1d'
);

export default instance;


// 0x93d64C2409a45F909983F77DdD1E8Ae0b2085fC8 (eski factory)
// 0x37aaDD4e18a10Ff42b816ba5b4755B537df305D8

