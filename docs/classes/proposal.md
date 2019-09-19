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

## Constructors

###  constructor

\+ **new Proposal**(`idOrOpts`: string | [IProposalStaticState](../interfaces/iproposalstaticstate.md), `context`: [Arc](arc.md)): *[Proposal](proposal.md)*

*Defined in [proposal.ts:219](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L219)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IProposalStaticState](../interfaces/iproposalstaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Proposal](proposal.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [proposal.ts:217](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L217)*

___

###  id

• **id**: *string*

*Defined in [proposal.ts:218](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L218)*

___

###  staticState

• **staticState**: *[IProposalStaticState](../interfaces/iproposalstaticstate.md) | undefined*

*Defined in [proposal.ts:219](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L219)*

## Methods

###  claimRewards

▸ **claimRewards**(`beneficiary?`: [Address](../globals.md#address)): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [proposal.ts:718](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L718)*

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

*Defined in [proposal.ts:752](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L752)*

calll the 'execute()' function on the votingMachine.
the main purpose of this function is to set the stage of the proposals
this call may (or may not) "execute" the proposal itself (i.e. do what the proposal proposes)

**Returns:** *[Operation](../globals.md#operation)‹any›*

an Operation that, when sucessful, will contain the receipt of the transaction

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IProposalStaticState](../interfaces/iproposalstaticstate.md)›*

*Defined in [proposal.ts:238](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L238)*

**Returns:** *Promise‹[IProposalStaticState](../interfaces/iproposalstaticstate.md)›*

___

###  redeemerContract

▸ **redeemerContract**(): *any*

*Defined in [proposal.ts:551](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L551)*

[redeemerContract description]

**Returns:** *any*

a web3 Contract instance

___

###  rewards

▸ **rewards**(`options`: [IRewardQueryOptions](../interfaces/irewardqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reward](reward.md)[]›*

*Defined in [proposal.ts:701](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L701)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IRewardQueryOptions](../interfaces/irewardqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Reward](reward.md)[]›*

___

###  scheme

▸ **scheme**(): *Promise‹any›*

*Defined in [proposal.ts:535](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L535)*

**Returns:** *Promise‹any›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IProposalStaticState](../interfaces/iproposalstaticstate.md)): *void*

*Defined in [proposal.ts:234](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L234)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IProposalStaticState](../interfaces/iproposalstaticstate.md) |

**Returns:** *void*

___

###  stake

▸ **stake**(`outcome`: [IProposalOutcome](../enums/iproposaloutcome.md), `amount`: any): *[Operation](../globals.md#operation)‹[Stake](stake.md)›*

*Defined in [proposal.ts:635](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L635)*

**Parameters:**

Name | Type |
------ | ------ |
`outcome` | [IProposalOutcome](../enums/iproposaloutcome.md) |
`amount` | any |

**Returns:** *[Operation](../globals.md#operation)‹[Stake](stake.md)›*

___

###  stakes

▸ **stakes**(`options`: [IStakeQueryOptions](../interfaces/istakequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Stake](stake.md)[]›*

*Defined in [proposal.ts:629](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L629)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IStakeQueryOptions](../interfaces/istakequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Stake](stake.md)[]›*

___

###  stakingToken

▸ **stakingToken**(): *[Token](token.md)*

*Defined in [proposal.ts:625](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L625)*

**Returns:** *[Token](token.md)*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IProposalState](../interfaces/iproposalstate.md)›*

*Defined in [proposal.ts:260](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L260)*

`state` is an observable of the proposal state

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IProposalState](../interfaces/iproposalstate.md)›*

___

###  vote

▸ **vote**(`outcome`: [IProposalOutcome](../enums/iproposaloutcome.md), `amount`: number): *[Operation](../globals.md#operation)‹[Vote](vote.md) | null›*

*Defined in [proposal.ts:573](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L573)*

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

*Defined in [proposal.ts:560](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L560)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Vote](vote.md)[]›*

___

###  votingMachine

▸ **votingMachine**(): *Promise‹any›*

*Defined in [proposal.ts:543](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L543)*

[votingMachine description]

**Returns:** *Promise‹any›*

a web3 Contract instance

___

### `Static` create

▸ **create**(`options`: [IProposalCreateOptions](../globals.md#iproposalcreateoptions), `context`: [Arc](arc.md)): *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

*Defined in [proposal.ts:112](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L112)*

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

*Defined in [proposal.ts:151](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L151)*

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
