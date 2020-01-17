[@daostack/client](../README.md) › [Globals](../globals.md) › [Event](event.md)

# Class: Event

## Hierarchy

* **Event**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IEventState](../interfaces/ieventstate.md)›

## Index

### Constructors

* [constructor](event.md#constructor)

### Properties

* [context](event.md#context)
* [id](event.md#id)
* [idOrOpts](event.md#idoropts)
* [staticState](event.md#staticstate)

### Methods

* [fetchStaticState](event.md#fetchstaticstate)
* [setStaticState](event.md#setstaticstate)
* [state](event.md#state)
* [search](event.md#static-search)

### Object literals

* [fragments](event.md#static-fragments)

## Constructors

###  constructor

\+ **new Event**(`idOrOpts`: string | [IEventStaticState](../interfaces/ieventstaticstate.md), `context`: [Arc](arc.md)): *[Event](event.md)*

*Defined in [event.ts:90](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IEventStaticState](../interfaces/ieventstaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Event](event.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [event.ts:92](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L92)*

___

###  id

• **id**: *string*

*Defined in [event.ts:89](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L89)*

___

###  idOrOpts

• **idOrOpts**: *string | [IEventStaticState](../interfaces/ieventstaticstate.md)*

*Defined in [event.ts:92](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L92)*

___

###  staticState

• **staticState**: *[IEventStaticState](../interfaces/ieventstaticstate.md) | undefined*

*Defined in [event.ts:90](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L90)*

## Methods

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IEventStaticState](../interfaces/ieventstaticstate.md)›*

*Defined in [event.ts:135](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L135)*

**Returns:** *Promise‹[IEventStaticState](../interfaces/ieventstaticstate.md)›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IEventStaticState](../interfaces/ieventstaticstate.md)): *void*

*Defined in [event.ts:131](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IEventStaticState](../interfaces/ieventstaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IEventState](../interfaces/ieventstate.md)›*

*Defined in [event.ts:102](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L102)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IEventState](../interfaces/ieventstate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IEventQueryOptions](../interfaces/ieventqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Event](event.md)[]›*

*Defined in [event.ts:56](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L56)*

Event.search(context, options) searches for reward entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IEventQueryOptions](../interfaces/ieventqueryoptions.md) |  {} | the query options, cf. IEventQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Event](event.md)[]›*

an observable of Event objects

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Defined in [event.ts:34](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L34)*

###  EventFields

• **EventFields**: *any* =  gql`fragment EventFields on Event {
      id
      dao {
        id
      }
      type
      data
      user
      proposal {
        id
      }
      timestamp
    }`

*Defined in [event.ts:35](https://github.com/daostack/client/blob/1bc237e/src/event.ts#L35)*
