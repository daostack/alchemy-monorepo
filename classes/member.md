[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [Member](member.md)

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

* [calculateId](member.md#calculateid)
* [dao](member.md#dao)
* [fetchStaticState](member.md#fetchstaticstate)
* [proposals](member.md#proposals)
* [rewards](member.md#rewards)
* [setStaticState](member.md#setstaticstate)
* [stakes](member.md#stakes)
* [state](member.md#state)
* [votes](member.md#votes)
* [search](member.md#static-search)

### Object literals

* [fragments](member.md#static-fragments)

## Constructors

###  constructor

\+ **new Member**(`idOrOpts`: string | [IMemberStaticState](../interfaces/imemberstaticstate.md), `context`: [Arc](arc.md)): *[Member](member.md)*

*Defined in [src/member.ts:109](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L109)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idOrOpts` | string &#124; [IMemberStaticState](../interfaces/imemberstaticstate.md) | - |
`context` | [Arc](arc.md) | an instance of Arc  |

**Returns:** *[Member](member.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/member.ts:116](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L116)*

an instance of Arc

___

###  id

• **id**: *string | undefined*

*Defined in [src/member.ts:108](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L108)*

___

###  staticState

• **staticState**: *[IMemberStaticState](../interfaces/imemberstaticstate.md) | undefined*

*Defined in [src/member.ts:109](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L109)*

## Methods

###  calculateId

▸ **calculateId**(`opts`: object): *string*

*Defined in [src/member.ts:138](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L138)*

**Parameters:**

▪ **opts**: *object*

Name | Type |
------ | ------ |
`address` | [Address](../globals.md#address) |
`contract` | [Address](../globals.md#address) |

**Returns:** *string*

___

###  dao

▸ **dao**(): *Promise‹[DAO](dao.md)›*

*Defined in [src/member.ts:241](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L241)*

**Returns:** *Promise‹[DAO](dao.md)›*

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IMemberStaticState](../interfaces/imemberstaticstate.md)›*

*Defined in [src/member.ts:125](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L125)*

**Returns:** *Promise‹[IMemberStaticState](../interfaces/imemberstaticstate.md)›*

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Defined in [src/member.ts:250](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L250)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  rewards

▸ **rewards**(): *Observable‹[Reward](reward.md)[]›*

*Defined in [src/member.ts:246](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L246)*

**Returns:** *Observable‹[Reward](reward.md)[]›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IMemberStaticState](../interfaces/imemberstaticstate.md)): *[IMemberStaticState](../interfaces/imemberstaticstate.md)*

*Defined in [src/member.ts:145](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IMemberStaticState](../interfaces/imemberstaticstate.md) |

**Returns:** *[IMemberStaticState](../interfaces/imemberstaticstate.md)*

___

###  stakes

▸ **stakes**(`options`: [IStakeQueryOptions](../interfaces/istakequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Stake](stake.md)[]›*

*Defined in [src/member.ts:266](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L266)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IStakeQueryOptions](../interfaces/istakequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Stake](stake.md)[]›*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IMemberState](../interfaces/imemberstate.md)›*

*Defined in [src/member.ts:160](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L160)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IMemberState](../interfaces/imemberstate.md)›*

___

###  votes

▸ **votes**(`options`: [IVoteQueryOptions](../interfaces/ivotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Vote](vote.md)[]›*

*Defined in [src/member.ts:279](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L279)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Vote](vote.md)[]›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IMemberQueryOptions](../interfaces/imemberqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Member](member.md)[]›*

*Defined in [src/member.ts:66](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L66)*

Member.search(context, options) searches for member entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IMemberQueryOptions](../interfaces/imemberqueryoptions.md) |  {} | the query options, cf. IMemberQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Member](member.md)[]›*

an observable of IRewardState objects

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Defined in [src/member.ts:45](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L45)*

###  ReputationHolderFields

• **ReputationHolderFields**: *DocumentNode* =  gql`
      fragment ReputationHolderFields on ReputationHolder {
        id
        address
        contract
        dao {
          id
        }
        balance
        createdAt
      }
    `

*Defined in [src/member.ts:46](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/member.ts#L46)*
