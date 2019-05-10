pragma solidity ^0.5.0; // set the version

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id; // uint is an unsigned integer it can't be negative
        string content;
        bool completed;
    }
// mapping is like hash tables of key/value pairs
    mapping(uint => Task ) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    constructor() public {
        createTask("Learning the Basics of Solidity");
        
    }

    function createTask(string memory _content) public {
/*  mapping has a dynamic size in other words, 
    solidity doesn't  know it size automaticly. This is why we need taskCount */
        taskCount ++;

// create a new Task(id, content, completed) and put it inside the mapping 
        tasks[taskCount] = Task(taskCount, _content, false);

        emit TaskCreated(taskCount, _content, false);


    }

    


}