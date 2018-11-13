require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const HDWallet = require("hdwallet-accounts");
const Ganache = require("ganache-cli");

const { mnemonic, total_accounts } = process.env;

const provider = Ganache.provider({
  db_path: "./db",
  mnemonic,
  total_accounts
});
const web3 = new Web3(provider);

const hdwallet = HDWallet(total_accounts, mnemonic);
hdwallet.accounts.forEach(({ privateKey }) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
});
web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address;

async function migrateBase() {
  const UController = require("@daostack/arc/build/contracts/UController.json");

  const opts = {
    from: web3.eth.defaultAccount,
    gas: (await web3.eth.getBlock("latest")).gasLimit - 100000
  };

  const UC = new web3.eth.Contract(UController.abi, undefined, opts);
  const uc = await UC.deploy({
    data: UController.bytecode,
    arguments: []
  }).send();

  return {
    UController: uc.options.address
  };
}

async function migrateDAO() {}

async function build() {
  const addresses = await migrateBase();
  fs.writeFileSync(
    "addresses.json",
    JSON.stringify(addresses, undefined, 2),
    "utf-8"
  );
}

build();
