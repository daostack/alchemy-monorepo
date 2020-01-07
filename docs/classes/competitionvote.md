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
* [calculateId](competitionvote.md#static-calculateid)
* [search](competitionvote.md#static-search)

### Object literals

* [fragments](competitionvote.md#static-fragments)

## Constructors

###  constructor

\+ **new CompetitionVote**(`idOrOpts`: string | [ICompetitionVote](../interfaces/icompetitionvote.md), `context`: [Arc](arc.md)): *[CompetitionVote](competitionvote.md)*

*Defined in [schemes/competition.ts:695](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L695)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [ICompetitionVote](../interfaces/icompetitionvote.md) |
`context` | [Arc](arc.md) |

**Returns:** *[CompetitionVote](competitionvote.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [schemes/competition.ts:697](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L697)*

___

### `Optional` id

• **id**? : *undefined | string*

*Defined in [schemes/competition.ts:694](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L694)*

___

### `Optional` staticState

• **staticState**? : *[ICompetitionVote](../interfaces/icompetitionvote.md)*

*Defined in [schemes/competition.ts:695](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L695)*

## Methods

###  setStaticState

▸ **setStaticState**(`opts`: [ICompetitionVote](../interfaces/icompetitionvote.md)): *void*

*Defined in [schemes/competition.ts:707](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L707)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ICompetitionVote](../interfaces/icompetitionvote.md) |

**Returns:** *void*

___

### `Static` calculateId

▸ **calculateId**(`opts`: object): *string*

*Defined in [schemes/competition.ts:657](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L657)*

**Parameters:**

▪ **opts**: *object*

Name | Type |
------ | ------ |
`scheme` | [Address](../globals.md#address) |
`suggestionId` | number |

**Returns:** *string*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ICompetitionVoteQueryOptions](../interfaces/icompetitionvotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionVote](competitionvote.md)[]›*

*Defined in [schemes/competition.ts:665](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L665)*

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

*Defined in [schemes/competition.ts:649](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L649)*

###  CompetitionVoteFields

• **CompetitionVoteFields**: *any* =  gql`fragment CompetitionVoteFields on CompetitionVote {
      id
      createdAt
      reputation
      voter
    }`

*Defined in [schemes/competition.ts:650](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L650)*
