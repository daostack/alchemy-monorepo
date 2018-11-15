const { getOpts, migrateWithStats } = require("./util");
const ora = require("ora");
const fs = require("fs");
const Confirm = require("prompt-confirm");

async function migrateBase(web3) {
  const opts = await getOpts(web3);

  const confirmation = await new Confirm(
    "About to migrate base contracts. Continue?"
  ).run();
  if (!confirmation) {
    throw new Error("Canceled by the user");
  }

  const spinner = ora();
  spinner.start("Migrating base contracts...");

  async function deploy(Contract, ...args) {
    spinner.start(`Migrating ${Contract.contractName}...`);
    const C = new web3.eth.Contract(Contract.abi, undefined, opts);
    const deploy = C.deploy({
      data: Contract.bytecode,
      arguments: args
    }).send();
    const tx = await new Promise(res => deploy.on("transactionHash", res));
    const c = await deploy;
    spinner.succeed(
      `txHash: ${tx} | address: ${c.options.address} | ${Contract.contractName}`
    );
    return c.options.address;
  }

  const DAOToken = await deploy(
    require("@daostack/arc/build/contracts/DAOToken.json"),
    "DAOstack",
    "GEN",
    web3.utils.toWei("100000000")
  );
  const ControllerCreator = await deploy(
    require("@daostack/arc/build/contracts/ControllerCreator.json")
  );
  const DaoCreator = await deploy(
    require("@daostack/arc/build/contracts/DaoCreator.json"),
    ControllerCreator
  );
  const UController = await deploy(
    require("@daostack/arc/build/contracts/UController.json")
  );
  const GenesisProtocol = await deploy(
    require("@daostack/arc/build/contracts/GenesisProtocol.json"),
    DAOToken
  );
  const SchemeRegistrar = await deploy(
    require("@daostack/arc/build/contracts/SchemeRegistrar.json")
  );
  const UpgradeScheme = await deploy(
    require("@daostack/arc/build/contracts/UpgradeScheme.json")
  );
  const GlobalConstraintRegistrar = await deploy(
    require("@daostack/arc/build/contracts/GlobalConstraintRegistrar.json")
  );
  const ContributionReward = await deploy(
    require("@daostack/arc/build/contracts/ContributionReward.json")
  );
  const AbsoluteVote = await deploy(
    require("@daostack/arc/build/contracts/AbsoluteVote.json")
  );
  const QuorumVote = await deploy(
    require("@daostack/arc/build/contracts/QuorumVote.json")
  );
  const SimpleICO = await deploy(
    require("@daostack/arc/build/contracts/SimpleICO.json")
  );
  const TokenCapGC = await deploy(
    require("@daostack/arc/build/contracts/TokenCapGC.json")
  );
  const VestingScheme = await deploy(
    require("@daostack/arc/build/contracts/VestingScheme.json")
  );
  const VoteInOrganizationScheme = await deploy(
    require("@daostack/arc/build/contracts/VoteInOrganizationScheme.json")
  );
  const OrganizationRegister = await deploy(
    require("@daostack/arc/build/contracts/OrganizationRegister.json")
  );

  const addresses = {
    DAOToken,
    DaoCreator,
    UController,
    GenesisProtocol,
    SchemeRegistrar,
    UpgradeScheme,
    GlobalConstraintRegistrar,
    ContributionReward,
    AbsoluteVote,
    QuorumVote,
    SimpleICO,
    TokenCapGC,
    VestingScheme,
    VoteInOrganizationScheme,
    OrganizationRegister
  };

  fs.writeFileSync(
    "./base.json",
    JSON.stringify(addresses, undefined, 2),
    "utf-8"
  );
  spinner.succeed(
    `Wrote result to 'base.json': ${JSON.stringify(addresses, undefined, 2)}`
  );

  return addresses;
}

if (require.main == module) {
  migrateWithStats(migrateBase);
} else {
  module.exports = migrateBase;
}
