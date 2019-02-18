pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    uint teams = 2;
    uint public  k;
    uint public winningamount;
    uint public randd;
    address[] public team1;
    address[] public team2;
    uint public nonce;

    function Lottery() public {
        manager = msg.sender;

    }

    function enter1() public payable {
        require(msg.value == 0.1 ether);
        team1.push(msg.sender);
      
    }

      function enter2() public payable {
        require(msg.value == 0.1 ether);
        team2.push(msg.sender);
      
    }

    
    function getTeam1() public view returns (address[]) {
     return team1;
        }

        
        
    function getTeam2() public view returns (address[]) {
     return team2;
        }
    
    function random() private returns (uint) {
      uint random1 = uint(keccak256(now, manager, nonce)) % 100;
      nonce++;
      randd = random1;
      return randd;
       
    }

    function pickWinner() public restricted returns (uint) {
        require(msg.sender == manager);

        uint winteam = random() % 2;
      
        if (winteam == 0) {
              uint winamount = this.balance/team1.length;
              winningamount = winamount;
              for (uint i = 0;i<team1.length;i++) {
                  team1[i].transfer(winamount);
           
                  
              }
               team1 = new address[](0);
                   team2 = new address[](0);
        
        k = 1;


        } else {
            uint winamount1 = this.balance/team2.length;
             winningamount = winamount1;
              for (uint j = 0;j<team2.length;j++) {
                  team2[j].transfer(winamount1);
        }
         team1 = new address[](0);
                   team2 = new address[](0);

          k = 2;
        }
              
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }


}
