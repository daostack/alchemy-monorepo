const path = require('path');

async function main () {
  const subgraphRepo = path.resolve('./node_modules/@daostack/subgraph');
  console.log(await require(`${subgraphRepo}/ops/setup-env`)());
}

main().catch((err) => { console.log(err); process.exit(1); })
