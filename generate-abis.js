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
    const files = fs.readdirSync(base)
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

if (require.main === module) {
  generateAbis([
    '@daostack/infra/build/contracts/ERC827.json',
    '@daostack/arc-hive/build/contracts/DAORegistry.json',
    '@daostack/arc/build/contracts/Controller.json'
  ]).catch(err => {
    console.log(err)
    process.exit(1)
  })
} else {
  module.exports = generateAbis
}
