[@daostack/arc.js - v0.2.87](README.md) › [Globals](globals.md)

# @daostack/arc.js - v0.2.87

## Index

### Enumerations

* [IExecutionState](enums/iexecutionstate.md)
* [IProposalOutcome](enums/iproposaloutcome.md)
* [IProposalStage](enums/iproposalstage.md)
* [ITransactionState](enums/itransactionstate.md)
* [ProposalQuerySortOptions](enums/proposalquerysortoptions.md)

### Classes

* [Arc](classes/arc.md)
* [CL4RScheme](classes/cl4rscheme.md)
* [Competition](classes/competition.md)
* [CompetitionScheme](classes/competitionscheme.md)
* [CompetitionSuggestion](classes/competitionsuggestion.md)
* [CompetitionVote](classes/competitionvote.md)
* [DAO](classes/dao.md)
* [Event](classes/event.md)
* [GraphNodeObserver](classes/graphnodeobserver.md)
* [IPFSClient](classes/ipfsclient.md)
* [Member](classes/member.md)
* [Proposal](classes/proposal.md)
* [Queue](classes/queue.md)
* [Reputation](classes/reputation.md)
* [ReputationFromTokenScheme](classes/reputationfromtokenscheme.md)
* [Reward](classes/reward.md)
* [Scheme](classes/scheme.md)
* [SchemeBase](classes/schemebase.md)
* [Stake](classes/stake.md)
* [Tag](classes/tag.md)
* [Token](classes/token.md)
* [Vote](classes/vote.md)

### Interfaces

