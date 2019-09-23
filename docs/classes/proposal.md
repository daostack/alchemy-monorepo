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
* [create](proposal.md#static-create)
* [search](proposal.md#static-search)

### Object literals

* [fragments](proposal.md#static-fragments)

## Constructors

###  constructor

\+ **new Proposal**(`idOrOpts`: string | [IProposalStaticState](../interfaces/iproposalstaticstate.md), `context`: [Arc](arc.md)): *[Proposal](proposal.md)*

*Defined in [proposal.ts:341](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L341)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IProposalStaticState](../interfaces/iproposalstaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Proposal](proposal.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [proposal.ts:339](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L339)*

___

###  id

• **id**: *string*

*Defined in [proposal.ts:340](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L340)*

___

###  staticState

• **staticState**: *[IProposalStaticState](../interfaces/iproposalstaticstate.md) | undefined*

*Defined in [proposal.ts:341](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L341)*

## Methods

###  claimRewards

▸ **claimRewards**(`beneficiary?`: [Address](../globals.md#address)): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [proposal.ts:737](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L737)*

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

*Defined in [proposal.ts:771](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L771)*

calll the 'execute()' function on the votingMachine.
the main purpose of this function is to set the stage of the proposals
this call may (or may not) "execute" the proposal itself (i.e. do what the proposal proposes)

**Returns:** *[Operation](../globals.md#operation)‹any›*

an Operation that, when sucessful, will contain the receipt of the transaction

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IProposalStaticState](../interfaces/iproposalstaticstate.md)›*

*Defined in [proposal.ts:359](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L359)*

**Returns:** *Promise‹[IProposalStaticState](../interfaces/iproposalstaticstate.md)›*

___

###  redeemerContract

▸ **redeemerContract**(): *any*

*Defined in [proposal.ts:570](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L570)*

[redeemerContract description]

**Returns:** *any*

a web3 Contract instance

___

###  rewards

▸ **rewards**(`options`: [IRewardQueryOptions](../interfaces/irewardqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reward](reward.md)[]›*

*Defined in [proposal.ts:720](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L720)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IRewardQueryOptions](../interfaces/irewardqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Reward](reward.md)[]›*

___

###  scheme

▸ **scheme**(): *Promise‹any›*

*Defined in [proposal.ts:554](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L554)*

**Returns:** *Promise‹any›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IProposalStaticState](../interfaces/iproposalstaticstate.md)): *void*

*Defined in [proposal.ts:355](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L355)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IProposalStaticState](../interfaces/iproposalstaticstate.md) |

**Returns:** *void*

___

###  stake

▸ **stake**(`outcome`: [IProposalOutcome](../enums/iproposaloutcome.md), `amount`: any): *[Operation](../globals.md#operation)‹[Stake](stake.md)›*

*Defined in [proposal.ts:654](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L654)*

**Parameters:**

Name | Type |
------ | ------ |
`outcome` | [IProposalOutcome](../enums/iproposaloutcome.md) |
`amount` | any |

**Returns:** *[Operation](../globals.md#operation)‹[Stake](stake.md)›*

___

###  stakes

▸ **stakes**(`options`: [IStakeQueryOptions](../interfaces/istakequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Stake](stake.md)[]›*

*Defined in [proposal.ts:648](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L648)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IStakeQueryOptions](../interfaces/istakequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Stake](stake.md)[]›*

___

###  stakingToken

▸ **stakingToken**(): *[Token](token.md)*

*Defined in [proposal.ts:644](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L644)*

**Returns:** *[Token](token.md)*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IProposalState](../interfaces/iproposalstate.md)›*

*Defined in [proposal.ts:381](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L381)*

`state` is an observable of the proposal state

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IProposalState](../interfaces/iproposalstate.md)›*

___

###  vote

▸ **vote**(`outcome`: [IProposalOutcome](../enums/iproposaloutcome.md), `amount`: number): *[Operation](../globals.md#operation)‹[Vote](vote.md) | null›*

*Defined in [proposal.ts:592](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L592)*

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

*Defined in [proposal.ts:579](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L579)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Vote](vote.md)[]›*

___

###  votingMachine

▸ **votingMachine**(): *Promise‹any›*

*Defined in [proposal.ts:562](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L562)*

[votingMachine description]

**Returns:** *Promise‹any›*

a web3 Contract instance

___

### `Static` create

▸ **create**(`options`: [IProposalCreateOptions](../globals.md#iproposalcreateoptions), `context`: [Arc](arc.md)): *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

*Defined in [proposal.ts:221](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L221)*

Proposal.create() creates a new proposal

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | [IProposalCreateOptions](../globals.md#iproposalcreateoptions) | cf. IProposalCreateOptions |
`context` | [Arc](arc.md) | - |

**Returns:** *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

an observable that streams the various states

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Defined in [proposal.ts:260](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L260)*

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

*Defined in [proposal.ts:106](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L106)*

###  ProposalFields

• **ProposalFields**: *any* =  gql`fragment ProposalFields on Proposal {
      id
      accountsWithUnclaimedRewards
      boostedAt
      confidenceThreshold
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
        id
        paramsHash
        name
        address
        canDelegateCall
        canManageGlobalConstraints
        canRegisterSchemes
        canUpgradeController
        name
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
      stakes {
        id
      }
      stakesFor
      stakesAgainst
      totalRepWhenCreated
      totalRepWhenExecuted
      title
      url
      votes {
        id
      }
      votesAgainst
      votesFor
      votingMachine
      winningOutcome
    }`

*Defined in [proposal.ts:107](https://github.com/daostack/client/blob/c62f433/src/proposal.ts#L107)*
