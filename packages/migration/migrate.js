#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const ora = require('ora')
const Web3 = require('web3')
const inquirer = require('inquirer')
const HDWallet = require('hdwallet-accounts')
const moment = require('moment')
const migrateBase = require('./migrate-base')
const migrateDAO = require('./migrate-dao')
const migrateDemoTest = require('./migrate-demo-test')
const updateDAORegistry = require('./helper-scripts/dao-registry')
const allocateReputation = require('./helper-scripts/rep-allocation')
const path = require('path')

async function migrate (opts) {
  const base = await migrateBase(opts)
  const dao = await migrateDAO({ ...opts, previousMigration: { ...opts.previousMigration, ...base } })
  const demo = await migrateDemoTest({ ...opts, previousMigration: { ...opts.previousMigration, ...base } })
  return {
    ...base,
    ...dao,
    ...demo
  }
}

const defaults = {
  arcVersion: require('./package.json').dependencies['@daostack/arc'],
  quiet: false,
  disableconfs: false,
  force: false,
  restart: false,
  optimizedabis: false,
  provider: 'http://localhost:8545',
  // this is the private key used by ganache when running with `--deterministic`
  privateKey: '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
  prevmigration: path.normalize(path.join(__dirname, './migration.json')),
  output: path.normalize(path.join(__dirname, './migration.json')),
  params: JSON.parse(fs.readFileSync(path.join(__dirname, 'migration-params.json'))),
  customAbisLocation: path.normalize(path.join(__dirname, './custom-abis'))
}

/**
 * A wrapper function that performs tasks common to all migration commands.
 */
