import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { Proposal } from '../src/proposal'
import { createAProposal, getArc, mineANewBlock, waitUntilTrue } from './utils'

describe('Proposal execute()', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = getArc()
  })

  it('moves to PreBoosted stage', async () => {

  })
  it('works ', async () => {
    const dao = new DAO(arc.contractAddresses.dao.Avatar, arc)
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const ethReward = 300
    const prevEthBalance = await arc.web3.eth.getBalance(beneficiary)
  //
// import { getContractAddresses, getOptions, getWeb3, sendQuery } from './util';
//
// const AbsoluteVote = require('@daostack/arc/build/contracts/AbsoluteVote.json');
// const Avatar = require('@daostack/arc/build/contracts/Avatar.json');
// const ContributionReward = require('@daostack/arc/build/contracts/ContributionReward.json');
// const DAOToken = require('@daostack/arc/build/contracts/DAOToken.json');
// const Reputation = require('@daostack/arc/build/contracts/Reputation.json');
// const UController = require('@daostack/arc/build/contracts/UController.json');

    const accounts = arc.web3.eth.accounts.wallet
//
//         // START long setup ...
//         const externalToken = await new web3.eth.Contract(DAOToken.abi, undefined, opts)
//             .deploy({ data: DAOToken.bytecode, arguments: ['Test Token', 'TST', '10000000000'] })
//             .send();
//         await externalToken.methods.mint(accounts[0].address, '100000').send();
//
//         const nativeToken = await new web3.eth.Contract(DAOToken.abi, undefined, opts)
//             .deploy({ data: DAOToken.bytecode, arguments: ['Test Token', 'TST', '10000000000'] })
//             .send();
//
//         const reputation = await new web3.eth.Contract(Reputation.abi, undefined, opts)
//             .deploy({ data: Reputation.bytecode, arguments: [] })
//             .send();
    const reputation = arc.getContract('Reputation')

    // get total supply
    const reputationTotalSupply = await reputation.methods.totalSupply().call()
    console.log(`reputationTotalSupply ${reputationTotalSupply}`)
    console.log(reputationTotalSupply)
    let balance = await reputation.methods.balanceOf(accounts[1].address).call()
    console.log(balance)
    console.log(`Balance of ${accounts[1].address} is ${balance}`)
    if (balance / reputationTotalSupply < .5) {
      const reputationToMint = Math.ceil(reputationTotalSupply / 2 - balance)
      console.log( `Minting ${reputationToMint} rep`)
      await reputation.methods.mint(accounts[1].address, reputationToMint).send() // to be able to pass a vote

    }

    balance = await reputation.methods.balanceOf(accounts[1].address).call()
    console.log(balance)
    console.log(`Balance of ${accounts[1].address} is ${balance}`)
//
//         const avatar = await new web3.eth.Contract(Avatar.abi, undefined, opts)
//             .deploy({ arguments: ['Test', nativeToken.options.address, reputation.options.address],
//                       data: Avatar.bytecode,
//                     })
//             .send();
//         await externalToken.methods.transfer(avatar.options.address, '100000').send();
//
//         const controller = await new web3.eth.Contract(UController.abi, undefined, opts)
//             .deploy({ data: UController.bytecode, arguments: [] })
//             .send();
//
//         const absVote = await new web3.eth.Contract(AbsoluteVote.abi, undefined, opts)
//             .deploy({ data: AbsoluteVote.bytecode, arguments: [] })
//             .send();
//
//         const setParams = absVote.methods.setParameters(20, 0);
//         const absVoteParamsHash = await setParams.call();
//         await setParams.send();
//         const crSetParams = contributionReward.methods.setParameters(0, absVoteParamsHash, absVote.options.address);
//         const paramsHash = await crSetParams.call();
//         await crSetParams.send();
//         await reputation.methods.transferOwnership(controller.options.address).send();
//         await nativeToken.methods.transferOwnership(controller.options.address).send();
//         await avatar.methods.transferOwnership(controller.options.address).send();
//         await controller.methods.newOrganization(avatar.options.address).send();
//         await controller.methods.registerScheme(
//             contributionReward.options.address,
//             paramsHash,
//             '0x0000001F', // full permissions,
//             avatar.options.address,
//         ).send();
//         // END setup
//
//         const descHash = '0x0000000000000000000000000000000000000000000000000000000000000123';
    // const rewards = {
    //         eth: 4,
    //         externalToken: 3,
    //         nativeToken: 2,
    //         periodLength: 13,
    //         periods: 5,
    //         rep: 1
    //     }
//         const propose = contributionReward.methods.proposeContributionReward(
//             avatar.options.address,
//             descHash,
//             rewards.rep,
//             [
//                 rewards.nativeToken,
//                 rewards.eth,
//                 rewards.externalToken,
//                 rewards.periodLength,
//                 rewards.periods,
//             ],
//             externalToken.options.address,
//             accounts[1].address,
//         );
//         const proposalId = await propose.call();
//         const { transactionHash: proposaTxHash } = await propose.send();
//
    const options = {
      beneficiary,
      ethReward: 4,
      externalTokenAddress: undefined,
      externalTokenReward: 3,
      nativeTokenReward: 2,
      periodLength: 12,
      periods: 5,
      reputationReward: 1,
      type: 'ContributionReward'
    }

    console.log('create a proposal')
    const response = await dao.createProposal(options).pipe(take(2)).toPromise()
    const proposal = response.result as Proposal
    console.log(`created proposal with id ${proposal.id}`)

    //         // pass the proposal
    //         const { transactionHash: executeTxHash, blockNumber } = await absVote.methods.vote(
    //                                                                 proposalId,
    //                                                                 1,
    //                                                                 0,
    //                                                                 accounts[0].address /* unused by the contract */)
    //                                                                 .send({ from: accounts[1].address });
    //         const block = await web3.eth.getBlock(blockNumber);
    proposal.context.web3.eth.accounts.defaultAccount = accounts[1]
    console.log(`Voting for the proposal`)
    await proposal.vote(1 /* YES */).pipe(take(2)).toPromise()
    console.log(`Voted for the proposal`)
    proposal.context.web3.eth.accounts.defaultAccount = accounts[0]
    //
    //         // wait 2 periods
    // await new Promise((res) => setTimeout(res, options.periodLength * 2 * 1000))

    //         const { transactionHash: redeemReputationTxHash } = await contributionReward
    //                                                                   .methods
    //                                                                   .redeemReputation(proposalId,
    //                                                                                     avatar.options.address)
    //                                                                                     .send();
    //
    //
    //         const { transactionHash: redeemNativeTokenTxHash } = await contributionReward
    //                                                                    .methods
    //                                                                    .redeemNativeToken(proposalId,
    //                                                                                       avatar.options.address)
    //                                                                    .send();
    //
    //
    //         const { transactionHash: redeemExternalTokenTxHash } = await contributionReward
    //                                                                      .methods.
    //                                                                      redeemExternalToken(proposalId,
    //                                                                      avatar.options.address)
    //                                                                      .send();
    //
    //
    //         await web3.eth.sendTransaction({ from: accounts[0].address,
    //                                          to: avatar.options.address,
    //                                          value: web3.utils.toWei('10', 'ether'),
    //                                          data: '0xABCD', // data field is needed here due to bug in ganache
    //                                          gas: 50000});
    //
    //         const { transactionHash: redeemEtherTxHash } = await contributionReward
    //                                                              .methods
    //                                                              .redeemEther(proposalId,
    //                                                               avatar.options.address)
    //                                                               .send({gas: 1000000});
    //
    //         const receipt = await web3.eth.getTransactionReceipt(redeemEtherTxHash);
    //
    //         let amountRedeemed = 0;
    //         await contributionReward.getPastEvents('RedeemEther', {
    //               fromBlock: receipt.blockNumber,
    //               toBlock: 'latest',
    //           })
    //           .then(function(events) {
    //               amountRedeemed = events[0].returnValues._amount;
    //           });
    //
    console.log(`Mine some new lbocks..`)
    for (let i = 0; i < 10; i++ ) {
      console.log(`${i}`)
      await mineANewBlock()
    }

    let proposals: Proposal[] = []
    console.log(`Wait for proposal to be indexed`)
    const proposalIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      proposals = await Proposal.search({id: proposal.id}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return proposals.length > 0
    }
    await waitUntilTrue(proposalIsIndexed)

    // TODO: if we use the existing "proposal" and get its state, I get an "proposal
    // with this id does not exist". How is that possible?
    const proposal2 = proposals[0]
    console.log(`Found ${proposal2.id} in subgraph!`)
    const proposalState = await proposal2.state.pipe(first()).toPromise()
    console.log(proposalState)
    console.log('000000000000=----------------------')

    let xxx = await proposal.execute().pipe(take(2)).toPromise()
    console.log(xxx)

    // check the state of the proposal on the blockchain
    const genesisProtocol = proposal.votingMachine()
    xxx = await genesisProtocol.methods.proposals(proposal.id).call()

    expect(xxx).toEqual(1234)
    // expect(proposalState).toMatchObject({
    //   beneficiary: options.beneficiary,
    //   ethReward: options.ethReward,
    //   executedAt: null,
    //   externalTokenReward: 0,
    //   proposer: dao.context.web3.eth.defaultAccount.toLowerCase(),
    //   quietEndingPeriodBeganAt: null,
    //   reputationReward: 0,
    //   resolvedAt: null,
    //   stakesAgainst: 0,
    //   stakesFor: 0
    // })

//     const genesisProtocol = arc.getContract('GenesisProtocol')
//     const stakingToken =  arc.getContract('DAOToken')
//
//     await stakingToken.methods
//       .approve(genesisProtocol.options.address, '100')
//       .send()
//
//     await proposal.stake(1 /* YES */, 20).pipe(take(2)).toPromise()
// //   // vote for it to pass
// //
// //
// //   // wait for proposal it pass
// //   txs.push(await genesisProtocol.methods.execute(proposalId).send());
//     const state = await proposal.execute().pipe(take(2)).toPromise()
//     expect(state.result).toEqual({x: 'y'})
// //
// //   txs.push(
// //     await genesisProtocol.methods
// //       .redeem(proposalId, accounts[0].address)
// //       .send(),
// //   );
//
//     const newEthBalance = await arc.web3.eth.getBalance(beneficiary)
//     expect(newEthBalance - prevEthBalance).toEqual(ethReward)
  }, 100000)

  it.skip('throws a meaningful error if the proposal does not exist', async () => {
    const dao = new DAO(arc.contractAddresses.dao.Avatar, arc)
    // a non-existing proposal
    const proposal = new Proposal(
      '0x1aec6c8a3776b1eb867c68bccc2bf8b1178c47d7b6a5387cf958c7952da267c2', dao.address, arc
    )
    await expect(proposal.execute().pipe(take(2)).toPromise()).rejects.toThrow(
      /unknown proposal/i
    )
  })

  it.skip('throws a meaningful error if the proposal cannot be executed', async () => {
    const proposal = await createAProposal()
    await expect(proposal.execute().pipe(take(2)).toPromise()).rejects.toThrow(
      /proposal execution failed/i
    )
  })
})
