

(async function () {
  let from;
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      // Acccounts now exposed
    } catch (error) {
      // User denied account access...
    }
  } else if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log(`using current provider`);
  } else {
    console.log(`using newly created provider`);
    web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
  }
  const accounts = await web3.eth.getAccounts();
  console.log(`accounts`, accounts);
  from = accounts[0];
  web3.eth.defaultAccount = from;
  console.log(`from ${from}`);
  const Coursetro = new web3.eth.Contract(
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
    '0x33Ada9a64776EFa9b39B4658a938e76A1E7aC1Df'
  );
  const result = await Coursetro.methods.getInstructor(from).call({});
  console.log(`instructor result ${JSON.stringify(result)}`);
  const age = result[0];
  const fName = result[1];
  const lName = result[2];
  setInstructor(h2a(fName), h2a(lName), age);
  const instructorEmitter = Coursetro.events.instructorInfo({}, (err, data) => {
    if (err) {
      console.log(`event returned error ${err}`);
      return;
    }
    const { fName, lName, age } = data.returnValues;
    setInstructor(h2a(fName), h2a(lName), age);
  });

  $("#button").click(async function () {
    $("#loader").show();
    $('#error').text('');
    try {
      const fName = $("#fName").val();
      const lName = $("#lName").val();
      const age = +($("#age").val());
      console.log(from, age, a2h(fName), a2h(lName));
      const result = await Coursetro.methods.setInstruction(from, age, a2h(fName), a2h(lName)).send({ from });
    } catch (e) {
      $('#error').text(`unable to set instructor: ${e.message}`);
    }
  });
})();



function h2a(hex) {
  return web3.utils.hexToUtf8(hex);
}

function a2h(ascii) {
  return web3.utils.utf8ToHex(ascii);
}

function setInstructor(fName, lName, age) {
  $('#instructor').text(`${fName} ${lName} is ${age} years old`);
}