const wrapCommand = fn => async options => {
  let { arcVersion, quiet, disableconfs, force, restart, optimizedabis, provider, gasPrice, privateKey, mnemonic, prevmigration, output, params, customAbisLocation } = { ...defaults, ...options }
  const emptySpinner = new Proxy({}, { get: () => () => { } }) // spinner that does nothing
  const spinner = quiet ? emptySpinner : ora()

  process.on('unhandledRejection', (reason, promise) => {
    const msg = `Migration failed with error: ` + reason
    spinner.fail(msg)
  })

  const confirm = async (msg, def) => {
    if (force) {
      return true
    } else if (disableconfs) {
      return def === undefined ? true : def
    } else {
      const { confirmation } = await inquirer.prompt([
        { name: 'confirmation', message: msg, type: 'confirm', default: def }
      ])
      return confirmation
    }
  }
  const web3 = new Web3(provider)
  gasPrice = gasPrice || web3.utils.fromWei(await web3.eth.getGasPrice(), 'gwei')
  // set web3 default account
  try {
    const account = web3.eth.accounts.privateKeyToAccount(
      mnemonic ? HDWallet(1, mnemonic).accounts[0].privateKey : privateKey
    )
    web3.eth.accounts.wallet.add(account)
    web3.eth.defaultAccount = account.address
  } catch (e) {
    spinner.fail(`Could not obtain an account for migration. Please specify a valid 'private-key' or 'mnemonic'`)
    console.error(e)
    process.exit(1)
  }

  const logTx = async ({ transactionHash, gasUsed }, msg) => {
    const transaction = await web3.eth.getTransaction(transactionHash)
    if (transaction != null) {
      const gasPrice = transaction.gasPrice
      const txCost = web3.utils.fromWei((gasUsed * gasPrice).toString(), 'ether')
      spinner.info(`${transactionHash} | ${Number(txCost).toFixed(5)} ETH | ${msg}`)
    }
  }

  let network = await web3.eth.net.getNetworkType()
  if (network === 'private') {
    if (await web3.eth.net.getId() === 100) {
      network = 'xdai'
    } else if (await web3.eth.net.getId() === 77) {
      network = 'sokol'
    }
  }
  if (network === 'main') {
    network = 'mainnet'
  }

  const balance = await web3.eth.getBalance(web3.eth.defaultAccount)

  spinner.info(`Network: \t${network}`)
  spinner.info(`Account: \t${web3.eth.defaultAccount}`)
  spinner.info(`Balance: \t${web3.utils.fromWei(balance)}ETH`)
  spinner.info(`Gas price: \t${gasPrice}GWei`)

  // default opts for web3
  const block = await web3.eth.getBlock('latest')
  const opts = {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000,
    gasPrice: gasPrice ? web3.utils.toWei(gasPrice.toString(), 'gwei') : undefined
  }

  // obtain time and balance before command
  const before = {
    time: moment(),
    balance
  }

  // check for an existing migration
  let existingFile
  if (fs.existsSync(prevmigration)) {
    spinner.info(`Found an existing previous migration file (${prevmigration})`)
    existingFile = JSON.parse(fs.readFileSync(prevmigration, 'utf-8'))
  } else {
    existingFile = {}
  }

  let stateFile = path.join(__dirname, 'deployment-state.json')

  let objectExists = obj => {
    return obj ? !(Object.entries(obj).length === 0 && obj.constructor === Object) : false
  }

  // run the actucal command
  const result = await fn({
    arcVersion,
    web3,
    spinner,
    confirm,
    opts,
    migrationParams: { ...params, ...params[network] },
    logTx,
    previousMigration: { ...existingFile[network] },
    customAbisLocation,
    restart,
    optimizedAbis: optimizedabis,
    setState: function setState (state, network) {
      let oldState = {}
      if (fs.existsSync(stateFile)) {
        oldState = JSON.parse(fs.readFileSync(stateFile))
      }
      fs.writeFileSync(stateFile, JSON.stringify({ ...oldState, [network]: state }, undefined, 2), 'utf-8')
    },
    getState: function getState (network) {
      if (fs.existsSync(stateFile)) {
        let state = JSON.parse(fs.readFileSync(stateFile))
        return state[network] ? state[network] : {}
      }
      return {}
    },
    cleanState: function cleanState (network) {
      if (fs.existsSync(stateFile)) {
        try {
          let state = JSON.parse(fs.readFileSync(stateFile))
          state[network] = {}
          if (!objectExists(state.private) &&
          !objectExists(state.xdai) &&
          !objectExists(state.sokol) &&
          !objectExists(state.rinkeby) &&
          !objectExists(state.kovan) &&
          !objectExists(state.mainnet)) {
            fs.unlinkSync(stateFile)
          } else {
            fs.writeFileSync(stateFile, JSON.stringify(state, undefined, 2), 'utf-8')
          }
        } catch (err) {
          console.error(err)
        }
      }
    },
    getArcVersionNumber: function getArcVersionNumber (arcVersion) {
      return Number(arcVersion.slice(-2))
    },
    sendTx: async function sendTx (tx, msg) {
      spinner.start(msg)
      let gas = 0
      let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)
      const blockLimit = await web3.eth.getBlock('latest').gasLimit
      try {
        gas = (await tx.estimateGas())
        if (gas * 1.1 < blockLimit - 100000) {
          gas *= 1.1
        }
      } catch (error) {
        gas = blockLimit - 100000
      }

      let result = tx.send({ gas, nonce })
      let receipt = await new Promise(resolve => result.on('receipt', resolve).on('error', async error => {
        spinner.fail('Transaction failed: ' + error)
        if (await confirm('Would you like to retry sending the transaction?')) {
          resolve('failed')
        } else {
          spinner.fail('DAO Migration has failed.')
        }
      }))

      if (receipt === 'failed') {
        return sendTx(tx)
      }

      result = await result
      return { receipt, result }
    }
  })

  // obtain time and balance after command
  const after = {
    time: moment(),
    balance: await web3.eth.getBalance(web3.eth.defaultAccount)
  }

  spinner.info(
    `Finished in ${moment.duration(after.time.diff(before.time)).humanize()} and costed ${web3.utils.fromWei(
      (before.balance - after.balance).toString()
    )}ETH`
  )

  // write results to file
  const results = { ...existingFile, [network]: { ...existingFile[network], ...result } }

  fs.writeFileSync(output, JSON.stringify(results, undefined, 2), 'utf-8')
  spinner.succeed(`Wrote results to ${output}.`)

  return result
}

