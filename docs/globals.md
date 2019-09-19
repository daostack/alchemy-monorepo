[@daostack/client](README.md) › [Globals](globals.md)

# @daostack/client

## Index

### Enumerations

* [IExecutionState](enums/iexecutionstate.md)
* [IProposalOutcome](enums/iproposaloutcome.md)
* [IProposalStage](enums/iproposalstage.md)
* [ITransactionState](enums/itransactionstate.md)
* [ProposalQuerySortOptions](enums/proposalquerysortoptions.md)

### Classes

* [Arc](classes/arc.md)
* [DAO](classes/dao.md)
* [GraphNodeObserver](classes/graphnodeobserver.md)
* [Member](classes/member.md)
* [Proposal](classes/proposal.md)
* [Queue](classes/queue.md)
* [Reputation](classes/reputation.md)
* [ReputationFromTokenScheme](classes/reputationfromtokenscheme.md)
* [Reward](classes/reward.md)
* [Scheme](classes/scheme.md)
* [Stake](classes/stake.md)
* [Token](classes/token.md)
* [Vote](classes/vote.md)

### Interfaces

* [IAllowance](interfaces/iallowance.md)
* [IApolloQueryOptions](interfaces/iapolloqueryoptions.md)
* [IApproval](interfaces/iapproval.md)
* [ICommonQueryOptions](interfaces/icommonqueryoptions.md)
* [IContractAddresses](interfaces/icontractaddresses.md)
* [IContractInfo](interfaces/icontractinfo.md)
* [IContributionReward](interfaces/icontributionreward.md)
* [IDAOQueryOptions](interfaces/idaoqueryoptions.md)
* [IDAOState](interfaces/idaostate.md)
* [IDAOStaticState](interfaces/idaostaticstate.md)
* [IGenericScheme](interfaces/igenericscheme.md)
* [IGenericSchemeInfo](interfaces/igenericschemeinfo.md)
* [IGenesisProtocolParams](interfaces/igenesisprotocolparams.md)
* [IMemberQueryOptions](interfaces/imemberqueryoptions.md)
* [IMemberState](interfaces/imemberstate.md)
* [IMemberStaticState](interfaces/imemberstaticstate.md)
* [IObservable](interfaces/iobservable.md)
* [IOperationObservable](interfaces/ioperationobservable.md)
* [IProposalBaseCreateOptions](interfaces/iproposalbasecreateoptions.md)
* [IProposalCreateOptionsCR](interfaces/iproposalcreateoptionscr.md)
* [IProposalCreateOptionsGS](interfaces/iproposalcreateoptionsgs.md)
* [IProposalCreateOptionsSR](interfaces/iproposalcreateoptionssr.md)
* [IProposalQueryOptions](interfaces/iproposalqueryoptions.md)
* [IProposalState](interfaces/iproposalstate.md)
* [IProposalStaticState](interfaces/iproposalstaticstate.md)
* [IQueueQueryOptions](interfaces/iqueuequeryoptions.md)
* [IQueueState](interfaces/iqueuestate.md)
* [IQueueStaticState](interfaces/iqueuestaticstate.md)
* [IReputationQueryOptions](interfaces/ireputationqueryoptions.md)
* [IReputationState](interfaces/ireputationstate.md)
* [IRewardQueryOptions](interfaces/irewardqueryoptions.md)
* [IRewardState](interfaces/irewardstate.md)
* [ISchemeQueryOptions](interfaces/ischemequeryoptions.md)
* [ISchemeRegistrar](interfaces/ischemeregistrar.md)
* [ISchemeState](interfaces/ischemestate.md)
* [ISchemeStaticState](interfaces/ischemestaticstate.md)
* [IStakeQueryOptions](interfaces/istakequeryoptions.md)
* [IStakeState](interfaces/istakestate.md)
* [IStakeStaticState](interfaces/istakestaticstate.md)
* [IStateful](interfaces/istateful.md)
* [ITokenQueryOptions](interfaces/itokenqueryoptions.md)
* [ITokenState](interfaces/itokenstate.md)
* [ITransactionUpdate](interfaces/itransactionupdate.md)
* [IVoteQueryOptions](interfaces/ivotequeryoptions.md)
* [IVoteState](interfaces/ivotestate.md)
* [IVoteStaticState](interfaces/ivotestaticstate.md)

