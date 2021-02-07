const Ganache = require('ganache-cli')
const path = require('path')

const defaults = {
  db_path: path.normalize(path.join(__dirname, './db')),
  seed: 'TestRPC is awesome!' // default ganache-cli mnemonic (https://github.com/trufflesuite/ganache-cli/blob/develop/cli.js#L45)
}

const migration = require(path.normalize(path.join(__dirname, './migration.json')))
module.exports = {
  Ganache: {
    server: opts => Ganache.server({ ...defaults, ...opts }),
    provider: opts => Ganache.provider({ ...defaults, ...opts })
  },
  migration: network => {
    if (network in migration) {
      return migration[network]
    } else {
      throw new Error(`Could not retrieve migration result for network ${network}`)
    }
  },
  ...require('./migrate')
}
