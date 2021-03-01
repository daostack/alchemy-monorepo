[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [CompetitionSuggestion](competitionsuggestion.md)

# Class: CompetitionSuggestion

## Hierarchy

* **CompetitionSuggestion**

## Implements

* [IStateful](../interfaces/istateful.md)‹[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)›

## Index

### Constructors

* [constructor](competitionsuggestion.md#constructor)

### Properties

* [context](competitionsuggestion.md#context)
* [id](competitionsuggestion.md#id)
* [staticState](competitionsuggestion.md#optional-staticstate)
* [suggestionId](competitionsuggestion.md#optional-suggestionid)

### Methods

* [fetchStaticState](competitionsuggestion.md#fetchstaticstate)
* [getPosition](competitionsuggestion.md#getposition)
* [isWinner](competitionsuggestion.md#iswinner)
* [redeem](competitionsuggestion.md#redeem)
* [setStaticState](competitionsuggestion.md#setstaticstate)
* [state](competitionsuggestion.md#state)
* [vote](competitionsuggestion.md#vote)
* [votes](competitionsuggestion.md#votes)
* [calculateId](competitionsuggestion.md#static-calculateid)
* [mapItemToObject](competitionsuggestion.md#static-private-mapitemtoobject)
* [search](competitionsuggestion.md#static-search)

### Object literals

* [fragments](competitionsuggestion.md#static-fragments)

## Constructors

###  constructor

\+ **new CompetitionSuggestion**(`idOrOpts`: string | object | [ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md), `context`: [Arc](arc.md)): *[CompetitionSuggestion](competitionsuggestion.md)*

*Defined in [src/schemes/competition.ts:668](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L668)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; object &#124; [ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[CompetitionSuggestion](competitionsuggestion.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/schemes/competition.ts:672](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L672)*

___

###  id

• **id**: *string*

*Defined in [src/schemes/competition.ts:666](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L666)*

___

### `Optional` staticState

• **staticState**? : *[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)*

*Defined in [src/schemes/competition.ts:668](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L668)*

___

### `Optional` suggestionId

• **suggestionId**? : *undefined | number*

*Defined in [src/schemes/competition.ts:667](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L667)*

## Methods

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)›*

*Defined in [src/schemes/competition.ts:695](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L695)*

**Returns:** *Promise‹[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)›*

___

###  getPosition

▸ **getPosition**(): *Promise‹null | number›*

*Defined in [src/schemes/competition.ts:733](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L733)*

**Returns:** *Promise‹null | number›*

___

###  isWinner

▸ **isWinner**(): *Promise‹boolean›*

*Defined in [src/schemes/competition.ts:739](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L739)*

**Returns:** *Promise‹boolean›*

___

###  redeem

▸ **redeem**(): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [src/schemes/competition.ts:745](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L745)*

**Returns:** *[Operation](../globals.md#operation)‹boolean›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)): *void*

*Defined in [src/schemes/competition.ts:691](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L691)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)›*

*Defined in [src/schemes/competition.ts:699](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L699)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)›*

___

###  vote

▸ **vote**(): *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

*Defined in [src/schemes/competition.ts:713](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L713)*

**Returns:** *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

___

###  votes

▸ **votes**(`options`: [ICompetitionVoteQueryOptions](../interfaces/icompetitionvotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionVote](competitionvote.md)[]›*

*Defined in [src/schemes/competition.ts:724](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L724)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ICompetitionVoteQueryOptions](../interfaces/icompetitionvotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[CompetitionVote](competitionvote.md)[]›*

___

### `Static` calculateId

▸ **calculateId**(`opts`: object): *string*

*Defined in [src/schemes/competition.ts:573](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L573)*

**Parameters:**

▪ **opts**: *object*

Name | Type |
------ | ------ |
`scheme` | [Address](../globals.md#address) |
`suggestionId` | number |

**Returns:** *string*

___

### `Static` `Private` mapItemToObject

▸ **mapItemToObject**(`item`: any, `context`: [Arc](arc.md)): *[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md) | null*

*Defined in [src/schemes/competition.ts:632](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L632)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`context` | [Arc](arc.md) |

**Returns:** *[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md) | null*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ICompetitionSuggestionQueryOptions](../interfaces/icompetitionsuggestionqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionSuggestion](competitionsuggestion.md)[]›*

*Defined in [src/schemes/competition.ts:581](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L581)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`context` | [Arc](arc.md) | - |
`options` | [ICompetitionSuggestionQueryOptions](../interfaces/icompetitionsuggestionqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[CompetitionSuggestion](competitionsuggestion.md)[]›*

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Defined in [src/schemes/competition.ts:547](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L547)*

###  CompetitionSuggestionFields

• **CompetitionSuggestionFields**: *DocumentNode* =  gql`fragment CompetitionSuggestionFields on CompetitionSuggestion {
      id
      suggestionId
      proposal {
       id
      }
      descriptionHash
      title
      description
      url
      tags {
        id
      }
      # fulltext: [string]
      beneficiary
      suggester
      # votes: [CompetitionVote!] @derivedFrom(field: "suggestion")
      totalVotes
      createdAt
      redeemedAt
      rewardPercentage
      positionInWinnerList
    }`

*Defined in [src/schemes/competition.ts:548](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L548)*
