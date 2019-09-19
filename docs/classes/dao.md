[@daostack/client](../README.md) › [Globals](../globals.md) › [DAO](dao.md)

# Class: DAO

## Hierarchy

* **DAO**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IDAOState](../interfaces/idaostate.md)›

## Index

### Constructors

* [constructor](dao.md#constructor)

### Properties

* [context](dao.md#context)
* [id](dao.md#id)
* [staticState](dao.md#staticstate)

### Methods

* [createProposal](dao.md#createproposal)
* [ethBalance](dao.md#ethbalance)
* [fetchStaticState](dao.md#fetchstaticstate)
* [member](dao.md#member)
* [members](dao.md#members)
* [nativeReputation](dao.md#nativereputation)
* [proposal](dao.md#proposal)
* [proposals](dao.md#proposals)
* [rewards](dao.md#rewards)
* [scheme](dao.md#scheme)
* [schemes](dao.md#schemes)
* [setStaticState](dao.md#setstaticstate)
* [stakes](dao.md#stakes)
* [state](dao.md#state)
* [votes](dao.md#votes)
* [search](dao.md#static-search)

## Constructors

###  constructor

\+ **new DAO**(`idOrOpts`: [Address](../globals.md#address) | [IDAOStaticState](../interfaces/idaostaticstate.md), `context`: [Arc](arc.md)): *[DAO](dao.md)*

*Defined in [dao.ts:87](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | [Address](../globals.md#address) &#124; [IDAOStaticState](../interfaces/idaostaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[DAO](dao.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [dao.ts:89](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L89)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Defined in [dao.ts:86](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L86)*

___

###  staticState

• **staticState**: *[IDAOStaticState](../interfaces/idaostaticstate.md) | undefined*

*Defined in [dao.ts:87](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L87)*

## Methods

###  createProposal

▸ **createProposal**(`options`: [IProposalCreateOptions](../globals.md#iproposalcreateoptions)): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹[Proposal](proposal.md)››*

*Defined in [dao.ts:210](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L210)*

create a new proposal in this DAO

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IProposalCreateOptions](../globals.md#iproposalcreateoptions) |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹[Proposal](proposal.md)››*

a Proposal instance

___

###  ethBalance

▸ **ethBalance**(): *Observable‹any›*

*Defined in [dao.ts:257](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L257)*

**Returns:** *Observable‹any›*

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IDAOStaticState](../interfaces/idaostaticstate.md)›*

*Defined in [dao.ts:102](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L102)*

**Returns:** *Promise‹[IDAOStaticState](../interfaces/idaostaticstate.md)›*

___

###  member

▸ **member**(`address`: [Address](../globals.md#address)): *[Member](member.md)*

*Defined in [dao.ts:201](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L201)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address](../globals.md#address) |

**Returns:** *[Member](member.md)*

___

###  members

▸ **members**(`options`: [IMemberQueryOptions](../interfaces/imemberqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Member](member.md)[]›*

*Defined in [dao.ts:181](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L181)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IMemberQueryOptions](../interfaces/imemberqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Member](member.md)[]›*

___

###  nativeReputation

▸ **nativeReputation**(): *Observable‹[Reputation](reputation.md)›*

*Defined in [dao.ts:160](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L160)*

**Returns:** *Observable‹[Reputation](reputation.md)›*

___

###  proposal

▸ **proposal**(`proposalId`: string): *[Proposal](proposal.md)*

*Defined in [dao.ts:226](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L226)*

**Parameters:**

Name | Type |
------ | ------ |
`proposalId` | string |

**Returns:** *[Proposal](proposal.md)*

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Defined in [dao.ts:215](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L215)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  rewards

▸ **rewards**(`options`: [IRewardQueryOptions](../interfaces/irewardqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reward](reward.md)[]›*

*Defined in [dao.ts:230](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L230)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IRewardQueryOptions](../interfaces/irewardqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Reward](reward.md)[]›*

___

###  scheme

▸ **scheme**(`options`: [ISchemeQueryOptions](../interfaces/ischemequeryoptions.md)): *Promise‹[Scheme](scheme.md)›*

*Defined in [dao.ts:173](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L173)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ISchemeQueryOptions](../interfaces/ischemequeryoptions.md) |

**Returns:** *Promise‹[Scheme](scheme.md)›*

___

###  schemes

▸ **schemes**(`options`: [ISchemeQueryOptions](../interfaces/ischemequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Scheme](scheme.md)[]›*

*Defined in [dao.ts:164](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L164)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ISchemeQueryOptions](../interfaces/ischemequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Scheme](scheme.md)[]›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IDAOStaticState](../interfaces/idaostaticstate.md)): *void*

*Defined in [dao.ts:98](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IDAOStaticState](../interfaces/idaostaticstate.md) |

**Returns:** *void*

___

###  stakes

▸ **stakes**(`options`: [IStakeQueryOptions](../interfaces/istakequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Stake](stake.md)[]›*

*Defined in [dao.ts:248](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L248)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IStakeQueryOptions](../interfaces/istakequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Stake](stake.md)[]›*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IDAOState](../interfaces/idaostate.md)›*

*Defined in [dao.ts:125](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L125)*

get the current state of the DAO

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IDAOState](../interfaces/idaostate.md)›*

an Observable of IDAOState

___

###  votes

▸ **votes**(`options`: [IVoteQueryOptions](../interfaces/ivotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Vote](vote.md)[]›*

*Defined in [dao.ts:239](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L239)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Vote](vote.md)[]›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IDAOQueryOptions](../interfaces/idaoqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[DAO](dao.md)[]›*

*Defined in [dao.ts:50](https://github.com/daostack/client/blob/3edf873/src/dao.ts#L50)*

DAO.search(context, options) searches for DAO entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IDAOQueryOptions](../interfaces/idaoqueryoptions.md) |  {} | the query options, cf. IDAOQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[DAO](dao.md)[]›*

an observable of DAO objects
