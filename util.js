// disable stupid warning
require("events").EventEmitter.prototype._maxListeners = Infinity;
const Web3 = require("web3");
const HDWallet = require("hdwallet-accounts");
const ora = require("ora");
const moment = require("moment");
const ethPrice = require("eth-price");

async function getWeb3() {
  const mnemonic = process.env.npm_package_config_mnemonic;
  const total_accounts = process.env.npm_package_config_total_accounts;
  const provider = process.env.npm_package_config_provider;
  const web3 = new Web3(provider);

  const hdwallet = HDWallet(total_accounts, mnemonic);
  hdwallet.accounts.forEach(({ privateKey }) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
  });
  web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address;

  const network = await web3.eth.net.getNetworkType();
  const balance = await web3.eth.getBalance(web3.eth.defaultAccount);
  const spinner = ora();
  spinner.info(
    `Using network '${network}', ${total_accounts} unlocked accounts`
  );
  spinner.info(
    `Using account '${web3.eth.defaultAccount}' with ${web3.utils.fromWei(
      balance
    )} ETH`
  );

  return web3;
}

function getMigrationParams(web3) {
  const params = require("./params.json");
  params.ContributionReward.orgNativeTokenFee = web3.utils.toWei(
    params.ContributionReward.orgNativeTokenFee.toString()
  );
  params.GenesisProtocol.daoBountyLimit = web3.utils.toWei(
    params.GenesisProtocol.daoBountyLimit.toString()
  );
  params.GenesisProtocol.minimumStakingFee = web3.utils.toWei(
    params.GenesisProtocol.minimumStakingFee.toString()
  );
  params.GenesisProtocol.thresholdConstA = web3.utils.toWei(
    params.GenesisProtocol.thresholdConstA.toString()
  );
  params.GenesisProtocol.voteOnBehalf = web3.utils.padLeft(
    web3.utils.toHex(params.GenesisProtocol.voteOnBehalf.toString()),
    40
  );

  return params;
}

async function getOpts(web3) {
  const gasPriceGWei = process.env.npm_package_config_gasPriceGWei;
  const block = await web3.eth.getBlock("latest");
  return {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000,
    gasPrice: web3.utils.toWei(gasPriceGWei, "gwei")
  };
}

async function migrateWithStats(migration, ...args) {
  const spinner = ora();
  try {
    const web3 = await getWeb3();
    const before = {
      balance: await web3.eth.getBalance(web3.eth.defaultAccount),
      time: moment()
    };
    await migration(web3, ...args);
    const after = {
      balance: await web3.eth.getBalance(web3.eth.defaultAccount),
      time: moment()
    };
    spinner.info(
      `Migration ran in ${moment
        .duration(after.time.diff(before.time))
        .humanize()} and costed ${web3.utils.fromWei(
        (before.balance - after.balance).toString()
      )} ETH ~ ${(await ethPrice("usd"))[0]}`
    );
  } catch (e) {
    spinner.fail(e.message);
  }
}

module.exports = {
  getWeb3,
  getMigrationParams,
  getOpts,
  migrateWithStats
};
