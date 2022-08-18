"use strict";
const Web3Modal = window.Web3Modal.default;
let web3Modal;
let provider;
let selectedAccount;
let isConnected = false;
let isPrivate, isPublic

let web3, contract;

let contractAddress = "0xdD9Cf2c4FCf8B2D683859eefDBb1bc2FBDe292dF";
let abi = [{
        "inputs": [{
            "internalType": "uint256",
            "name": "tokenQuantity",
            "type": "uint256"
        }],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "privateLive",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "tokenQuantity",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "privateMint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "publicLive",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }
]
async function init() {
    const providerOptions = {};
    web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
        disableInjectedProvider: false,
    });
    try {
        if (window.ethereum.selectedAddress !== null) {
            connect();
        }
    } catch (error) {

    }


}
async function fetchAccountData() {
    web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(abi, contractAddress);
    selectedAccount = accounts[0];
}

async function checkSupply() {
    let supply = await contract.methods.totalSupply().call();
    document.getElementById("mintSupply-phone").innerHTML = `${supply} / 7500`
    document.getElementById("mintSupply").innerHTML = `${supply} / 7500`
}

async function connect() {
    if (window.web3 == undefined && window.ethereum == undefined) {
        window
            .open("https://metamask.app.link/dapp/artificialintelligenceclub.io", "_blank")
            .focus();
    }
    provider = await web3Modal.connect();
    await fetchAccountData();

    if (isConnected) {
        return
    }

    if (selectedAccount) {
        isConnected = true;
        document.getElementById("connectButton").classList.add("d-none");
        document.getElementById("mintButton").classList.remove("d-none");


        document.getElementById("connectButton-phone").classList.add("d-none");
        document.getElementById("mintButton-phone").classList.remove("d-none");

        checkSupply()
        setInterval(async () => {
            checkSupply()
        }, 5000)
        toastr.success(`Connected`);
    }
}


async function mint() {
    if (isConnected) {
        let quantity = 1 //parseInt(document.getElementById("mint-quantity").value);
        contract.methods.mint(quantity).send({
            from: selectedAccount,
            value: web3.utils.toWei(`${0.1 * quantity}`, "ether"),
        }).then(state=>{
            toastr.success(`Tx mined successfully`);
        }).catch(state=>{
            toastr.error(`Tx not mined`);
        })

    }
}

window.addEventListener("load", async () => {
    init();
})