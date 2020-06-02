pragma solidity >=0.4.22 <0.5.0;

contract Coursetro {
    
   string fName;
   uint age;
   address owner; 
   
   constructor() public {
       owner = msg.sender;
   }
   
   modifier onlyOwner {
       require(msg.sender == owner, "Caller is not owner");
       _;
   }
   
   event Instructor(
       string name,
       uint age
    );

   function setInstructor(string _fName, uint _age) onlyOwner public {
       fName = _fName;
       age = _age;
       emit Instructor(_fName, _age);
   }
   
   function getInstructor() view public returns (string, uint) {
       return (fName, age);
   }
   
}