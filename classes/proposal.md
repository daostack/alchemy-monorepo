[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [Proposal](proposal.md)

# Class: Proposal

## Hierarchy

* **Proposal**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IProposalState](../interfaces/iproposalstate.md)›

## Index

### Constructors

* [constructor](proposal.md#constructor)

### Properties

* [context](proposal.md#context)
* [id](proposal.md#id)
* [staticState](proposal.md#staticstate)

### Methods

* [claimRewards](proposal.md#claimrewards)
* [execute](proposal.md#execute)
* [executeBoosted](proposal.md#executeboosted)
* [executeCalls](proposal.md#executecalls)
* [fetchStaticState](proposal.md#fetchstaticstate)
* [redeemerContract](proposal.md#redeemercontract)
* [rewards](proposal.md#rewards)
* [scheme](proposal.md#scheme)
* [setStaticState](proposal.md#setstaticstate)
* [stake](proposal.md#stake)
* [stakes](proposal.md#stakes)
* [stakingToken](proposal.md#stakingtoken)
* [state](proposal.md#state)
* [vote](proposal.md#vote)
* [votes](proposal.md#votes)
* [votingMachine](proposal.md#votingmachine)
* [search](proposal.md#static-search)

### Object literals

* [fragments](proposal.md#static-fragments)

## Constructors

###  constructor

\+ **new Proposal**(`idOrOpts`: string | [IProposalStaticState](../interfaces/iproposalstaticstate.md), `context`: [Arc](arc.md)): *[Proposal](proposal.md)*

*Defined in [src/proposal.ts:350](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L350)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IProposalStaticState](../interfaces/iproposalstaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Proposal](proposal.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/proposal.ts:348](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L348)*

___

###  id

• **id**: *string*

*Defined in [src/proposal.ts:349](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L349)*

___

###  staticState

• **staticState**: *[IProposalStaticState](../interfaces/iproposalstaticstate.md) | undefined*

*Defined in [src/proposal.ts:350](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L350)*

## Methods

###  claimRewards

▸ **claimRewards**(`beneficiary?`: [Address](../globals.md#address)): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [src/proposal.ts:858](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L858)*

[claimRewards description] Execute the proposal and distribute the rewards
to the beneficiary.
This uses the Redeemer.sol helper contract

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`beneficiary?` | [Address](../globals.md#address) | Addresss of the beneficiary, optional,    if undefined will only redeem the ContributionReward rewards |

**Returns:** *[Operation](../globals.md#operation)‹boolean›*

an Operation

___

###  execute

▸ **execute**(): *[Operation](../globals.md#operation)‹any›*

*Defined in [src/proposal.ts:921](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L921)*

calll the 'execute()' function on the votingMachine.
the main purpose of this function is to set the stage of the proposals
this call may (or may not) "execute" the proposal itself (i.e. do what the proposal proposes)

**Returns:** *[Operation](../globals.md#operation)‹any›*

an Operation that, when sucessful, will contain the receipt of the transaction

___

###  executeBoosted

▸ **executeBoosted**(): *[Operation](../globals.md#operation)‹any›*

*Defined in [src/proposal.ts:952](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L952)*

**Returns:** *[Operation](../globals.md#operation)‹any›*

___

###  executeCalls

▸ **executeCalls**(): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [src/proposal.ts:904](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L904)*

[executeCalls description] execute the actual proposals call of a GenericScheme or
GenericSchemeMultiCall

**Returns:** *[Operation](../globals.md#operation)‹boolean›*

an Operation

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IProposalStaticState](../interfaces/iproposalstaticstate.md)›*

*Defined in [src/proposal.ts:368](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L368)*

**Returns:** *Promise‹[IProposalStaticState](../interfaces/iproposalstaticstate.md)›*

___

###  redeemerContract

▸ **redeemerContract**(): *any*

*Defined in [src/proposal.ts:671](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L671)*

[redeemerContract description]

**Returns:** *any*

a web3 Contract instance

___

###  rewards

▸ **rewards**(`options`: [IRewardQueryOptions](../interfaces/irewardqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reward](reward.md)[]›*

*Defined in [src/proposal.ts:841](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L841)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IRewardQueryOptions](../interfaces/irewardqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Reward](reward.md)[]›*

___

###  scheme

▸ **scheme**(): *Promise‹any›*

*Defined in [src/proposal.ts:654](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L654)*

**Returns:** *Promise‹any›*

the scheme Contract

___

###  setStaticState

▸ **setStaticState**(`opts`: [IProposalStaticState](../interfaces/iproposalstaticstate.md)): *void*

*Defined in [src/proposal.ts:364](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L364)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IProposalStaticState](../interfaces/iproposalstaticstate.md) |

**Returns:** *void*

___

###  stake

▸ **stake**(`outcome`: [IProposalOutcome](../enums/iproposaloutcome.md), `amount`: BN): *[Operation](../globals.md#operation)‹[Stake](stake.md)›*

*Defined in [src/proposal.ts:767](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L767)*

Stake on this proposal

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`outcome` | [IProposalOutcome](../enums/iproposaloutcome.md) | the outcome that is staked on, of type IProposalOutcome |
`amount` | BN | the amount, in GEN, to stake |

**Returns:** *[Operation](../globals.md#operation)‹[Stake](stake.md)›*

An observable that can be sent, or subscribed to

___

###  stakes

▸ **stakes**(`options`: [IStakeQueryOptions](../interfaces/istakequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Stake](stake.md)[]›*

*Defined in [src/proposal.ts:755](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L755)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IStakeQueryOptions](../interfaces/istakequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Stake](stake.md)[]›*

___

###  stakingToken

▸ **stakingToken**(): *[Token](token.md)‹›*

*Defined in [src/proposal.ts:751](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L751)*

**Returns:** *[Token](token.md)‹›*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IProposalState](../interfaces/iproposalstate.md)›*

*Defined in [src/proposal.ts:390](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L390)*

`state` is an observable of the proposal state

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IProposalState](../interfaces/iproposalstate.md)›*

___

###  vote

▸ **vote**(`outcome`: [IProposalOutcome](../enums/iproposaloutcome.md), `amount`: number): *[Operation](../globals.md#operation)‹[Vote](vote.md) | null›*

*Defined in [src/proposal.ts:699](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L699)*

Vote for this proposal

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`outcome` | [IProposalOutcome](../enums/iproposaloutcome.md) | - | one of IProposalOutcome.Pass (0) or IProposalOutcome.FAIL (1) |
`amount` | number | 0 | the amount of reputation to vote with. Defaults to 0 - in that case,  all the sender's rep will be used |

**Returns:** *[Operation](../globals.md#operation)‹[Vote](vote.md) | null›*

an observable Operation<Vote>

___

###  votes

▸ **votes**(`options`: [IVoteQueryOptions](../interfaces/ivotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Vote](vote.md)[]›*

*Defined in [src/proposal.ts:686](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L686)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Vote](vote.md)[]›*

___

###  votingMachine

▸ **votingMachine**(): *Promise‹any›*

*Defined in [src/proposal.ts:663](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L663)*

[votingMachine description]

**Returns:** *Promise‹any›*

a web3 Contract instance

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Defined in [src/proposal.ts:259](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L259)*

Search for proposals

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | An instance of Arc |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} | Search options, must implemeent IProposalQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

An observable of lists of results

For example:
   Proposal.search({ stage: IProposalStage.Queued})

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Defined in [src/proposal.ts:117](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L117)*

###  ProposalFields

• **ProposalFields**: *DocumentNode* =  gql`fragment ProposalFields on Proposal {
      id
      accountsWithUnclaimedRewards
      boostedAt
      closingAt
      confidenceThreshold
      competition {
        id
        admin
        endTime
        contract
        suggestionsEndTime
        createdAt
        numberOfWinningSuggestions
        numberOfVotesPerVoters
        numberOfWinners
        rewardSplit
        snapshotBlock
        startTime
        totalSuggestions
        totalVotes
        votingStartTime

      }
      contributionReward {
        id
        beneficiary
        ethReward
        ethRewardLeft
        externalToken
        externalTokenReward
        externalTokenRewardLeft
        nativeTokenReward
        nativeTokenRewardLeft
        periods
        periodLength
        reputationReward
        reputationChangeLeft
        alreadyRedeemedReputationPeriods
        alreadyRedeemedExternalTokenPeriods
        alreadyRedeemedNativeTokenPeriods
        alreadyRedeemedEthPeriods
      }
      createdAt
      dao {
        id
        schemes {
          id
          address
        }
      }
      description
      descriptionHash
      executedAt
      executionState
      expiresInQueueAt
      genericScheme {
        id
        contractToCall
        callData
        executed
        returnValue
        value
      }
      genericSchemeMultiCall {
        id
        contractsToCall
        callsData
        executed
        returnValues
        values
      }
      genesisProtocolParams {
        id
        activationTime
        boostedVotePeriodLimit
        daoBountyConst
        limitExponentValue
        minimumDaoBounty
        preBoostedVotePeriodLimit
        proposingRepReward
        queuedVotePeriodLimit
        queuedVoteRequiredPercentage
        quietEndingPeriod
        thresholdConst
        votersReputationLossRatio
      }
      gpRewards {
        id
      }
      scheme {
        ...SchemeFields
      }
      gpQueue {
        id
        threshold
        votingMachine
      }
      organizationId
      preBoostedAt
      proposer
      quietEndingPeriodBeganAt
      schemeRegistrar {
        id
        schemeToRegister
        schemeToRegisterParamsHash
        schemeToRegisterPermission
        schemeToRemove
        decision
        schemeRegistered
        schemeRemoved
      }
      stage
      # stakes { id }
      stakesFor
      stakesAgainst
      tags {
        id
      }
      totalRepWhenCreated
      totalRepWhenExecuted
      title
      url
      # votes { id }
      votesAgainst
      votesFor
      votingMachine
      winningOutcome
    }`

*Defined in [src/proposal.ts:118](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L118)*
