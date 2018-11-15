require("dotenv").config({ path: __dirname });
const Ganache = require("ganache-cli");
const path = require("path");
const config = require("./package.json").config;

const { mnemonic, total_accounts } = config;

const defaults = {
  db_path: path.normalize(path.join(__dirname, "./db")),
  mnemonic,
  total_accounts
};

module.exports = {
  server: opts => Ganache.server({ ...defaults, ...opts }),
  provider: opts => Ganache.provider({ ...defaults, ...opts })
};
