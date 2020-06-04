pragma solidity >=0.4.22 <0.5.0;

contract Owned {
    
    address owner;
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can do it");
        _;
    }
}
contract Courses is Owned {
    struct Instructor {
        uint age;
        bytes16 fName;
        bytes16 lName;
    }
    
    mapping (address => Instructor) instructors;
    address [] public instructorAccts;
    
    event instructorInfo (
        uint age,
        bytes16 fName,
        bytes16 lName
    );
    
    function setInstruction(address _address, uint _age, bytes16 _fName, bytes16 _lName) onlyOwner public {
        Instructor storage instructor = instructors[_address];
        
        instructor.age = _age;
        instructor.fName = _fName;
        instructor.lName = _lName;
        
        instructorAccts.push(_address);
        emit instructorInfo(_age, _fName, _lName);
    }
    
    function getInstructors() view public returns(address[]) {
        return instructorAccts;
    }
    
    function getInstructor(address _address) view public returns(uint, bytes16, bytes16) {
        Instructor storage instructor = instructors[_address];
        return (instructor.age, instructor.fName, instructor.lName);
    }
    
    function countInstructors() view public returns(uint) {
        return instructorAccts.length;
    }
    
}