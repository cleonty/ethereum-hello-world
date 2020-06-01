if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
  console.log(`using current provider`);
} else {
  console.log(`using newly created provider`);
  web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
}

let from;
web3.eth.getAccounts().then(accounts => {
  from = accounts[0];
  web3.eth.defaultAccount = accounts[0];
  console.log(`from ${from}`);
  Coursetro.methods.getInstructor().call({}, (err, result) => {
    console.log(`instructor result ${JSON.stringify(result)}`);
    const name = result[0];
    const age = result[1];
    setInstructor(name, age);
  })
});

let Coursetro = new web3.eth.Contract(
  [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_fName",
          "type": "string"
        },
        {
          "name": "_age",
          "type": "uint256"
        }
      ],
      "name": "setInstructor",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getInstructor",
      "outputs": [
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "age",
          "type": "uint256"
        }
      ],
      "name": "Instructor",
      "type": "event"
    }
  ],
  '0x91145A726A7cC128aC71633Baf19E979d7e0d66F'
);

function setInstructor(name, age) {
  $('#instructor').text(`${name} ${age} years old`);
}
const instructorEmitter = Coursetro.events.Instructor({}, (err, data) => {
  if (err) {
    console.log(`event returned error ${err}`);
    return;
  }
  const {name, age} = data.returnValues;
  setInstructor(name, age);
});

$("#button").click(function () {
  $("#loader").show();
  Coursetro.methods.setInstructor($("#name").val(), Number($("#age").val())).send({ from }).then(result => {
  });
});