function cli () {
  /* eslint no-unused-expressions: "off" */
  yargs
    .option('arc-version', {
      alias: 'a',
      describe: 'specify an Arc version to use for deployment.',
      type: 'string',
      default: defaults.arcVersion
    })
    .option('provider', {
      alias: 'p',
      type: 'string',
      describe: 'web3 provider url',
      default: defaults.provider
    })
    .option('gas-price', {
      alias: 'g',
      describe: 'gas price in GWei. If not specified, will use an automatically suggested price.',
      type: 'number'
    })
    .option('quiet', {
      alias: 'q',
      describe: 'surpress console output',
      type: 'boolean',
      default: defaults.quiet
    })
    .option('disable-confs', {
      alias: 'd',
      describe: 'disable confirmation messages',
      type: 'boolean',
      default: defaults.disableconfs
    })
    .option('force', {
      alias: 'f',
      describe: 'force deploy everything',
      type: 'boolean',
      default: defaults.force
    })
    .option('restart', {
      alias: 't',
      describe: 'delete previous deployment state and starts with clean state',
      type: 'boolean',
      default: defaults.restart
    })
    .option('optimized-abis', {
      alias: 'z',
      describe: 'load abis from the optimized contracts directory',
      type: 'boolean',
      default: defaults.optimizedabis
    })
    .option('prev-migration', {
      alias: 'r',
      type: 'string',
      describe: 'filepath to previous migration results',
      default: defaults.prevmigration
    })
    .option('output', {
      alias: 'o',
      type: 'string',
      describe: 'filepath to output the migration results',
      default: defaults.output
    })
    .option('params', {
      alias: 'i',
      type: 'string',
      describe: 'path to the file containing the migration parameters',
      default: 'migration-params.json',
      coerce: path => JSON.parse(fs.readFileSync(path))
    })
    .option('private-key', {
      alias: 's',
      type: 'string',
      describe: `private key of the account used in migration (cannot be used with the 'mnemonic' option)`,
      default: defaults.privateKey
    })
    .option('mnemonic', {
      alias: 'm',
      type: 'string',
      describe: `mnemonic used to generate the private key of the account used in migration (cannot be used with the 'private-key' option)`
    })
    .option('custom-abis-location', {
      alias: 'c',
      type: 'string',
      describe: 'path to the folder containing the truffle build data for custom schemes',
      default: defaults.customAbisLocation
    })
    .command('$0', 'Migrate base contracts and an example DAO', yargs => yargs, wrapCommand(migrate))
    .command('base', 'Migrate an example DAO', yargs => yargs, wrapCommand(migrateBase))
    .command('dao', 'Migrate base contracts', yargs => yargs, wrapCommand(migrateDAO))
    .command('demo', 'Migrate base contracts', yargs => yargs, wrapCommand(migrateDemoTest))
    .command('update-registry', 'Update DAORegistry DAOs', yargs => yargs, wrapCommand(updateDAORegistry))
    .command('allocate-reputation', 'Allocate reputation in RepAllocation scheme', yargs => yargs, wrapCommand(allocateReputation))
    .showHelpOnFail(false)
    .completion()
    .wrap(120)
    .strict()
    .help().argv
}

if (require.main === module) {
  cli()
} else {
  module.exports = {
    migrate: wrapCommand(migrate),
    migrateBase: wrapCommand(migrateBase),
    migrateDAO: wrapCommand(migrateDAO),
    migrateDemoTest: wrapCommand(migrateDemoTest),
    updateDAORegistry: wrapCommand(updateDAORegistry),
    allocateReputation: wrapCommand(allocateReputation),
    migrateScript: wrapCommand,
    cli
  }
}
