import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Proposal, ProposalOutcome, ProposalStage } from '../src/proposal'
import { createAProposal, getArc, getTestDAO, mineANewBlock, waitUntilTrue } from './utils'

describe('Proposal execute()', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = getArc()
  })

  it('runs correctly through the stages', async () => {

    const dao = await getTestDAO()
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const accounts = arc.web3.eth.accounts.wallet
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
    const response = await dao.createProposal(options).pipe(take(2)).toPromise()
    const proposalId = (response.result as any).id
    // wait for the proposal to be indexed before subscribing to the state
    // TODO: change this once  https://github.com/daostack/client/issues/78 is resolved
    const proposalIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      const proposals = await Proposal.search({id: proposalId}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return proposals.length > 0
    }
    await waitUntilTrue(proposalIsIndexed)
    const proposal = new Proposal(proposalId, dao.address, arc)

    let proposalState
    function getCurrentState(propId: string) {
        const prop = new  Proposal(propId, dao.address, arc)
        return prop.state.pipe(first()).toPromise()
    }

    // check the state right after creation
    proposalState = await getCurrentState(proposalId)
    expect(proposalState.stage).toEqual(ProposalStage.Queued)

    // calling execute in this stage has no effect on the stage
    await proposal.execute().pipe(take(2)).toPromise()
    proposalState = await getCurrentState(proposalId)
    expect(proposalState.stage).toEqual(ProposalStage.Queued)

    await proposal.vote(ProposalOutcome.Pass).pipe(take(2)).toPromise()
    // let's vote for the proposal with accounts[1]
    // proposal.context.web3.eth.accounts.defaultAccount = accounts[1]
    // await proposal.vote(ProposalOutcome.Pass).pipe(take(2)).toPromise()

    const daoState = await dao.state.pipe(first()).toPromise()
    const daoReputation =  daoState.reputation
    console.log(await daoReputation.reputationOf(accounts[0].address).pipe(first()).toPromise())
    console.log(await daoReputation.reputationOf(accounts[1].address).pipe(first()).toPromise())

    // await waitUntilTrue(async () => {
    //   proposalState = await getCurrentState(proposalId)
    //   console.log(proposalState)
    //   return proposalState.votesFor > 0
    //
    // })
    // expect(proposalState.stage).toEqual(ProposalStage.Queued)
    // expect(proposalState.votesFor).toEqual(123)
    // expect(proposalState.votesAgainst).toEqual(0)
    //
    // proposal.context.web3.eth.accounts.defaultAccount = accounts[0]

    return
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
    // console.log(`Mine some new lbocks..`)
    // for (let i = 0; i < 10; i++ ) {
    //   console.log(`${i}`)
    //   await mineANewBlock()
    // }
    //
    // let proposals: Proposal[] = []
    // console.log(`Wait for proposal to be indexed`)
    // await waitUntilTrue(proposalIsIndexed)
    //
    // // TODO: if we use the existing "proposal" and get its state, I get an "proposal
    // // with this id does not exist". How is that possible?
    // const proposal2 = proposals[0]
    // console.log(`Found ${proposal2.id} in subgraph!`)
    // const proposalState = await proposal2.state.pipe(first()).toPromise()
    // console.log(proposalState)
    // console.log('000000000000=----------------------')
    //
    // let xxx = await proposal.execute().pipe(take(2)).toPromise()
    // console.log(xxx)
    //
    // // check the state of the proposal on the blockchain
    // const genesisProtocol = proposal.votingMachine()
    // xxx = await genesisProtocol.methods.proposals(proposal.id).call()
    //
    // expect(xxx).toEqual(1234)
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
    const dao = await getTestDAO()
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
