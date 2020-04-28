import React, {Component} from 'react';
import {Card, Button, Grid, Item} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../Components/Layout';
import {Link} from '../routes';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3'


class CampaignIndex extends Component{

    //requirement of Next.js to skip initial rendering
    static async getInitialProps(){
        const campaigns =  await factory.methods.getDeployedCampaigns().call();

        let campaign;
        let summary;

        var items = new Array();

        var i;

        for(i=0;i<campaigns.length;i++){
            campaign = Campaign(campaigns[i]);
            summary = await campaign.methods.homePage().call();

            var item = {
                title:summary[0],
                description:summary[1],
                target: summary[2],
                minimumContribution:summary[3],
                manager:summary[4],
                address: campaigns[i]
               
            };
            items.push(item);
        };
        
        return {campaigns:campaigns, detailedCampaigns:items };
           
    }

    renderCampaigns(){

        const dc = this.props.detailedCampaigns

        var i;
        var items = new Array();

        for (i = 0; i < dc.length; i++) {
            items[i] = {
                header: dc[i].title,
                description:dc[i].description,
                meta:'Campaign Target: '+web3.utils.fromWei(dc[i].target,'ether')+' ether / Minimum Contribution: '+ dc[i].minimumContribution +' wei',
                extra:( 
                    <Link route={`/campaigns/${dc[i].address}`}>
                     <a>View Campaign</a>
                    </Link>
                ),
                fluid:true    
            };
        };

        return <Card.Group divided items={items}/>

    }

    render(){
        console.log(this.props.detailedCampaigns);
        
        return (
            <Layout>
                <div>
                <h3>Open Campaigns</h3>

                <Link route="/campaigns/new">
                    <a>
                    <Button
                        floated="right"
                        content="Create Campaign"
                        icon="add circle"
                        primary
                    />
                    </a>
                </Link>

                {this.renderCampaigns()}
                </div>
            </Layout>
            );
        



    //     return( 
    //         <Layout>
    //         <h3>Campaign Show</h3>
    //         <Grid>
    //             <Grid.Row>
    //                 <Grid.Column width={10}>  
    //                 {this.renderCampaigns()}
    //                 </Grid.Column>
    //                 <Grid.Column width={6} >  </Grid.Column>
    //             </Grid.Row>
    //             <Grid.Row>
    //                 <Grid.Column>
    //                 <Link route={`/campaigns/${this.props.address}/requests`}>
    //                     <a>
    //                         <Button primary>View Requests</Button>
    //                     </a>
    //                 </Link>
    //                 </Grid.Column>
               
    //             </Grid.Row>
    //         </Grid>
    //     </Layout>
    // );
}
}

export default CampaignIndex;