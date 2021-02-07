[@daostack/client](../README.md) › [Globals](../globals.md) › [Competition](competition.md)

# Class: Competition

## Hierarchy

* **Competition**

## Index

### Constructors

* [constructor](competition.md#constructor)

### Properties

* [context](competition.md#context)
* [id](competition.md#id)

### Methods

* [createSuggestion](competition.md#createsuggestion)
* [redeemSuggestion](competition.md#redeemsuggestion)
* [suggestions](competition.md#suggestions)
* [voteSuggestion](competition.md#votesuggestion)
* [search](competition.md#static-search)

## Constructors

###  constructor

\+ **new Competition**(`id`: string, `context`: [Arc](arc.md)): *[Competition](competition.md)*

*Defined in [schemes/competition.ts:419](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L419)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`context` | [Arc](arc.md) |

**Returns:** *[Competition](competition.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [schemes/competition.ts:419](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L419)*

___

###  id

• **id**: *string*

*Defined in [schemes/competition.ts:418](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L418)*

## Methods

###  createSuggestion

▸ **createSuggestion**(`options`: object): *[Operation](../globals.md#operation)‹any›*

*Defined in [schemes/competition.ts:427](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L427)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`description` | string |
`tags?` | string[] |
`title` | string |
`url?` | undefined &#124; string |

**Returns:** *[Operation](../globals.md#operation)‹any›*

___

###  redeemSuggestion

▸ **redeemSuggestion**(`suggestionId`: number, `beneficiary`: [Address](../globals.md#address)): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [schemes/competition.ts:488](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L488)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`suggestionId` | number | - |
`beneficiary` | [Address](../globals.md#address) |  NULL_ADDRESS |

**Returns:** *[Operation](../globals.md#operation)‹boolean›*

___

###  suggestions

▸ **suggestions**(`options`: [ICompetitionSuggestionQueryOptions](../interfaces/icompetitionsuggestionqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionSuggestion](competitionsuggestion.md)[]›*

*Defined in [schemes/competition.ts:500](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L500)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ICompetitionSuggestionQueryOptions](../interfaces/icompetitionsuggestionqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[CompetitionSuggestion](competitionsuggestion.md)[]›*

___

###  voteSuggestion

▸ **voteSuggestion**(`suggestionId`: number): *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

*Defined in [schemes/competition.ts:477](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L477)*

**Parameters:**

Name | Type |
------ | ------ |
`suggestionId` | number |

**Returns:** *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Competition](competition.md)[]›*

*Defined in [schemes/competition.ts:408](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L408)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`context` | [Arc](arc.md) | - |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Competition](competition.md)[]›*
