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
  web3.eth.defaultAccount = from;
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
          "name": "_address",
          "type": "address"
        },
        {
          "name": "_age",
          "type": "uint256"
        },
        {
          "name": "_fName",
          "type": "bytes16"
        },
        {
          "name": "_lName",
          "type": "bytes16"
        }
      ],
      "name": "setInstruction",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "age",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "fName",
          "type": "bytes16"
        },
        {
          "indexed": false,
          "name": "lName",
          "type": "bytes16"
        }
      ],
      "name": "instructorInfo",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "countInstructors",
      "outputs": [
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
      "constant": true,
      "inputs": [
        {
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getInstructor",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "bytes16"
        },
        {
          "name": "",
          "type": "bytes16"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getInstructors",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "instructorAccts",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  '0xCf0a3a90f1999c9cF9478fBa73f9017920343Df8'
);

function setInstructor(name, age) {
  $('#instructor').text(`${name} ${age} years old`);
}
const instructorEmitter = Coursetro.events.Instructor({}, (err, data) => {
  if (err) {
    console.log(`event returned error ${err}`);
    return;
  }
  const { name, age } = data.returnValues;
  setInstructor(name, age);
});

$("#button").click(async function () {
  $("#loader").show();
  $('#error').text('');
  try {
    const result = await Coursetro.methods.setInstructor($("#name").val(), Number($("#age").val())).send({ from });
  } catch (e) {
    $('#error').text(`unable to set instructor: ${e.message}`);
  }
});
