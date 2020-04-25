const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data:compiledFactory.bytecode})
        .send({from:accounts[0],gas:'1000000'});

    await factory.methods.createCampaign('100').send({
        from:accounts[0],
        gas:'1000000'
    });

    const addresses= await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
    
});

describe('campaigns', ()=>{

    it('deploys a factory',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the manager', async ()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);
    });

    it('allows people contribute and marks them as approvers',async ()=>{
        await campaign.methods.contribute().send({
            value:'200',
            from:accounts[1]
        });
        const isContributer = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributer);
    });

    it('should not allow below minimum', async ()=>{
        try{
            await campaign.contribute().send({
                value:'5',
                from:accounts[1]
            });
        } catch(err){
            assert(err);
        }
    });

    it('allows a manager to make payment request', async ()=>{
        await campaign.methods
            .createRequest('Buy batteries','100', accounts[1])
            .send({
                from:accounts[0],
                gas:'1000000'
            });
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries', request.description)
    });


    it('processes requests', async ()=>{
        await campaign.methods.contribute().send({
            from:accounts[0],
            value:web3.utils.toWei('10','ether')
        });

        await campaign.methods
            .createRequest('A',web3.utils.toWei('5','ether'),accounts[1])
            .send({from:accounts[0], gas:'1000000'});

        await campaign.methods.approveRequest(0).send(
            {from:accounts[0],
            gas:'1000000'}
        );

        let initialBalance = await web3.eth.getBalance(accounts[1]);
        initialBalance = web3.utils.fromWei(initialBalance,'ether');

        await campaign.methods.finalizeRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        });

        let finalBalance = await web3.eth.getBalance(accounts[1]);
        finalBalance = web3.utils.fromWei(finalBalance,'ether');
        finalBalance = parseFloat(finalBalance);

        assert(finalBalance>initialBalance);

    });

});

