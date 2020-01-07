[@daostack/client](../README.md) › [Globals](../globals.md) › [Reward](reward.md)

# Class: Reward

## Hierarchy

* **Reward**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IRewardState](../interfaces/irewardstate.md)›

## Index

### Constructors

* [constructor](reward.md#constructor)

### Properties

* [context](reward.md#context)
* [id](reward.md#id)
* [idOrOpts](reward.md#idoropts)
* [staticState](reward.md#staticstate)

### Methods

* [fetchStaticState](reward.md#fetchstaticstate)
* [setStaticState](reward.md#setstaticstate)
* [state](reward.md#state)
* [search](reward.md#static-search)

### Object literals

* [fragments](reward.md#static-fragments)

## Constructors

###  constructor

\+ **new Reward**(`idOrOpts`: string | [IRewardStaticState](../interfaces/irewardstaticstate.md), `context`: [Arc](arc.md)): *[Reward](reward.md)*

*Defined in [reward.ts:155](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L155)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IRewardStaticState](../interfaces/irewardstaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Reward](reward.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [reward.ts:157](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L157)*

___

###  id

• **id**: *string*

*Defined in [reward.ts:154](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L154)*

___

###  idOrOpts

• **idOrOpts**: *string | [IRewardStaticState](../interfaces/irewardstaticstate.md)*

*Defined in [reward.ts:157](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L157)*

___

###  staticState

• **staticState**: *[IRewardStaticState](../interfaces/irewardstaticstate.md) | undefined*

*Defined in [reward.ts:155](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L155)*

## Methods

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IRewardStaticState](../interfaces/irewardstaticstate.md)›*

*Defined in [reward.ts:215](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L215)*

**Returns:** *Promise‹[IRewardStaticState](../interfaces/irewardstaticstate.md)›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IRewardStaticState](../interfaces/irewardstaticstate.md)): *void*

*Defined in [reward.ts:211](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L211)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IRewardStaticState](../interfaces/irewardstaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IRewardState](../interfaces/irewardstate.md)›*

*Defined in [reward.ts:167](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L167)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IRewardState](../interfaces/irewardstate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IRewardQueryOptions](../interfaces/irewardqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reward](reward.md)[]›*

*Defined in [reward.ts:71](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L71)*

Reward.search(context, options) searches for reward entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IRewardQueryOptions](../interfaces/irewardqueryoptions.md) |  {} | the query options, cf. IRewardQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Reward](reward.md)[]›*

an observable of Reward objects

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Defined in [reward.ts:42](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L42)*

###  RewardFields

• **RewardFields**: *any* =  gql`fragment RewardFields on GPReward {
      id
      createdAt
      dao {
        id
      }
      beneficiary
      daoBountyForStaker
      proposal {
         id
      }
      reputationForVoter
      reputationForVoterRedeemedAt
      reputationForProposer
      reputationForProposerRedeemedAt
      tokenAddress
      tokensForStaker
      tokensForStakerRedeemedAt
      daoBountyForStakerRedeemedAt
    }`

*Defined in [reward.ts:43](https://github.com/daostack/client/blob/7361fcc/src/reward.ts#L43)*
