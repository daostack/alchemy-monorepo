[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [CompetitionVote](competitionvote.md)

# Class: CompetitionVote

## Hierarchy

* **CompetitionVote**

## Implements

* [IStateful](../interfaces/istateful.md)‹[ICompetitionVoteState](../interfaces/icompetitionvotestate.md)›

## Index

### Constructors

* [constructor](competitionvote.md#constructor)

### Properties

* [context](competitionvote.md#context)
* [id](competitionvote.md#optional-id)
* [staticState](competitionvote.md#optional-staticstate)

### Methods

* [setStaticState](competitionvote.md#setstaticstate)
* [state](competitionvote.md#state)
* [itemMap](competitionvote.md#static-itemmap)
* [search](competitionvote.md#static-search)

### Object literals

* [fragments](competitionvote.md#static-fragments)

## Constructors

###  constructor

\+ **new CompetitionVote**(`idOrOpts`: string | [ICompetitionVoteState](../interfaces/icompetitionvotestate.md), `context`: [Arc](arc.md)): *[CompetitionVote](competitionvote.md)*

*Defined in [src/schemes/competition.ts:844](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L844)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [ICompetitionVoteState](../interfaces/icompetitionvotestate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[CompetitionVote](competitionvote.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/schemes/competition.ts:846](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L846)*

___

### `Optional` id

• **id**? : *undefined | string*

*Defined in [src/schemes/competition.ts:843](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L843)*

___

### `Optional` staticState

• **staticState**? : *[ICompetitionVoteState](../interfaces/icompetitionvotestate.md)*

*Defined in [src/schemes/competition.ts:844](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L844)*

## Methods

###  setStaticState

▸ **setStaticState**(`opts`: [ICompetitionVoteState](../interfaces/icompetitionvotestate.md)): *void*

*Defined in [src/schemes/competition.ts:856](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L856)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ICompetitionVoteState](../interfaces/icompetitionvotestate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ICompetitionVoteState](../interfaces/icompetitionvotestate.md)›*

*Defined in [src/schemes/competition.ts:860](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L860)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ICompetitionVoteState](../interfaces/icompetitionvotestate.md)›*

___

### `Static` itemMap

▸ **itemMap**(`item`: any): *object*

*Defined in [src/schemes/competition.ts:831](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L831)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *object*

* **createdAt**: *Date* =  secondSinceEpochToDate(item.createdAt)

* **id**: *any* =  item.id

* **proposal**: *any* =  item.proposal.id

* **reputation**: *any* =  item.reputation

* **suggestion**: *any* =  item.suggestion.id

* **voter**: *any* =  item.voter

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ICompetitionVoteQueryOptions](../interfaces/icompetitionvotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionVote](competitionvote.md)[]›*

*Defined in [src/schemes/competition.ts:779](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L779)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`context` | [Arc](arc.md) | - |
`options` | [ICompetitionVoteQueryOptions](../interfaces/icompetitionvotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[CompetitionVote](competitionvote.md)[]›*

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Defined in [src/schemes/competition.ts:768](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L768)*

###  CompetitionVoteFields

• **CompetitionVoteFields**: *DocumentNode* =  gql`fragment CompetitionVoteFields on CompetitionVote {
      id
      createdAt
      reputation
      voter
      proposal { id }
      suggestion { id }
    }`

*Defined in [src/schemes/competition.ts:769](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L769)*
