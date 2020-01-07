[@daostack/client](../README.md) › [Globals](../globals.md) › [Proposal](proposal.md)

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

*Defined in [proposal.ts:327](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L327)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IProposalStaticState](../interfaces/iproposalstaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Proposal](proposal.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [proposal.ts:325](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L325)*

___

###  id

• **id**: *string*

*Defined in [proposal.ts:326](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L326)*

___

###  staticState

• **staticState**: *[IProposalStaticState](../interfaces/iproposalstaticstate.md) | undefined*

*Defined in [proposal.ts:327](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L327)*

## Methods

###  claimRewards

▸ **claimRewards**(`beneficiary?`: [Address](../globals.md#address)): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [proposal.ts:754](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L754)*

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

*Defined in [proposal.ts:798](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L798)*

calll the 'execute()' function on the votingMachine.
the main purpose of this function is to set the stage of the proposals
this call may (or may not) "execute" the proposal itself (i.e. do what the proposal proposes)

**Returns:** *[Operation](../globals.md#operation)‹any›*

an Operation that, when sucessful, will contain the receipt of the transaction

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IProposalStaticState](../interfaces/iproposalstaticstate.md)›*

*Defined in [proposal.ts:345](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L345)*

**Returns:** *Promise‹[IProposalStaticState](../interfaces/iproposalstaticstate.md)›*

___

###  redeemerContract

▸ **redeemerContract**(): *any*

*Defined in [proposal.ts:581](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L581)*

[redeemerContract description]

**Returns:** *any*

a web3 Contract instance

___

###  rewards

▸ **rewards**(`options`: [IRewardQueryOptions](../interfaces/irewardqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reward](reward.md)[]›*

*Defined in [proposal.ts:737](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L737)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IRewardQueryOptions](../interfaces/irewardqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Reward](reward.md)[]›*

___

###  scheme

▸ **scheme**(): *Promise‹any›*

*Defined in [proposal.ts:564](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L564)*

**Returns:** *Promise‹any›*

the scheme Contract

___

###  setStaticState

▸ **setStaticState**(`opts`: [IProposalStaticState](../interfaces/iproposalstaticstate.md)): *void*

*Defined in [proposal.ts:341](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L341)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IProposalStaticState](../interfaces/iproposalstaticstate.md) |

**Returns:** *void*

___

###  stake

▸ **stake**(`outcome`: [IProposalOutcome](../enums/iproposaloutcome.md), `amount`: BN): *[Operation](../globals.md#operation)‹[Stake](stake.md)›*

*Defined in [proposal.ts:671](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L671)*

Stake on this proposal

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`outcome` | [IProposalOutcome](../enums/iproposaloutcome.md) | the outcome that is staked on, of type IProposalOutcome |
`amount` | BN | the amount, in GEn, to stake |

**Returns:** *[Operation](../globals.md#operation)‹[Stake](stake.md)›*

An observable that can be sent, or subscribed to

___

###  stakes

▸ **stakes**(`options`: [IStakeQueryOptions](../interfaces/istakequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Stake](stake.md)[]›*

*Defined in [proposal.ts:659](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L659)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IStakeQueryOptions](../interfaces/istakequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Stake](stake.md)[]›*

___

###  stakingToken

▸ **stakingToken**(): *[Token](token.md)‹›*

*Defined in [proposal.ts:655](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L655)*

**Returns:** *[Token](token.md)‹›*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IProposalState](../interfaces/iproposalstate.md)›*

*Defined in [proposal.ts:367](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L367)*

`state` is an observable of the proposal state

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IProposalState](../interfaces/iproposalstate.md)›*

___

###  vote

▸ **vote**(`outcome`: [IProposalOutcome](../enums/iproposaloutcome.md), `amount`: number): *[Operation](../globals.md#operation)‹[Vote](vote.md) | null›*

*Defined in [proposal.ts:603](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L603)*

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

*Defined in [proposal.ts:590](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L590)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Vote](vote.md)[]›*

___

###  votingMachine

▸ **votingMachine**(): *Promise‹any›*

*Defined in [proposal.ts:573](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L573)*

[votingMachine description]

**Returns:** *Promise‹any›*

a web3 Contract instance

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Defined in [proposal.ts:236](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L236)*

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

*Defined in [proposal.ts:111](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L111)*

###  ProposalFields

• **ProposalFields**: *any* =  gql`fragment ProposalFields on Proposal {
      id
      accountsWithUnclaimedRewards
      boostedAt
      closingAt
      confidenceThreshold
      competition {
        id
        endTime
        contract
        suggestionsEndTime
        createdAt
        numberOfVotesPerVoters
        numberOfWinners
        rewardSplit
        snapshotBlock
        startTime
        votingStartTime

      }
      contributionReward {
        id
        beneficiary
        ethReward
        externalToken
        externalTokenReward
        externalToken
        nativeTokenReward
        periods
        periodLength
        reputationReward
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
      }
      genesisProtocolParams {
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

*Defined in [proposal.ts:112](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L112)*