### Type aliases

* [Address](globals.md#address)
* [Date](globals.md#date)
* [EthereumEvent](globals.md#ethereumevent)
* [Hash](globals.md#hash)
* [IPFSProvider](globals.md#ipfsprovider)
* [IProposalCreateOptions](globals.md#iproposalcreateoptions)
* [Operation](globals.md#operation)
* [Web3Provider](globals.md#web3provider)
* [Web3Receipt](globals.md#web3receipt)
* [web3receipt](globals.md#web3receipt)

### Variables

* [BN](globals.md#const-bn)
* [DAOTOKEN_CONTRACT_VERSION](globals.md#const-daotoken_contract_version)
* [IPFSClient](globals.md#const-ipfsclient)
* [LATEST_ARC_VERSION](globals.md#const-latest_arc_version)
* [NULL_ADDRESS](globals.md#const-null_address)
* [REDEEMER_CONTRACT_VERSION](globals.md#const-redeemer_contract_version)
* [REPUTATION_CONTRACT_VERSION](globals.md#const-reputation_contract_version)
* [Web3](globals.md#const-web3)

### Functions

* [checkWebsocket](globals.md#checkwebsocket)
* [concat](globals.md#concat)
* [createApolloClient](globals.md#createapolloclient)
* [createGraphQlQuery](globals.md#creategraphqlquery)
* [createTransaction](globals.md#createtransaction)
* [createTransactionMap](globals.md#createtransactionmap)
* [eventId](globals.md#eventid)
* [fromWei](globals.md#fromwei)
* [getContractAddressesFromMigration](globals.md#getcontractaddressesfrommigration)
* [isAddress](globals.md#isaddress)
* [mapGenesisProtocolParams](globals.md#mapgenesisprotocolparams)
* [realMathToNumber](globals.md#realmathtonumber)
* [sendTransaction](globals.md#sendtransaction)
* [toIOperationObservable](globals.md#toioperationobservable)
* [toWei](globals.md#towei)
* [zenToRxjsObservable](globals.md#zentorxjsobservable)

### Object literals

* [IProposalType](globals.md#const-iproposaltype)

## Type aliases

###  Address

Ƭ **Address**: *string*

*Defined in [types.ts:3](https://github.com/daostack/client/blob/3edf873/src/types.ts#L3)*

___

###  Date

Ƭ **Date**: *number*

*Defined in [types.ts:4](https://github.com/daostack/client/blob/3edf873/src/types.ts#L4)*

___

###  EthereumEvent

Ƭ **EthereumEvent**: *any*

*Defined in [utils.ts:55](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L55)*

___

###  Hash

Ƭ **Hash**: *string*

*Defined in [types.ts:5](https://github.com/daostack/client/blob/3edf873/src/types.ts#L5)*

___

###  IPFSProvider

Ƭ **IPFSProvider**: *string | object*

*Defined in [types.ts:21](https://github.com/daostack/client/blob/3edf873/src/types.ts#L21)*

___

###  IProposalCreateOptions

Ƭ **IProposalCreateOptions**: *[IProposalBaseCreateOptions](interfaces/iproposalbasecreateoptions.md) & [IProposalCreateOptionsGS](interfaces/iproposalcreateoptionsgs.md) | [IProposalBaseCreateOptions](interfaces/iproposalbasecreateoptions.md) & [IProposalCreateOptionsSR](interfaces/iproposalcreateoptionssr.md) | [IProposalBaseCreateOptions](interfaces/iproposalbasecreateoptions.md) & [IProposalCreateOptionsCR](interfaces/iproposalcreateoptionscr.md)*

*Defined in [proposal.ts:821](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L821)*

___

###  Operation

Ƭ **Operation**: *[IOperationObservable](interfaces/ioperationobservable.md)‹[ITransactionUpdate](interfaces/itransactionupdate.md)‹T››*

*Defined in [operation.ts:39](https://github.com/daostack/client/blob/3edf873/src/operation.ts#L39)*

___

###  Web3Provider

Ƭ **Web3Provider**: *string | object*

*Defined in [types.ts:7](https://github.com/daostack/client/blob/3edf873/src/types.ts#L7)*

___

###  Web3Receipt

Ƭ **Web3Receipt**: *any*

*Defined in [types.ts:6](https://github.com/daostack/client/blob/3edf873/src/types.ts#L6)*

___

###  web3receipt

Ƭ **web3receipt**: *object*

*Defined in [operation.ts:41](https://github.com/daostack/client/blob/3edf873/src/operation.ts#L41)*

## Variables

### `Const` BN

• **BN**: *any* =  require('bn.js')

*Defined in [utils.ts:7](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L7)*

___

### `Const` DAOTOKEN_CONTRACT_VERSION

• **DAOTOKEN_CONTRACT_VERSION**: *"0.0.1-rc.19"* = "0.0.1-rc.19"

*Defined in [settings.ts:5](https://github.com/daostack/client/blob/3edf873/src/settings.ts#L5)*

___

### `Const` IPFSClient

• **IPFSClient**: *any* =  require('ipfs-http-client')

*Defined in [arc.ts:16](https://github.com/daostack/client/blob/3edf873/src/arc.ts#L16)*

___

### `Const` LATEST_ARC_VERSION

• **LATEST_ARC_VERSION**: *"0.0.1-rc.19"* = "0.0.1-rc.19"

*Defined in [settings.ts:6](https://github.com/daostack/client/blob/3edf873/src/settings.ts#L6)*

___

### `Const` NULL_ADDRESS

• **NULL_ADDRESS**: *"0x0000000000000000000000000000000000000000"* = "0x0000000000000000000000000000000000000000"

*Defined in [utils.ts:153](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L153)*

___

### `Const` REDEEMER_CONTRACT_VERSION

• **REDEEMER_CONTRACT_VERSION**: *"0.0.1-rc.22"* = "0.0.1-rc.22"

*Defined in [settings.ts:2](https://github.com/daostack/client/blob/3edf873/src/settings.ts#L2)*

___

### `Const` REPUTATION_CONTRACT_VERSION

• **REPUTATION_CONTRACT_VERSION**: *"0.0.1-rc.19"* = "0.0.1-rc.19"

*Defined in [settings.ts:4](https://github.com/daostack/client/blob/3edf873/src/settings.ts#L4)*

___

### `Const` Web3

• **Web3**: *any* =  require('web3')

*Defined in [utils.ts:6](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L6)*

*Defined in [arc.ts:17](https://github.com/daostack/client/blob/3edf873/src/arc.ts#L17)*

## Functions

###  checkWebsocket

▸ **checkWebsocket**(`options`: object): *void*

*Defined in [utils.ts:17](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L17)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`url` | string |

**Returns:** *void*

___

###  concat

▸ **concat**(`a`: Uint8Array, `b`: Uint8Array): *Uint8Array*

*Defined in [utils.ts:40](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | Uint8Array |
`b` | Uint8Array |

**Returns:** *Uint8Array*

___

###  createApolloClient

▸ **createApolloClient**(`options`: object): *ApolloClient‹NormalizedCacheObject›*

*Defined in [graphnode.ts:25](https://github.com/daostack/client/blob/3edf873/src/graphnode.ts#L25)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`graphqlHttpProvider` | string |
`graphqlWsProvider` | string |

**Returns:** *ApolloClient‹NormalizedCacheObject›*

___

###  createGraphQlQuery

▸ **createGraphQlQuery**(`options`: [ICommonQueryOptions](interfaces/icommonqueryoptions.md), `where`: string): *string*

*Defined in [utils.ts:182](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L182)*

creates a string to be plugsging into a graphql query

**`example`** 
`{  proposals ${createGraphQlQuery({ skip: 2}, 'id: "2"')}
   { id }
}`

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ICommonQueryOptions](interfaces/icommonqueryoptions.md) | - |
`where` | string | "" |

**Returns:** *string*

___

###  createTransaction

▸ **createTransaction**(`options`: any, `context`: [Arc](classes/arc.md)): *(Anonymous function)*

*Defined in [schemes/contributionReward.ts:37](https://github.com/daostack/client/blob/3edf873/src/schemes/contributionReward.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |
`context` | [Arc](classes/arc.md) |

**Returns:** *(Anonymous function)*

___

###  createTransactionMap

▸ **createTransactionMap**(`options`: any, `context`: [Arc](classes/arc.md)): *map*

*Defined in [schemes/contributionReward.ts:61](https://github.com/daostack/client/blob/3edf873/src/schemes/contributionReward.ts#L61)*

map the transaction receipt of the createTransaction call to a nice result

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | any | the options passed to the createProposal call |
`context` | [Arc](classes/arc.md) | an Arc instance |

**Returns:** *map*

___

###  eventId

▸ **eventId**(`event`: [EthereumEvent](globals.md#ethereumevent)): *string*

*Defined in [utils.ts:57](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [EthereumEvent](globals.md#ethereumevent) |

**Returns:** *string*

___

###  fromWei

▸ **fromWei**(`amount`: any): *string*

*Defined in [utils.ts:9](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`amount` | any |

**Returns:** *string*

___

###  getContractAddressesFromMigration

▸ **getContractAddressesFromMigration**(`environment`: "private" | "rinkeby" | "mainnet"): *[IContractInfo](interfaces/icontractinfo.md)[]*

*Defined in [utils.ts:155](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L155)*

**Parameters:**

Name | Type |
------ | ------ |
`environment` | "private" &#124; "rinkeby" &#124; "mainnet" |

**Returns:** *[IContractInfo](interfaces/icontractinfo.md)[]*

___

###  isAddress

▸ **isAddress**(`address`: [Address](globals.md#address)): *void*

*Defined in [utils.ts:62](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address](globals.md#address) |

**Returns:** *void*

___

###  mapGenesisProtocolParams

▸ **mapGenesisProtocolParams**(`params`: [IGenesisProtocolParams](interfaces/igenesisprotocolparams.md)): *object*

*Defined in [genesisProtocol.ts:18](https://github.com/daostack/client/blob/3edf873/src/genesisProtocol.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [IGenesisProtocolParams](interfaces/igenesisprotocolparams.md) |

**Returns:** *object*

* **activationTime**: *number* =  Number(params.activationTime)

* **boostedVotePeriodLimit**: *number* =  Number(params.boostedVotePeriodLimit)

* **daoBountyConst**: *number* =  Number(params.daoBountyConst)

* **limitExponentValue**: *number* =  Number(params.limitExponentValue)

* **minimumDaoBounty**: *any* =  new BN(params.minimumDaoBounty)

* **preBoostedVotePeriodLimit**: *number* =  Number(params.preBoostedVotePeriodLimit)

* **proposingRepReward**: *any* =  new BN(params.proposingRepReward)

* **queuedVotePeriodLimit**: *number* =  Number(params.queuedVotePeriodLimit)

* **queuedVoteRequiredPercentage**: *number* =  Number(params.queuedVoteRequiredPercentage)

* **quietEndingPeriod**: *number* =  Number(params.quietEndingPeriod)

* **thresholdConst**: *number* =  realMathToNumber(new BN(params.thresholdConst))

* **votersReputationLossRatio**: *number* =  Number(params.votersReputationLossRatio)

___

###  realMathToNumber

▸ **realMathToNumber**(`t`: any): *number*

*Defined in [utils.ts:147](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L147)*

convert the number representation of RealMath.sol representations to real real numbers

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`t` | any | a BN instance of a real number in the RealMath representation |

**Returns:** *number*

a BN

___

###  sendTransaction

▸ **sendTransaction**<**T**>(`transaction`: any, `mapReceipt`: function, `errorHandler`: function, `context`: [Arc](classes/arc.md)): *[Operation](globals.md#operation)‹T›*

*Defined in [operation.ts:60](https://github.com/daostack/client/blob/3edf873/src/operation.ts#L60)*

send a transaction to the ethereumblockchain, and return a observable of ITransactionUpdatessend
for example:
 sendTransaction(.....).subscribe((txUpdate) => {
   if (txUpdate.state === 'sent' ) { notify("your transaction has been sent, waitin'for it to be mnied") }
   if (txUpdate.state === 'mined'} {
     notify("your transaction has been mined! It was confirmed ${txUpdate.confirmations} times"}
     // and we also ahve the txUpdate.receipt and the txUpdate.result to do stuff with
   }
 })

**`parameter`** transaction A web3 transaction, or an (async) function that returns a transaction

**`parameter`** map A function that takes the receipt of the transaction and returns an object

**`parameter`** errorHandler A function that takes an error, and either returns or throws a more informative Error

**`parameter`** context An instance of Arc

**Type parameters:**

▪ **T**

**Parameters:**

▪ **transaction**: *any*

▪ **mapReceipt**: *function*

▸ (`receipt`: [web3receipt](globals.md#web3receipt)): *T | Promise‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`receipt` | [web3receipt](globals.md#web3receipt) |

▪`Default value`  **errorHandler**: *function*=  (error) => error

▸ (`error`: Error): *Promise‹Error› | Error*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

▪ **context**: *[Arc](classes/arc.md)*

**Returns:** *[Operation](globals.md#operation)‹T›*

An observable with ITransactionUpdate instnces

___

###  toIOperationObservable

▸ **toIOperationObservable**<**T**>(`observable`: Observable‹T›): *[IOperationObservable](interfaces/ioperationobservable.md)‹T›*

*Defined in [operation.ts:168](https://github.com/daostack/client/blob/3edf873/src/operation.ts#L168)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`observable` | Observable‹T› |

**Returns:** *[IOperationObservable](interfaces/ioperationobservable.md)‹T›*

___

###  toWei

▸ **toWei**(`amount`: string | number): *any*

*Defined in [utils.ts:13](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`amount` | string &#124; number |

**Returns:** *any*

___

###  zenToRxjsObservable

▸ **zenToRxjsObservable**(`zenObservable`: ZenObservable‹any›): *any*

*Defined in [utils.ts:76](https://github.com/daostack/client/blob/3edf873/src/utils.ts#L76)*

convert a ZenObservable to an rxjs.Observable

**Parameters:**

Name | Type |
------ | ------ |
`zenObservable` | ZenObservable‹any› |

**Returns:** *any*

an Observable instance

## Object literals

### `Const` IProposalType

### ▪ **IProposalType**: *[ContributionReward](globals.md#contributionreward) | [GenericScheme](globals.md#genericscheme) | [SchemeRegistrarAdd](globals.md#schemeregistraradd) | [SchemeRegistrarEdit](globals.md#schemeregistraredit) | [SchemeRegistrarRemove](globals.md#schemeregistrarremove)*

*Defined in [schemes/contributionReward.ts:33](https://github.com/daostack/client/blob/3edf873/src/schemes/contributionReward.ts#L33)*

*Defined in [schemes/genericScheme.ts:23](https://github.com/daostack/client/blob/3edf873/src/schemes/genericScheme.ts#L23)*

*Defined in [schemes/schemeRegistrar.ts:22](https://github.com/daostack/client/blob/3edf873/src/schemes/schemeRegistrar.ts#L22)*

*Defined in [proposal.ts:22](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L22)*

*Defined in [proposal.ts:28](https://github.com/daostack/client/blob/3edf873/src/proposal.ts#L28)*

###  ContributionReward

• **ContributionReward**: = "ContributionReward"

*Defined in [schemes/contributionReward.ts:34](https://github.com/daostack/client/blob/3edf873/src/schemes/contributionReward.ts#L34)*

###  GenericScheme

• **GenericScheme**: = "GenericScheme"

*Defined in [schemes/genericScheme.ts:24](https://github.com/daostack/client/blob/3edf873/src/schemes/genericScheme.ts#L24)*

###  SchemeRegistrarAdd

• **SchemeRegistrarAdd**: = "SchemeRegistrarAdd"

*Defined in [schemes/schemeRegistrar.ts:23](https://github.com/daostack/client/blob/3edf873/src/schemes/schemeRegistrar.ts#L23)*

###  SchemeRegistrarEdit

• **SchemeRegistrarEdit**: = "SchemeRegistrarEdit"

*Defined in [schemes/schemeRegistrar.ts:24](https://github.com/daostack/client/blob/3edf873/src/schemes/schemeRegistrar.ts#L24)*

###  SchemeRegistrarRemove

• **SchemeRegistrarRemove**: = "SchemeRegistrarRemove"

*Defined in [schemes/schemeRegistrar.ts:25](https://github.com/daostack/client/blob/3edf873/src/schemes/schemeRegistrar.ts#L25)*
