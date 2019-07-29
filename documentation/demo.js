/**
 * To run this example, you must
 * 1. git checkout https://github.com/daostack/client
 * 2. npmm install
 * 3. npm run build // build th epackage
 * 3. docker-compose up -d // this will start docker containers with the test services
 * 4. node documentation/demo.js // run this file
 * 5. docker-compose down // stop the docker containers when you are done
 */

async function main() {

  console.log('hello!')

  // mport from the local build of the library (that was created with npm run build)
  // typically, one would use require('@daostack/client')
  const { Arc } = require('../dist/lib/index.js')

  // "Arc" is the main class that handles configuration and connections to various services
  // create an Arc instanc with settings to connect to the local docker images
  const arc = new Arc({
    graphqlHttpProvider: 'http://127.0.0.1:8000/subgraphs/name/daostack',
    graphqlHttpMetaProvider: 'http://127.0.0.1:8000/subgraphs',
    graphqlWsProvider: 'http://127.0.0.1:8001/subgraphs/name/daostack',
    web3Provider: 'ws://127.0.0.1:8545',
    ipfsProvider: '/ip4/127.0.0.1/tcp/5001',
  })
  // we must provice Arc with some contract information.
  // We can use setContractInfos to set them manually, but it is convenient to get this information from the subgraph
  await arc.fetchContractInfos()

  // we get the first returned item from the obervable that returns a list of DAOs
  const daos = await arc.daos().first()

  console.log(`Found ${daos.length} DAOs in ${arc.graphqlHttpProvider}`)

  // given the id of a DAO, we can also create a fresh DAO instance
  const { DAO } = require('../dist/lib/index.js')
  const dao = new DAO(daos[0].id, arc)

  // get the DAO state (again, the "first()" object from the observable)
  const daoState  = await dao.state().first()
  // the state contains information such as the address, name or nativeToken of the DAO
  console.log(`This DAO has name "${daoState.name}" and is deployed on ${daoState.address}`)

  // to create a proposal, we must first find the address of the Scheme to create it in
  const schemes = await dao.schemes({ where: { name: 'ContributionReward'}}).first()

  if (schemes.length === 0) {
    throw Error('Something went wrong - no ContrsbutsonReward scheme was registered with this DAO')
  }
  const schemeState = await schemes[0].state().first()

  console.log(`We'll create a ${schemeState.name} proposal at the scheme at ${schemeState.address}`)

  // first construct a transaction
  const tx = dao.createProposal({
    title: 'Demo Proposal',
    beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
    ethReward: 300 * 10**18,
    nativeTokenReward: 1,
    periodLength: 0,
    periods: 1,
    reputationReward: 10000,
    scheme: schemeState.address
  })

  // now send the transaction to the blockchain - when successful
  const minedTx = await tx.send()
  // the return value of the sending contains a Proposal instance for the newly created proposal
  const proposal = minedTx.result
  console.log(`created a proposal with id ${proposal.id}`)
  console.log(`..... bye!`)
  process.exit(0)
}

main()
  .catch((err) => { console.log(err); process.exit(0)})
