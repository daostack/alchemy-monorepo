[@daostack/client](../README.md) › [Globals](../globals.md) › [CompetitionVote](competitionvote.md)

# Class: CompetitionVote

## Hierarchy

* **CompetitionVote**

## Index

### Constructors

* [constructor](competitionvote.md#constructor)

### Properties

* [context](competitionvote.md#context)
* [id](competitionvote.md#optional-id)
* [staticState](competitionvote.md#optional-staticstate)

### Methods

* [setStaticState](competitionvote.md#setstaticstate)
* [search](competitionvote.md#static-search)

### Object literals

* [fragments](competitionvote.md#static-fragments)

## Constructors

###  constructor

\+ **new CompetitionVote**(`idOrOpts`: string | [ICompetitionVoteState](../interfaces/icompetitionvotestate.md), `context`: [Arc](arc.md)): *[CompetitionVote](competitionvote.md)*

*Defined in [schemes/competition.ts:757](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L757)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [ICompetitionVoteState](../interfaces/icompetitionvotestate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[CompetitionVote](competitionvote.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [schemes/competition.ts:759](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L759)*

___

### `Optional` id

• **id**? : *undefined | string*

*Defined in [schemes/competition.ts:756](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L756)*

___

### `Optional` staticState

• **staticState**? : *[ICompetitionVoteState](../interfaces/icompetitionvotestate.md)*

*Defined in [schemes/competition.ts:757](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L757)*

## Methods

###  setStaticState

▸ **setStaticState**(`opts`: [ICompetitionVoteState](../interfaces/icompetitionvotestate.md)): *void*

*Defined in [schemes/competition.ts:769](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L769)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ICompetitionVoteState](../interfaces/icompetitionvotestate.md) |

**Returns:** *void*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ICompetitionVoteQueryOptions](../interfaces/icompetitionvotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionVote](competitionvote.md)[]›*

*Defined in [schemes/competition.ts:727](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L727)*

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

*Defined in [schemes/competition.ts:716](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L716)*

###  CompetitionVoteFields

• **CompetitionVoteFields**: *any* =  gql`fragment CompetitionVoteFields on CompetitionVote {
      id
      createdAt
      reputation
      voter
      proposal { id }
      suggestion { id }
    }`

*Defined in [schemes/competition.ts:717](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L717)*
