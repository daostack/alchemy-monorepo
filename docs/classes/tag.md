[@daostack/client](../README.md) › [Globals](../globals.md) › [Tag](tag.md)

# Class: Tag

## Hierarchy

* **Tag**

## Implements

* [IStateful](../interfaces/istateful.md)‹[ITagState](../interfaces/itagstate.md)›

## Index

### Constructors

* [constructor](tag.md#constructor)

### Properties

* [context](tag.md#context)
* [id](tag.md#id)
* [staticState](tag.md#staticstate)

### Methods

* [fetchStaticState](tag.md#fetchstaticstate)
* [setStaticState](tag.md#setstaticstate)
* [state](tag.md#state)
* [search](tag.md#static-search)

### Object literals

* [fragments](tag.md#static-fragments)

## Constructors

###  constructor

\+ **new Tag**(`idOrOpts`: string | [ITagStaticState](../interfaces/itagstaticstate.md), `context`: [Arc](arc.md)): *[Tag](tag.md)*

*Defined in [tag.ts:113](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [ITagStaticState](../interfaces/itagstaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Tag](tag.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [tag.ts:117](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L117)*

___

###  id

• **id**: *string | undefined*

*Defined in [tag.ts:112](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L112)*

___

###  staticState

• **staticState**: *[ITagStaticState](../interfaces/itagstaticstate.md) | undefined*

*Defined in [tag.ts:113](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L113)*

## Methods

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[ITagStaticState](../interfaces/itagstaticstate.md)›*

*Defined in [tag.ts:158](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L158)*

**Returns:** *Promise‹[ITagStaticState](../interfaces/itagstaticstate.md)›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [ITagStaticState](../interfaces/itagstaticstate.md)): *void*

*Defined in [tag.ts:154](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L154)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ITagStaticState](../interfaces/itagstaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ITagState](../interfaces/itagstate.md)›*

*Defined in [tag.ts:127](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L127)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ITagState](../interfaces/itagstate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ITagQueryOptions](../interfaces/itagqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Tag](tag.md)[]›*

*Defined in [tag.ts:41](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L41)*

Tag.search(context, options) searches for stake entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [ITagQueryOptions](../interfaces/itagqueryoptions.md) |  {} | the query options, cf. ITagQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Tag](tag.md)[]›*

an observable of Tag objects

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Defined in [tag.ts:27](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L27)*

###  TagFields

• **TagFields**: *any* =  gql`fragment TagFields on Tag {
      id
      numberOfProposals
      proposals { id }
    }`

*Defined in [tag.ts:28](https://github.com/daostack/client/blob/aa9723f/src/tag.ts#L28)*
