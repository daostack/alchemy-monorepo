const { migrateWithStats } = require("./util");
const migrateBase = require("./migrate-base");
const migrateDAO = require("./migrate-dao");
const yargs = require("yargs");

async function migrate(web3) {
  const base = await migrateBase(web3);
  await migrateDAO(web3, base);
}

if (require.main == module) {
  const { provider } = yargs.option("provider", {
    alias: "p",
    type: "string",
    describe: "Web3 ethereum provider"
  }).argv;
  if (provider) {
    process.env.npm_package_config_provider = provider;
  }
  migrateWithStats(migrate);
} else {
  module.exports = migrate;
}
