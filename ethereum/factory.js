import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';



const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x82b6E4BA65df7aDb7f3DF3EbDb29B5990034Aed0'
);

export default instance;


// 0x93d64C2409a45F909983F77DdD1E8Ae0b2085fC8 (eski factory)
// 0x37aaDD4e18a10Ff42b816ba5b4755B537df305D8

