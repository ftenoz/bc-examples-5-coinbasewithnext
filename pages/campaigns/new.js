import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from '../../Components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';

class CampaignNew extends Component{
    state = {
        minimumContribution:'',
        errorMesage:'',
        loading:false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading:true, errorMesage:''});

        try{
            const accounts = await web3.eth.getAccounts();

            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from:accounts[0]
                });
            Router.pushRoute('/');

        }catch(err){
            this.setState({errorMesage:err.message});
        }

        this.setState({loading:false});
    };

    render(){
        return(
            <Layout>

                <h3>Create a campaign</h3>
                {/* !!this.state.errormesage'i string'den bool'a çeviriyor. */}
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMesage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label="wei" 
                            labelPosition="right"
                            value = {this.state.minimumContribution}
                            onChange = {event => this.setState({minimumContribution:event.target.value })}
                        />
                    </Form.Field>
                    <Message error header="Opps" content={this.state.errorMesage} />
                    <Button loading={this.state.loading} primary>Create!</Button>

                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;