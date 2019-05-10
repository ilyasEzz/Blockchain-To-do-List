const loader = document.getElementById("loader");
const account = document.getElementById("account");

App = {
  loading: true,
  contracts: {},

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },


  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

// Getting the current blockchain account used by MetaMASK
  loadAccount: async () => {
    App.account = web3.eth.accounts[0];
  },


  // Loading the Smart contact from the blockchain
  loadContract: async () => {
    // TodoList.json is in buid/contracts
    const todoList = await $.getJSON("TodoList.json");

  // Truffle Contract is a Javascript representation of the Smart Contract, on wich we can apply functions 
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);

    // Getting a deployed copy of the Smart Contract with values from the blockchain
    App.todoList =  await App.contracts.TodoList.deployed();
  },


  render: async () =>{
    // Show the Account
    account.textContent = App.account;
    loader.style.display = "none";

    App.renderTasks();
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];
      console.log(taskContent);

     
      

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      // .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  

  },

  createTask: async () =>{
    const content = document.getElementById("newTask").value;
    await App.todoList.createTask(content);
    window.location.reload;
  }

  /*setLoading: (bool) =>{
    App.loading = bool;
    

    if(bool){
      loader.style.display = "block";
      content.style.display = "none";
    }
    else{
      loader.style.display = "none";
      content.style.display = "block";
    }
  }*/

  


};


window.addEventListener('load', App.load())