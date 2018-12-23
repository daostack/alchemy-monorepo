const glob = require('glob')
var fs = require('fs')
const ora = require('ora')

const files = glob.sync('./node_modules/@daostack/arc/build/contracts/*.json', {
  nodir: true
})

const spinner = ora()
spinner.info(`Starts pruning Arc JSON files`)

files.filter(file => {
  const { contractName, abi, bytecode, deployedBytecode } = require(`${file}`)

  spinner.info(`Pruning ${contractName}`)

  fs.writeFileSync(
    file,
    JSON.stringify(
      { contractName, abi, bytecode, deployedBytecode },
      undefined,
      2
    ),
    'utf-8'
  )
})

spinner.succeed(`Finished pruning Arc JSON files`)
