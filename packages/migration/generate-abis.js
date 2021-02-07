const fs = require('fs')
const path = require('path')

/**
 * Fetch all abis from @daostack/arc into the `abis` folder.
 */
async function generateAbis (bases) {
  for (let i in bases) {
    let arcVersion = require('./package.json').dependencies['@daostack/arc']
    const base = require('path').dirname(require.resolve(bases[i]))
    if (!fs.existsSync('./contracts/' + arcVersion)) {
      fs.mkdirSync('./contracts/' + arcVersion, { recursive: true })
    }
    const files = fs.readdirSync(base).filter(file => (file.indexOf('.json') >= 0))
    files.forEach(file => {
      const contracts = JSON.parse(fs.readFileSync(path.join(base, file), 'utf-8'))
      fs.writeFileSync(
        path.join('./contracts/' + arcVersion, file),
        JSON.stringify(contracts, undefined, 2),
        'utf-8'
      )
    })
  }
}

/**
 * Extract abis from Arc contracts folder into truffle compatible format
 */
async function extractAbis (base) {
  var files = fs.readdirSync(base)
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(base, files[i])
    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      extractAbis(filename) // recurse
    } else if (filename.indexOf('.json') >= 0 && filename.indexOf('.dbg') === -1) {
      console.log('-- found: ', filename)
      const contract = JSON.parse(fs.readFileSync(filename, 'utf-8'))
      fs.writeFileSync(
        path.join('./node_modules/@daostack/arc/build/contracts', files[i]),
        JSON.stringify(contract, undefined, 2),
        'utf-8'
      )
    };
  };
}

if (require.main === module) {
  if (fs.existsSync('./node_modules/@daostack/arc/build/contracts/contracts')) {
    extractAbis('./node_modules/@daostack/arc/build/contracts/contracts').catch(err => {
      console.log(err)
      process.exit(1)
    })
  }

  generateAbis([
    '@daostack/infra/build/contracts/ERC827.json',
    '@daostack/arc-hive/build/contracts/DAORegistry.json',
    '@daostack/arc/build/contracts/Controller.json'
  ]).catch(err => {
    console.log(err)
    process.exit(1)
  })
} else {
  module.exports = {
    generateAbis,
    extractAbis
  }
}
