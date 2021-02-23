[@daostack/client](../README.md) › [Globals](../globals.md) › [CompetitionSuggestion](competitionsuggestion.md)

# Class: CompetitionSuggestion

## Hierarchy

* **CompetitionSuggestion**

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

*Defined in [schemes/competition.ts:616](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L616)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; object &#124; [ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[CompetitionSuggestion](competitionsuggestion.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [schemes/competition.ts:620](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L620)*

___

###  id

• **id**: *string*

*Defined in [schemes/competition.ts:614](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L614)*

___

### `Optional` staticState

• **staticState**? : *[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)*

*Defined in [schemes/competition.ts:616](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L616)*

___

### `Optional` suggestionId

• **suggestionId**? : *undefined | number*

*Defined in [schemes/competition.ts:615](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L615)*

## Methods

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)›*

*Defined in [schemes/competition.ts:643](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L643)*

**Returns:** *Promise‹[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)›*

___

###  getPosition

▸ **getPosition**(): *Promise‹null | number›*

*Defined in [schemes/competition.ts:681](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L681)*

**Returns:** *Promise‹null | number›*

___

###  isWinner

▸ **isWinner**(): *Promise‹boolean›*

*Defined in [schemes/competition.ts:687](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L687)*

**Returns:** *Promise‹boolean›*

___

###  redeem

▸ **redeem**(`beneficiary`: [Address](../globals.md#address)): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [schemes/competition.ts:693](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L693)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`beneficiary` | [Address](../globals.md#address) |  NULL_ADDRESS |

**Returns:** *[Operation](../globals.md#operation)‹boolean›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)): *void*

*Defined in [schemes/competition.ts:639](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L639)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)›*

*Defined in [schemes/competition.ts:647](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L647)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md)›*

___

###  vote

▸ **vote**(): *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

*Defined in [schemes/competition.ts:661](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L661)*

**Returns:** *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

___

###  votes

▸ **votes**(`options`: [ICompetitionVoteQueryOptions](../interfaces/icompetitionvotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionVote](competitionvote.md)[]›*

*Defined in [schemes/competition.ts:672](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L672)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ICompetitionVoteQueryOptions](../interfaces/icompetitionvotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[CompetitionVote](competitionvote.md)[]›*

___

### `Static` calculateId

▸ **calculateId**(`opts`: object): *string*

*Defined in [schemes/competition.ts:547](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L547)*

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

*Defined in [schemes/competition.ts:581](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L581)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`context` | [Arc](arc.md) |

**Returns:** *[ICompetitionSuggestionState](../interfaces/icompetitionsuggestionstate.md) | null*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ICompetitionSuggestionQueryOptions](../interfaces/icompetitionsuggestionqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionSuggestion](competitionsuggestion.md)[]›*

*Defined in [schemes/competition.ts:555](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L555)*

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

*Defined in [schemes/competition.ts:522](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L522)*

###  CompetitionSuggestionFields

• **CompetitionSuggestionFields**: *any* =  gql`fragment CompetitionSuggestionFields on CompetitionSuggestion {
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
      suggester
      # votes: [CompetitionVote!] @derivedFrom(field: "suggestion")
      totalVotes
      createdAt
      redeemedAt
      rewardPercentage
      positionInWinnerList
    }`

*Defined in [schemes/competition.ts:523](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L523)*
