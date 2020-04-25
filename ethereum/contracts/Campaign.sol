pragma solidity ^0.4.17;


contract CampaignFactory{
    
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public{
        address  newCampaign =  new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaigns;
    }

    
}



contract Campaign{
    
    struct Request{
        string  description;
        uint  value;
        address  recepient;
        bool  complete;
        mapping(address=>bool) approvals;
        uint approvalCount;
    
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    Request[] public requests;
    uint public approversCount;
    
    modifier restricted{
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address creator) public{
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable{
        require(msg.value>minimumContribution, 'not enough fund supplied');
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string description, uint value, address recepient) public restricted{
        Request memory newRequest = Request({
            description: description,
            value:value,
            recepient:recepient,
            complete:false,
            approvalCount : 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public{
        Request storage request = requests[index];
        
        require(approvers[msg.sender],'Only contributers can vote');
        require(!request.approvals[msg.sender],'You already voted');
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
        
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount >(approversCount/2));
        request.recepient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint){
        return requests.length;
    }


}