* [IAllowance](interfaces/iallowance.md)
* [IApolloQueryOptions](interfaces/iapolloqueryoptions.md)
* [IApproval](interfaces/iapproval.md)
* [ICommonQueryOptions](interfaces/icommonqueryoptions.md)
* [ICompetitionProposalState](interfaces/icompetitionproposalstate.md)
* [ICompetitionSuggestionQueryOptions](interfaces/icompetitionsuggestionqueryoptions.md)
* [ICompetitionSuggestionState](interfaces/icompetitionsuggestionstate.md)
* [ICompetitionVoteQueryOptions](interfaces/icompetitionvotequeryoptions.md)
* [ICompetitionVoteState](interfaces/icompetitionvotestate.md)
* [IContractAddresses](interfaces/icontractaddresses.md)
* [IContractInfo](interfaces/icontractinfo.md)
* [IContributionReward](interfaces/icontributionreward.md)
* [IContributionRewardExt](interfaces/icontributionrewardext.md)
* [IContributionRewardExtParams](interfaces/icontributionrewardextparams.md)
* [IContributionRewardParams](interfaces/icontributionrewardparams.md)
* [IDAOQueryOptions](interfaces/idaoqueryoptions.md)
* [IDAOState](interfaces/idaostate.md)
* [IDAOStaticState](interfaces/idaostaticstate.md)
* [IEventQueryOptions](interfaces/ieventqueryoptions.md)
* [IEventState](interfaces/ieventstate.md)
* [IEventStaticState](interfaces/ieventstaticstate.md)
* [IGenericScheme](interfaces/igenericscheme.md)
* [IGenericSchemeInfo](interfaces/igenericschemeinfo.md)
* [IGenericSchemeMultiCall](interfaces/igenericschememulticall.md)
* [IGenericSchemeMultiCallInfo](interfaces/igenericschememulticallinfo.md)
* [IGenericSchemeMultiCallParams](interfaces/igenericschememulticallparams.md)
* [IGenericSchemeParams](interfaces/igenericschemeparams.md)
* [IGenesisProtocolParams](interfaces/igenesisprotocolparams.md)
* [IMemberQueryOptions](interfaces/imemberqueryoptions.md)
* [IMemberState](interfaces/imemberstate.md)
* [IMemberStaticState](interfaces/imemberstaticstate.md)
* [IObservable](interfaces/iobservable.md)
* [IOperationObservable](interfaces/ioperationobservable.md)
* [IProposalBaseCreateOptions](interfaces/iproposalbasecreateoptions.md)
* [IProposalCreateOptionsCR](interfaces/iproposalcreateoptionscr.md)
* [IProposalCreateOptionsCompetition](interfaces/iproposalcreateoptionscompetition.md)
* [IProposalCreateOptionsContributionRewardExt](interfaces/iproposalcreateoptionscontributionrewardext.md)
* [IProposalCreateOptionsGS](interfaces/iproposalcreateoptionsgs.md)
* [IProposalCreateOptionsGSMultiCall](interfaces/iproposalcreateoptionsgsmulticall.md)
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
* [IRewardStaticState](interfaces/irewardstaticstate.md)
* [ISchemeQueryOptions](interfaces/ischemequeryoptions.md)
* [ISchemeRegisterParams](interfaces/ischemeregisterparams.md)
* [ISchemeRegistrar](interfaces/ischemeregistrar.md)
* [ISchemeState](interfaces/ischemestate.md)
* [ISchemeStaticState](interfaces/ischemestaticstate.md)
* [IStakeQueryOptions](interfaces/istakequeryoptions.md)
* [IStakeState](interfaces/istakestate.md)
* [IStakeStaticState](interfaces/istakestaticstate.md)
* [IStateful](interfaces/istateful.md)
* [ITagQueryOptions](interfaces/itagqueryoptions.md)
* [ITagState](interfaces/itagstate.md)
* [ITagStaticState](interfaces/itagstaticstate.md)
* [ITokenQueryOptions](interfaces/itokenqueryoptions.md)
* [ITokenState](interfaces/itokenstate.md)
* [ITransactionUpdate](interfaces/itransactionupdate.md)
* [IUGenericScheme](interfaces/iugenericscheme.md)
* [IUGenericSchemeInfo](interfaces/iugenericschemeinfo.md)
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
* [IProposalType](globals.md#iproposaltype)
* [Operation](globals.md#operation)
* [Web3Provider](globals.md#web3provider)
* [Web3Receipt](globals.md#web3receipt)
* [transactionErrorHandler](globals.md#transactionerrorhandler)
* [web3receipt](globals.md#web3receipt)

### Variables

* [ABI_DIR](globals.md#const-abi_dir)
* [CONTRIBUTION_REWARD_DUMMY_VERSION](globals.md#const-contribution_reward_dummy_version)
* [CT4RRedeemerABI](globals.md#const-ct4rredeemerabi)
* [CT4RRedeemerAddress](globals.md#const-ct4rredeemeraddress)
* [DAOFieldsFragment](globals.md#const-daofieldsfragment)
* [DAOTOKEN_CONTRACT_VERSION](globals.md#const-daotoken_contract_version)
* [DEFAULT_GRAPH_POLL_INTERVAL](globals.md#const-default_graph_poll_interval)
* [FormData](globals.md#const-formdata)
* [NULL_ADDRESS](globals.md#const-null_address)
* [REDEEMER_CONTRACT_VERSIONS](globals.md#const-redeemer_contract_versions)
* [REPUTATION_CONTRACT_VERSION](globals.md#const-reputation_contract_version)
* [Web3](globals.md#const-web3)
* [fetch](globals.md#const-fetch)

### Functions

* [checkWebsocket](globals.md#checkwebsocket)
* [concat](globals.md#concat)
* [createApolloClient](globals.md#createapolloclient)
* [createGraphQlQuery](globals.md#creategraphqlquery)
* [createGraphQlWhereQuery](globals.md#creategraphqlwherequery)
* [createProposal](globals.md#createproposal)
* [createTransaction](globals.md#createtransaction)
* [createTransactionMap](globals.md#createtransactionmap)
* [dateToSecondsSinceEpoch](globals.md#datetosecondssinceepoch)
* [eventId](globals.md#eventid)
* [fromWei](globals.md#fromwei)
* [getBlockTime](globals.md#getblocktime)
* [getCompetitionContract](globals.md#getcompetitioncontract)
* [hasCompetitionContract](globals.md#hascompetitioncontract)
* [hexStringToUint8Array](globals.md#hexstringtouint8array)
* [isAddress](globals.md#isaddress)
* [isCompetitionScheme](globals.md#iscompetitionscheme)
* [mapGenesisProtocolParams](globals.md#mapgenesisprotocolparams)
* [realMathToBN](globals.md#realmathtobn)
* [realMathToNumber](globals.md#realmathtonumber)
* [secondSinceEpochToDate](globals.md#secondsinceepochtodate)
* [sendTransaction](globals.md#sendtransaction)
* [toIOperationObservable](globals.md#toioperationobservable)
* [toWei](globals.md#towei)
* [zenToRxjsObservable](globals.md#zentorxjsobservable)

### Object literals

* [IProposalType](globals.md#const-iproposaltype)

## Type aliases

###  Address

Ƭ **Address**: *string*

*Defined in [src/types.ts:4](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/types.ts#L4)*

___

###  Date

Ƭ **Date**: *number*

*Defined in [src/types.ts:5](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/types.ts#L5)*

___

###  EthereumEvent

Ƭ **EthereumEvent**: *any*

*Defined in [src/utils.ts:59](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L59)*

___

###  Hash

Ƭ **Hash**: *string*

*Defined in [src/types.ts:6](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/types.ts#L6)*

___

###  IPFSProvider

Ƭ **IPFSProvider**: *string*

*Defined in [src/types.ts:9](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/types.ts#L9)*

___

###  IProposalCreateOptions

Ƭ **IProposalCreateOptions**: *[IProposalBaseCreateOptions](interfaces/iproposalbasecreateoptions.md) & [IProposalCreateOptionsGS](interfaces/iproposalcreateoptionsgs.md) | [IProposalBaseCreateOptions](interfaces/iproposalbasecreateoptions.md) & [IProposalCreateOptionsGSMultiCall](interfaces/iproposalcreateoptionsgsmulticall.md) | [IProposalBaseCreateOptions](interfaces/iproposalbasecreateoptions.md) & [IProposalCreateOptionsSR](interfaces/iproposalcreateoptionssr.md) | [IProposalBaseCreateOptions](interfaces/iproposalbasecreateoptions.md) & [IProposalCreateOptionsCR](interfaces/iproposalcreateoptionscr.md) | [IProposalCreateOptionsContributionRewardExt](interfaces/iproposalcreateoptionscontributionrewardext.md) | [IProposalCreateOptionsCompetition](interfaces/iproposalcreateoptionscompetition.md)*

*Defined in [src/proposal.ts:1025](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L1025)*

___

###  IProposalType

Ƭ **IProposalType**: *[ContributionReward](globals.md#contributionreward) | [GenericScheme](globals.md#genericscheme) | [GenericSchemeMultiCall](globals.md#genericschememulticall) | [SchemeRegistrarAdd](globals.md#schemeregistraradd) | [SchemeRegistrarEdit](globals.md#schemeregistraredit) | [SchemeRegistrarRemove](globals.md#schemeregistrarremove)*

*Defined in [src/proposal.ts:35](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L35)*

___

###  Operation

Ƭ **Operation**: *[IOperationObservable](interfaces/ioperationobservable.md)‹[ITransactionUpdate](interfaces/itransactionupdate.md)‹T››*

*Defined in [src/operation.ts:38](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L38)*

___

###  Web3Provider

Ƭ **Web3Provider**: *string | object*

*Defined in [src/types.ts:8](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/types.ts#L8)*

___

###  Web3Receipt

Ƭ **Web3Receipt**: *any*

*Defined in [src/types.ts:7](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/types.ts#L7)*

___

###  transactionErrorHandler

Ƭ **transactionErrorHandler**: *function*

*Defined in [src/operation.ts:42](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L42)*

#### Type declaration:

▸ (`error`: Error, `transaction?`: any, `options?`: undefined | object): *Promise‹Error› | Error*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |
`transaction?` | any |
`options?` | undefined &#124; object |

___

###  web3receipt

Ƭ **web3receipt**: *object*

*Defined in [src/operation.ts:40](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L40)*

## Variables

### `Const` ABI_DIR

• **ABI_DIR**: *"./abis"* = "./abis"

*Defined in [src/settings.ts:15](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/settings.ts#L15)*

___

### `Const` CONTRIBUTION_REWARD_DUMMY_VERSION

• **CONTRIBUTION_REWARD_DUMMY_VERSION**: *"0.0.1-rc.44"* = "0.0.1-rc.44"

*Defined in [src/settings.ts:12](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/settings.ts#L12)*

___

### `Const` CT4RRedeemerABI

• **CT4RRedeemerABI**: *object[]* =  [
    {
      constant: false,
      inputs: [
        {
          internalType: 'contract ContinuousLocking4Reputation',
          name: 'clt4Reputation',
          type: 'address'
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256'
            }
          ],
          internalType: 'struct NectarReputationRedeemer.Redeem[]',
          name: 'clt4rRedeems',
          type: 'tuple[]'
        }
      ],
      name: 'redeemContinuousLocking4Reputation',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ]

*Defined in [src/schemes/cl4rep.ts:19](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L19)*

___

### `Const` CT4RRedeemerAddress

• **CT4RRedeemerAddress**: *"0x829BDfd41d517f57E5eBf13AD0E181351cb16a96"* = "0x829BDfd41d517f57E5eBf13AD0E181351cb16a96"

*Defined in [src/schemes/cl4rep.ts:17](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L17)*

___

### `Const` DAOFieldsFragment

• **DAOFieldsFragment**: *DocumentNode* =  gql`
  fragment DAOFields on DAO {
    id
    name
    nativeReputation { id, totalSupply }
    nativeToken { id, name, symbol, totalSupply }
    numberOfQueuedProposals
    numberOfPreBoostedProposals
    numberOfBoostedProposals
    register
    reputationHoldersCount
}`

*Defined in [src/dao.ts:49](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/dao.ts#L49)*

___

### `Const` DAOTOKEN_CONTRACT_VERSION

• **DAOTOKEN_CONTRACT_VERSION**: *"0.0.1-rc.19"* = "0.0.1-rc.19"

*Defined in [src/settings.ts:10](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/settings.ts#L10)*

___

### `Const` DEFAULT_GRAPH_POLL_INTERVAL

• **DEFAULT_GRAPH_POLL_INTERVAL**: *number* = 15000

*Defined in [src/graphnode.ts:29](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L29)*

___

### `Const` FormData

• **FormData**: *any* =  require('form-data')

*Defined in [src/ipfsClient.ts:1](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/ipfsClient.ts#L1)*

___

### `Const` NULL_ADDRESS

• **NULL_ADDRESS**: *"0x0000000000000000000000000000000000000000"* = "0x0000000000000000000000000000000000000000"

*Defined in [src/utils.ts:103](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L103)*

___

### `Const` REDEEMER_CONTRACT_VERSIONS

• **REDEEMER_CONTRACT_VERSIONS**: *string[]* =  [
  '0.0.1-rc.44',
  '0.0.1-rc.37',
  '0.0.1-rc.36'
]

*Defined in [src/settings.ts:3](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/settings.ts#L3)*

___

### `Const` REPUTATION_CONTRACT_VERSION

• **REPUTATION_CONTRACT_VERSION**: *"0.0.1-rc.19"* = "0.0.1-rc.19"

*Defined in [src/settings.ts:9](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/settings.ts#L9)*

___

### `Const` Web3

• **Web3**: *any* =  require('web3')

*Defined in [src/utils.ts:5](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L5)*

*Defined in [src/schemes/competition.ts:22](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L22)*

*Defined in [src/arc.ts:21](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L21)*

___

### `Const` fetch

• **fetch**: *any* =  require('isomorphic-fetch')

*Defined in [src/ipfsClient.ts:2](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/ipfsClient.ts#L2)*

## Functions

###  checkWebsocket

▸ **checkWebsocket**(`options`: object): *void*

*Defined in [src/utils.ts:16](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L16)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`url` | string |

**Returns:** *void*

___

###  concat

▸ **concat**(`a`: Uint8Array, `b`: Uint8Array): *Uint8Array*

*Defined in [src/utils.ts:47](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | Uint8Array |
`b` | Uint8Array |

**Returns:** *Uint8Array*

___

###  createApolloClient

▸ **createApolloClient**(`options`: object): *ApolloClient‹NormalizedCacheObject›*

*Defined in [src/graphnode.ts:31](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L31)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`errHandler?` | undefined &#124; function |
`graphqlHttpProvider` | string |
`graphqlWsProvider` | string |
`prefetchHook?` | undefined &#124; function |
`retryLink?` | any |

**Returns:** *ApolloClient‹NormalizedCacheObject›*

___

###  createGraphQlQuery

▸ **createGraphQlQuery**(`options`: [ICommonQueryOptions](interfaces/icommonqueryoptions.md), `where`: string): *string*

*Defined in [src/utils.ts:115](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L115)*

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

###  createGraphQlWhereQuery

▸ **createGraphQlWhereQuery**(`where?`: undefined | object): *string*

*Defined in [src/utils.ts:145](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`where?` | undefined &#124; object |

**Returns:** *string*

___

###  createProposal

▸ **createProposal**(`options`: any, `context`: [Arc](classes/arc.md)): *(Anonymous function)*

*Defined in [src/schemes/contributionReward.ts:41](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/contributionReward.ts#L41)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | any | - |
`context` | [Arc](classes/arc.md) |   |

**Returns:** *(Anonymous function)*

___

###  createTransaction

▸ **createTransaction**(`options`: any, `context`: [Arc](classes/arc.md)): *(Anonymous function)*

*Defined in [src/schemes/genericScheme.ts:30](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/genericScheme.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |
`context` | [Arc](classes/arc.md) |

**Returns:** *(Anonymous function)*

___

###  createTransactionMap

▸ **createTransactionMap**(`options`: any, `context`: [Arc](classes/arc.md)): *map*

*Defined in [src/schemes/contributionReward.ts:65](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/contributionReward.ts#L65)*

map the transaction receipt of the createTransaction call to a nice result
map the transaction receipt of the createTransaction call to a nice result
map the transaction receipt of the createTransaction call to a nice result
map the transaction receipt of the createTransaction call to a nice result
map the transaction receipt of the createTransaction call to a nice result

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | any | the options passed to the createProposal call |
`context` | [Arc](classes/arc.md) | an Arc instance |

**Returns:** *map*

___

###  dateToSecondsSinceEpoch

▸ **dateToSecondsSinceEpoch**(`date`: Date): *number*

*Defined in [src/utils.ts:170](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L170)*

**Parameters:**

Name | Type |
------ | ------ |
`date` | Date |

**Returns:** *number*

___

###  eventId

▸ **eventId**(`event`: [EthereumEvent](globals.md#ethereumevent)): *string*

*Defined in [src/utils.ts:61](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [EthereumEvent](globals.md#ethereumevent) |

**Returns:** *string*

___

###  fromWei

▸ **fromWei**(`amount`: BN): *string*

*Defined in [src/utils.ts:8](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`amount` | BN |

**Returns:** *string*

___

###  getBlockTime

▸ **getBlockTime**(`web3`: any): *Promise‹Date›*

*Defined in [src/utils.ts:197](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L197)*

get the latest block time, or the current time, whichver is later

**`export`** 

**Parameters:**

Name | Type |
------ | ------ |
`web3` | any |

**Returns:** *Promise‹Date›*

___

###  getCompetitionContract

▸ **getCompetitionContract**(`schemeState`: [ISchemeState](interfaces/ischemestate.md), `arc`: [Arc](classes/arc.md)): *any*

*Defined in [src/schemes/competition.ts:880](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L880)*

If this scheme is a ContributionREwardExt scheme and if
its rewarder is Competition contract, return that contract

**Parameters:**

Name | Type |
------ | ------ |
`schemeState` | [ISchemeState](interfaces/ischemestate.md) |
`arc` | [Arc](classes/arc.md) |

**Returns:** *any*

A Web3 contract instance

___

###  hasCompetitionContract

▸ **hasCompetitionContract**(`schemeState`: [ISchemeState](interfaces/ischemestate.md), `arc`: [Arc](classes/arc.md)): *boolean*

*Defined in [src/schemes/competition.ts:912](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L912)*

**Parameters:**

Name | Type |
------ | ------ |
`schemeState` | [ISchemeState](interfaces/ischemestate.md) |
`arc` | [Arc](classes/arc.md) |

**Returns:** *boolean*

true if this is a ContributionRewardExt scheme and the rewarder of this scheme is a competition contract

___

###  hexStringToUint8Array

▸ **hexStringToUint8Array**(`hexString`: string): *Uint8Array‹›*

*Defined in [src/utils.ts:38](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`hexString` | string |

**Returns:** *Uint8Array‹›*

___

###  isAddress

▸ **isAddress**(`address`: [Address](globals.md#address)): *void*

*Defined in [src/utils.ts:66](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address](globals.md#address) |

**Returns:** *void*

___

###  isCompetitionScheme

▸ **isCompetitionScheme**(`arc`: [Arc](classes/arc.md), `item`: any): *boolean*

*Defined in [src/schemes/competition.ts:896](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L896)*

**Parameters:**

Name | Type |
------ | ------ |
`arc` | [Arc](classes/arc.md) |
`item` | any |

**Returns:** *boolean*

___

###  mapGenesisProtocolParams

▸ **mapGenesisProtocolParams**(`params`: [IGenesisProtocolParams](interfaces/igenesisprotocolparams.md)): *object*

*Defined in [src/genesisProtocol.ts:19](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/genesisProtocol.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [IGenesisProtocolParams](interfaces/igenesisprotocolparams.md) |

**Returns:** *object*

* **activationTime**: *number* =  Number(params.activationTime)

* **boostedVotePeriodLimit**: *number* =  Number(params.boostedVotePeriodLimit)

* **daoBountyConst**: *number* =  Number(params.daoBountyConst)

* **limitExponentValue**: *number* =  Number(params.limitExponentValue)

* **minimumDaoBounty**: *BN‹›* =  new BN(params.minimumDaoBounty)

* **preBoostedVotePeriodLimit**: *number* =  Number(params.preBoostedVotePeriodLimit)

* **proposingRepReward**: *BN‹›* =  new BN(params.proposingRepReward)

* **queuedVotePeriodLimit**: *number* =  Number(params.queuedVotePeriodLimit)

* **queuedVoteRequiredPercentage**: *number* =  Number(params.queuedVoteRequiredPercentage)

* **quietEndingPeriod**: *number* =  Number(params.quietEndingPeriod)

* **thresholdConst**: *number* =  realMathToNumber(new BN(params.thresholdConst))

* **votersReputationLossRatio**: *number* =  Number(params.votersReputationLossRatio)

___

###  realMathToBN

▸ **realMathToBN**(`t`: BN): *BN*

*Defined in [src/utils.ts:97](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L97)*

**Parameters:**

Name | Type |
------ | ------ |
`t` | BN |

**Returns:** *BN*

___

###  realMathToNumber

▸ **realMathToNumber**(`t`: BN): *number*

*Defined in [src/utils.ts:91](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L91)*

convert the number representation of RealMath.sol representations to real real numbers

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`t` | BN | a BN instance of a real number in the RealMath representation |

**Returns:** *number*

a BN

___

###  secondSinceEpochToDate

▸ **secondSinceEpochToDate**(`seconds`: number): *Date*

*Defined in [src/utils.ts:178](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L178)*

**Parameters:**

Name | Type |
------ | ------ |
`seconds` | number |

**Returns:** *Date*

___

###  sendTransaction

▸ **sendTransaction**‹**T**›(`context`: [Arc](classes/arc.md), `transaction`: any, `mapReceipt`: function, `errorHandler`: [transactionErrorHandler](globals.md#transactionerrorhandler)): *[Operation](globals.md#operation)‹T›*

*Defined in [src/operation.ts:68](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L68)*

 * send a transaction to the ethereumblockchain, and return a observable of ITransactionUpdatessend
for example:
 ```sendTransaction(.....).subscribe((txUpdate) => {
   if (txUpdate.state === 'sent' ) { notify("your transaction has been sent, waitin'for it to be mnied") }
   if (txUpdate.state === 'mined'} {
     notify("your transaction has been mined! It was confirmed ${txUpdate.confirmations} times"}
     // and we also ahve the txUpdate.receipt and the txUpdate.result to do stuff with
   }
 })```

@export
@template T
@param {Arc} context An instance of Arc
@param {*} transaction A Web3 transaction object to send
@param {((receipt: web3receipt) => T | Promise<T>)} mapReceipt A function that takes the receipt of
 the transaction and returns an object
@param {((error: Error, transaction: any, options: { from?: string }) => Promise<Error> | Error)} [errorHandler]
 A function that takes an error, and either returns or throws a more informative Error
 if errorHander is not provided, a default error handler will throw any errors thrown by calling `transaction.call()`
@returns {Operation<T>}

**Type parameters:**

▪ **T**

**Parameters:**

▪ **context**: *[Arc](classes/arc.md)*

▪ **transaction**: *any*

▪ **mapReceipt**: *function*

▸ (`receipt`: [web3receipt](globals.md#web3receipt)): *T | Promise‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`receipt` | [web3receipt](globals.md#web3receipt) |

▪`Default value`  **errorHandler**: *[transactionErrorHandler](globals.md#transactionerrorhandler)*=  async (err: Error, tx: any = transaction, options: { from?: string} = {}) => {
      await tx.call(options)
      throw err
    }

**Returns:** *[Operation](globals.md#operation)‹T›*

___

###  toIOperationObservable

▸ **toIOperationObservable**‹**T**›(`observable`: Observable‹T›): *[IOperationObservable](interfaces/ioperationobservable.md)‹T›*

*Defined in [src/operation.ts:201](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L201)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`observable` | Observable‹T› |

**Returns:** *[IOperationObservable](interfaces/ioperationobservable.md)‹T›*

___

###  toWei

▸ **toWei**(`amount`: string | number): *BN*

*Defined in [src/utils.ts:12](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`amount` | string &#124; number |

**Returns:** *BN*

___

###  zenToRxjsObservable

▸ **zenToRxjsObservable**(`zenObservable`: ZenObservable‹any›): *any*

*Defined in [src/utils.ts:80](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/utils.ts#L80)*

convert a ZenObservable to an rxjs.Observable

**Parameters:**

Name | Type |
------ | ------ |
`zenObservable` | ZenObservable‹any› |

**Returns:** *any*

an Observable instance

## Object literals

### `Const` IProposalType

### ▪ **IProposalType**: *object*

*Defined in [src/schemes/contributionReward.ts:37](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/contributionReward.ts#L37)*

*Defined in [src/schemes/contributionRewardExt.ts:37](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/contributionRewardExt.ts#L37)*

*Defined in [src/schemes/genericScheme.ts:26](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/genericScheme.ts#L26)*

*Defined in [src/schemes/genericSchemeMultiCall.ts:28](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/genericSchemeMultiCall.ts#L28)*

*Defined in [src/schemes/schemeRegistrar.ts:22](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/schemeRegistrar.ts#L22)*

*Defined in [src/schemes/uGenericScheme.ts:24](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/uGenericScheme.ts#L24)*

*Defined in [src/proposal.ts:28](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L28)*

###  ContributionReward

• **ContributionReward**: = "ContributionRewardExt"

*Defined in [src/schemes/contributionReward.ts:38](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/contributionReward.ts#L38)*

*Defined in [src/schemes/contributionRewardExt.ts:38](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/contributionRewardExt.ts#L38)*

###  GenericScheme

• **GenericScheme**: = "UGenericScheme"

*Defined in [src/schemes/genericScheme.ts:27](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/genericScheme.ts#L27)*

*Defined in [src/schemes/uGenericScheme.ts:25](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/uGenericScheme.ts#L25)*

###  GenericSchemeMultiCall

• **GenericSchemeMultiCall**: = "GenericSchemeMultiCall"

*Defined in [src/schemes/genericSchemeMultiCall.ts:29](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/genericSchemeMultiCall.ts#L29)*

###  SchemeRegistrarAdd

• **SchemeRegistrarAdd**: = "SchemeRegistrarAdd"

*Defined in [src/schemes/schemeRegistrar.ts:23](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/schemeRegistrar.ts#L23)*

###  SchemeRegistrarEdit

• **SchemeRegistrarEdit**: = "SchemeRegistrarEdit"

*Defined in [src/schemes/schemeRegistrar.ts:24](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/schemeRegistrar.ts#L24)*

###  SchemeRegistrarRemove

• **SchemeRegistrarRemove**: = "SchemeRegistrarRemove"

*Defined in [src/schemes/schemeRegistrar.ts:25](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/schemeRegistrar.ts#L25)*
