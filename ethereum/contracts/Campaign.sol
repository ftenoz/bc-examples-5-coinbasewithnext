pragma solidity ^0.4.17;

contract CampaignFactory{
    
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum, string title, string description, uint target) public{
        address  newCampaign =  new Campaign(minimum,  title, description,target,msg.sender);
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
        uint approvingDonationTotal;

    }
    
    address public manager;
    uint public minimumContribution;
    string public campaignTitle;
    string public campaignDescription;
    uint public campaignTarget;
    mapping(address=>bool) public approvers;
    mapping(address=>uint) public howMuchDonated;
    Request[] public requests;
    uint public approversCount;
    uint public totalDonation;
   
    
    
    modifier restricted{
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, string title, string description, uint target, address creator) public{
        manager = creator;
        minimumContribution = minimum;
        campaignTitle = title;
        campaignDescription = description;
        campaignTarget = target;
    }
    
    function contribute() public payable{
        require(msg.value>minimumContribution, 'not enough fund supplied');
        approvers[msg.sender] = true;
        approversCount++;
        totalDonation += msg.value;
        howMuchDonated[msg.sender] += msg.value;
        
    }
    
    function createRequest(string description, uint value, address recepient) public restricted{
        Request memory newRequest = Request({
            description: description,
            value:value,
            recepient:recepient,
            complete:false,
            approvalCount : 0,
            approvingDonationTotal:0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public{
        Request storage request = requests[index];
        
        require(approvers[msg.sender],'Only contributers can vote');
        require(!request.approvals[msg.sender],'You already voted');
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        request.approvingDonationTotal += howMuchDonated[msg.sender];
        
        
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(!request.complete);
        //require(request.approvalCount >(approversCount/2));
        require((totalDonation / request.approvingDonationTotal) < 2);
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
    
     function homePage() public view returns (string, string, uint, uint, address){
        return(
            campaignTitle,
            campaignDescription,
            campaignTarget,
            minimumContribution,
            manager
        );
    }

    function getRequestCount() public view returns (uint){
        return requests.length;
    }


}

