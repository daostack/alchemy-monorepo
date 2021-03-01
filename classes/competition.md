[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [Competition](competition.md)

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
* [votes](competition.md#votes)
* [search](competition.md#static-search)

## Constructors

###  constructor

\+ **new Competition**(`id`: string, `context`: [Arc](arc.md)): *[Competition](competition.md)*

*Defined in [src/schemes/competition.ts:434](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L434)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`context` | [Arc](arc.md) |

**Returns:** *[Competition](competition.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/schemes/competition.ts:434](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L434)*

___

###  id

• **id**: *string*

*Defined in [src/schemes/competition.ts:433](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L433)*

## Methods

###  createSuggestion

▸ **createSuggestion**(`options`: object): *[Operation](../globals.md#operation)‹any›*

*Defined in [src/schemes/competition.ts:442](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L442)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`beneficiary?` | [Address](../globals.md#address) |
`description` | string |
`tags?` | string[] |
`title` | string |
`url?` | undefined &#124; string |

**Returns:** *[Operation](../globals.md#operation)‹any›*

___

###  redeemSuggestion

▸ **redeemSuggestion**(`suggestionId`: number): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [src/schemes/competition.ts:503](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L503)*

**Parameters:**

Name | Type |
------ | ------ |
`suggestionId` | number |

**Returns:** *[Operation](../globals.md#operation)‹boolean›*

___

###  suggestions

▸ **suggestions**(`options`: [ICompetitionSuggestionQueryOptions](../interfaces/icompetitionsuggestionqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionSuggestion](competitionsuggestion.md)[]›*

*Defined in [src/schemes/competition.ts:515](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L515)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ICompetitionSuggestionQueryOptions](../interfaces/icompetitionsuggestionqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[CompetitionSuggestion](competitionsuggestion.md)[]›*

___

###  voteSuggestion

▸ **voteSuggestion**(`suggestionId`: number): *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

*Defined in [src/schemes/competition.ts:489](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L489)*

**Parameters:**

Name | Type |
------ | ------ |
`suggestionId` | number |

**Returns:** *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

___

###  votes

▸ **votes**(`options`: [IVoteQueryOptions](../interfaces/ivotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[CompetitionVote](competitionvote.md)[]›*

*Defined in [src/schemes/competition.ts:524](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L524)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[CompetitionVote](competitionvote.md)[]›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Competition](competition.md)[]›*

*Defined in [src/schemes/competition.ts:423](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L423)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`context` | [Arc](arc.md) | - |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Competition](competition.md)[]›*
