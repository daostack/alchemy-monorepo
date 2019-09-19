[@daostack/client](../README.md) › [Globals](../globals.md) › [Member](member.md)

# Class: Member

Represents an account that holds reputaion in a specific DAO

## Hierarchy

* **Member**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IMemberState](../interfaces/imemberstate.md)›

## Index

### Constructors

* [constructor](member.md#constructor)

### Properties

* [context](member.md#context)
* [id](member.md#id)
* [staticState](member.md#staticstate)

### Methods

* [dao](member.md#dao)
* [fetchStaticState](member.md#fetchstaticstate)
* [proposals](member.md#proposals)
* [rewards](member.md#rewards)
* [setStaticState](member.md#setstaticstate)
* [stakes](member.md#stakes)
* [state](member.md#state)
* [votes](member.md#votes)
* [search](member.md#static-search)

## Constructors

###  constructor

\+ **new Member**(`idOrOpts`: string | [IMemberStaticState](../interfaces/imemberstaticstate.md), `context`: [Arc](arc.md)): *[Member](member.md)*

*Defined in [member.ts:83](https://github.com/daostack/client/blob/3edf873/src/member.ts#L83)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idOrOpts` | string &#124; [IMemberStaticState](../interfaces/imemberstaticstate.md) | - |
`context` | [Arc](arc.md) | an instance of Arc  |

**Returns:** *[Member](member.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [member.ts:90](https://github.com/daostack/client/blob/3edf873/src/member.ts#L90)*

an instance of Arc

___

###  id

• **id**: *string | undefined*

*Defined in [member.ts:82](https://github.com/daostack/client/blob/3edf873/src/member.ts#L82)*

___

###  staticState

• **staticState**: *[IMemberStaticState](../interfaces/imemberstaticstate.md) | undefined*

*Defined in [member.ts:83](https://github.com/daostack/client/blob/3edf873/src/member.ts#L83)*

## Methods

###  dao

▸ **dao**(): *Promise‹[DAO](dao.md)›*

*Defined in [member.ts:178](https://github.com/daostack/client/blob/3edf873/src/member.ts#L178)*

**Returns:** *Promise‹[DAO](dao.md)›*

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IMemberStaticState](../interfaces/imemberstaticstate.md)›*

*Defined in [member.ts:101](https://github.com/daostack/client/blob/3edf873/src/member.ts#L101)*

**Returns:** *Promise‹[IMemberStaticState](../interfaces/imemberstaticstate.md)›*

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Defined in [member.ts:187](https://github.com/daostack/client/blob/3edf873/src/member.ts#L187)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  rewards

▸ **rewards**(): *Observable‹[Reward](reward.md)[]›*

*Defined in [member.ts:183](https://github.com/daostack/client/blob/3edf873/src/member.ts#L183)*

**Returns:** *Observable‹[Reward](reward.md)[]›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IMemberStaticState](../interfaces/imemberstaticstate.md)): *void*

*Defined in [member.ts:114](https://github.com/daostack/client/blob/3edf873/src/member.ts#L114)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IMemberStaticState](../interfaces/imemberstaticstate.md) |

**Returns:** *void*

___

###  stakes

▸ **stakes**(`options`: [IStakeQueryOptions](../interfaces/istakequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Stake](stake.md)[]›*

*Defined in [member.ts:203](https://github.com/daostack/client/blob/3edf873/src/member.ts#L203)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IStakeQueryOptions](../interfaces/istakequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Stake](stake.md)[]›*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IMemberState](../interfaces/imemberstate.md)›*

*Defined in [member.ts:121](https://github.com/daostack/client/blob/3edf873/src/member.ts#L121)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IMemberState](../interfaces/imemberstate.md)›*

___

###  votes

▸ **votes**(`options`: [IVoteQueryOptions](../interfaces/ivotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Vote](vote.md)[]›*

*Defined in [member.ts:216](https://github.com/daostack/client/blob/3edf873/src/member.ts#L216)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Vote](vote.md)[]›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IMemberQueryOptions](../interfaces/imemberqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Member](member.md)[]›*

*Defined in [member.ts:43](https://github.com/daostack/client/blob/3edf873/src/member.ts#L43)*

Member.search(context, options) searches for member entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IMemberQueryOptions](../interfaces/imemberqueryoptions.md) |  {} | the query options, cf. IMemberQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Member](member.md)[]›*

an observable of IRewardState objects
