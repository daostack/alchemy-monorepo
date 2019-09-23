export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Bytes: any,
  BigInt: any,
  BigDecimal: any,
};

export type Allowance = {
   __typename?: 'Allowance',
  id: Scalars['ID'],
  token: Scalars['Bytes'],
  owner: Scalars['Bytes'],
  spender: Scalars['Bytes'],
  amount: Scalars['BigInt'],
};

export type Allowance_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  token?: Maybe<Scalars['Bytes']>,
  token_not?: Maybe<Scalars['Bytes']>,
  token_in?: Maybe<Array<Scalars['Bytes']>>,
  token_not_in?: Maybe<Array<Scalars['Bytes']>>,
  token_contains?: Maybe<Scalars['Bytes']>,
  token_not_contains?: Maybe<Scalars['Bytes']>,
  owner?: Maybe<Scalars['Bytes']>,
  owner_not?: Maybe<Scalars['Bytes']>,
  owner_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_contains?: Maybe<Scalars['Bytes']>,
  owner_not_contains?: Maybe<Scalars['Bytes']>,
  spender?: Maybe<Scalars['Bytes']>,
  spender_not?: Maybe<Scalars['Bytes']>,
  spender_in?: Maybe<Array<Scalars['Bytes']>>,
  spender_not_in?: Maybe<Array<Scalars['Bytes']>>,
  spender_contains?: Maybe<Scalars['Bytes']>,
  spender_not_contains?: Maybe<Scalars['Bytes']>,
  amount?: Maybe<Scalars['BigInt']>,
  amount_not?: Maybe<Scalars['BigInt']>,
  amount_gt?: Maybe<Scalars['BigInt']>,
  amount_lt?: Maybe<Scalars['BigInt']>,
  amount_gte?: Maybe<Scalars['BigInt']>,
  amount_lte?: Maybe<Scalars['BigInt']>,
  amount_in?: Maybe<Array<Scalars['BigInt']>>,
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum Allowance_OrderBy {
  Id = 'id',
  Token = 'token',
  Owner = 'owner',
  Spender = 'spender',
  Amount = 'amount'
}

export type AvatarContract = {
   __typename?: 'AvatarContract',
  id: Scalars['ID'],
  address: Scalars['Bytes'],
  name: Scalars['String'],
  nativeToken: Scalars['Bytes'],
  nativeReputation: Scalars['Bytes'],
  balance: Scalars['BigInt'],
  owner: Scalars['Bytes'],
};

export type AvatarContract_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  name?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_lt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_contains?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
  nativeToken?: Maybe<Scalars['Bytes']>,
  nativeToken_not?: Maybe<Scalars['Bytes']>,
  nativeToken_in?: Maybe<Array<Scalars['Bytes']>>,
  nativeToken_not_in?: Maybe<Array<Scalars['Bytes']>>,
  nativeToken_contains?: Maybe<Scalars['Bytes']>,
  nativeToken_not_contains?: Maybe<Scalars['Bytes']>,
  nativeReputation?: Maybe<Scalars['Bytes']>,
  nativeReputation_not?: Maybe<Scalars['Bytes']>,
  nativeReputation_in?: Maybe<Array<Scalars['Bytes']>>,
  nativeReputation_not_in?: Maybe<Array<Scalars['Bytes']>>,
  nativeReputation_contains?: Maybe<Scalars['Bytes']>,
  nativeReputation_not_contains?: Maybe<Scalars['Bytes']>,
  balance?: Maybe<Scalars['BigInt']>,
  balance_not?: Maybe<Scalars['BigInt']>,
  balance_gt?: Maybe<Scalars['BigInt']>,
  balance_lt?: Maybe<Scalars['BigInt']>,
  balance_gte?: Maybe<Scalars['BigInt']>,
  balance_lte?: Maybe<Scalars['BigInt']>,
  balance_in?: Maybe<Array<Scalars['BigInt']>>,
  balance_not_in?: Maybe<Array<Scalars['BigInt']>>,
  owner?: Maybe<Scalars['Bytes']>,
  owner_not?: Maybe<Scalars['Bytes']>,
  owner_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_contains?: Maybe<Scalars['Bytes']>,
  owner_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum AvatarContract_OrderBy {
  Id = 'id',
  Address = 'address',
  Name = 'name',
  NativeToken = 'nativeToken',
  NativeReputation = 'nativeReputation',
  Balance = 'balance',
  Owner = 'owner'
}




export type ContractInfo = {
   __typename?: 'ContractInfo',
  id: Scalars['ID'],
  name: Scalars['String'],
  version: Scalars['String'],
  address: Scalars['Bytes'],
};

export type ContractInfo_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  name?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_lt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_contains?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
  version?: Maybe<Scalars['String']>,
  version_not?: Maybe<Scalars['String']>,
  version_gt?: Maybe<Scalars['String']>,
  version_lt?: Maybe<Scalars['String']>,
  version_gte?: Maybe<Scalars['String']>,
  version_lte?: Maybe<Scalars['String']>,
  version_in?: Maybe<Array<Scalars['String']>>,
  version_not_in?: Maybe<Array<Scalars['String']>>,
  version_contains?: Maybe<Scalars['String']>,
  version_not_contains?: Maybe<Scalars['String']>,
  version_starts_with?: Maybe<Scalars['String']>,
  version_not_starts_with?: Maybe<Scalars['String']>,
  version_ends_with?: Maybe<Scalars['String']>,
  version_not_ends_with?: Maybe<Scalars['String']>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum ContractInfo_OrderBy {
  Id = 'id',
  Name = 'name',
  Version = 'version',
  Address = 'address'
}

export type ContributionRewardNewContributionProposal = {
   __typename?: 'ContributionRewardNewContributionProposal',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  beneficiary: Scalars['Bytes'],
  descriptionHash: Scalars['String'],
  externalToken: Scalars['Bytes'],
  votingMachine: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  reputationReward: Scalars['BigInt'],
  nativeTokenReward: Scalars['BigInt'],
  ethReward: Scalars['BigInt'],
  externalTokenReward: Scalars['BigInt'],
  periods: Scalars['BigInt'],
  periodLength: Scalars['BigInt'],
};

export type ContributionRewardNewContributionProposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  beneficiary?: Maybe<Scalars['Bytes']>,
  beneficiary_not?: Maybe<Scalars['Bytes']>,
  beneficiary_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_not_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_contains?: Maybe<Scalars['Bytes']>,
  beneficiary_not_contains?: Maybe<Scalars['Bytes']>,
  descriptionHash?: Maybe<Scalars['String']>,
  descriptionHash_not?: Maybe<Scalars['String']>,
  descriptionHash_gt?: Maybe<Scalars['String']>,
  descriptionHash_lt?: Maybe<Scalars['String']>,
  descriptionHash_gte?: Maybe<Scalars['String']>,
  descriptionHash_lte?: Maybe<Scalars['String']>,
  descriptionHash_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_not_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_contains?: Maybe<Scalars['String']>,
  descriptionHash_not_contains?: Maybe<Scalars['String']>,
  descriptionHash_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_not_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_ends_with?: Maybe<Scalars['String']>,
  descriptionHash_not_ends_with?: Maybe<Scalars['String']>,
  externalToken?: Maybe<Scalars['Bytes']>,
  externalToken_not?: Maybe<Scalars['Bytes']>,
  externalToken_in?: Maybe<Array<Scalars['Bytes']>>,
  externalToken_not_in?: Maybe<Array<Scalars['Bytes']>>,
  externalToken_contains?: Maybe<Scalars['Bytes']>,
  externalToken_not_contains?: Maybe<Scalars['Bytes']>,
  votingMachine?: Maybe<Scalars['Bytes']>,
  votingMachine_not?: Maybe<Scalars['Bytes']>,
  votingMachine_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_not_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_contains?: Maybe<Scalars['Bytes']>,
  votingMachine_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  reputationReward?: Maybe<Scalars['BigInt']>,
  reputationReward_not?: Maybe<Scalars['BigInt']>,
  reputationReward_gt?: Maybe<Scalars['BigInt']>,
  reputationReward_lt?: Maybe<Scalars['BigInt']>,
  reputationReward_gte?: Maybe<Scalars['BigInt']>,
  reputationReward_lte?: Maybe<Scalars['BigInt']>,
  reputationReward_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationReward_not_in?: Maybe<Array<Scalars['BigInt']>>,
  nativeTokenReward?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_not?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_gt?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_lt?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_gte?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_lte?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_in?: Maybe<Array<Scalars['BigInt']>>,
  nativeTokenReward_not_in?: Maybe<Array<Scalars['BigInt']>>,
  ethReward?: Maybe<Scalars['BigInt']>,
  ethReward_not?: Maybe<Scalars['BigInt']>,
  ethReward_gt?: Maybe<Scalars['BigInt']>,
  ethReward_lt?: Maybe<Scalars['BigInt']>,
  ethReward_gte?: Maybe<Scalars['BigInt']>,
  ethReward_lte?: Maybe<Scalars['BigInt']>,
  ethReward_in?: Maybe<Array<Scalars['BigInt']>>,
  ethReward_not_in?: Maybe<Array<Scalars['BigInt']>>,
  externalTokenReward?: Maybe<Scalars['BigInt']>,
  externalTokenReward_not?: Maybe<Scalars['BigInt']>,
  externalTokenReward_gt?: Maybe<Scalars['BigInt']>,
  externalTokenReward_lt?: Maybe<Scalars['BigInt']>,
  externalTokenReward_gte?: Maybe<Scalars['BigInt']>,
  externalTokenReward_lte?: Maybe<Scalars['BigInt']>,
  externalTokenReward_in?: Maybe<Array<Scalars['BigInt']>>,
  externalTokenReward_not_in?: Maybe<Array<Scalars['BigInt']>>,
  periods?: Maybe<Scalars['BigInt']>,
  periods_not?: Maybe<Scalars['BigInt']>,
  periods_gt?: Maybe<Scalars['BigInt']>,
  periods_lt?: Maybe<Scalars['BigInt']>,
  periods_gte?: Maybe<Scalars['BigInt']>,
  periods_lte?: Maybe<Scalars['BigInt']>,
  periods_in?: Maybe<Array<Scalars['BigInt']>>,
  periods_not_in?: Maybe<Array<Scalars['BigInt']>>,
  periodLength?: Maybe<Scalars['BigInt']>,
  periodLength_not?: Maybe<Scalars['BigInt']>,
  periodLength_gt?: Maybe<Scalars['BigInt']>,
  periodLength_lt?: Maybe<Scalars['BigInt']>,
  periodLength_gte?: Maybe<Scalars['BigInt']>,
  periodLength_lte?: Maybe<Scalars['BigInt']>,
  periodLength_in?: Maybe<Array<Scalars['BigInt']>>,
  periodLength_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ContributionRewardNewContributionProposal_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Avatar = 'avatar',
  Beneficiary = 'beneficiary',
  DescriptionHash = 'descriptionHash',
  ExternalToken = 'externalToken',
  VotingMachine = 'votingMachine',
  ProposalId = 'proposalId',
  ReputationReward = 'reputationReward',
  NativeTokenReward = 'nativeTokenReward',
  EthReward = 'ethReward',
  ExternalTokenReward = 'externalTokenReward',
  Periods = 'periods',
  PeriodLength = 'periodLength'
}

export type ContributionRewardParam = {
   __typename?: 'ContributionRewardParam',
  id: Scalars['ID'],
  votingMachine: Scalars['Bytes'],
  voteParams: GenesisProtocolParam,
};

export type ContributionRewardParam_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  votingMachine?: Maybe<Scalars['Bytes']>,
  votingMachine_not?: Maybe<Scalars['Bytes']>,
  votingMachine_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_not_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_contains?: Maybe<Scalars['Bytes']>,
  votingMachine_not_contains?: Maybe<Scalars['Bytes']>,
  voteParams?: Maybe<Scalars['String']>,
  voteParams_not?: Maybe<Scalars['String']>,
  voteParams_gt?: Maybe<Scalars['String']>,
  voteParams_lt?: Maybe<Scalars['String']>,
  voteParams_gte?: Maybe<Scalars['String']>,
  voteParams_lte?: Maybe<Scalars['String']>,
  voteParams_in?: Maybe<Array<Scalars['String']>>,
  voteParams_not_in?: Maybe<Array<Scalars['String']>>,
  voteParams_contains?: Maybe<Scalars['String']>,
  voteParams_not_contains?: Maybe<Scalars['String']>,
  voteParams_starts_with?: Maybe<Scalars['String']>,
  voteParams_not_starts_with?: Maybe<Scalars['String']>,
  voteParams_ends_with?: Maybe<Scalars['String']>,
  voteParams_not_ends_with?: Maybe<Scalars['String']>,
};

export enum ContributionRewardParam_OrderBy {
  Id = 'id',
  VotingMachine = 'votingMachine',
  VoteParams = 'voteParams'
}

export type ContributionRewardProposal = {
   __typename?: 'ContributionRewardProposal',
  id: Scalars['ID'],
  proposalId: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  beneficiary: Scalars['Bytes'],
  descriptionHash: Scalars['String'],
  externalToken: Scalars['Bytes'],
  votingMachine: Scalars['Bytes'],
  reputationReward: Scalars['BigInt'],
  nativeTokenReward: Scalars['BigInt'],
  ethReward: Scalars['BigInt'],
  externalTokenReward: Scalars['BigInt'],
  periods: Scalars['BigInt'],
  periodLength: Scalars['BigInt'],
  executedAt?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedReputationPeriods?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedNativeTokenPeriods?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedEthPeriods?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedExternalTokenPeriods?: Maybe<Scalars['BigInt']>,
};

export type ContributionRewardProposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  beneficiary?: Maybe<Scalars['Bytes']>,
  beneficiary_not?: Maybe<Scalars['Bytes']>,
  beneficiary_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_not_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_contains?: Maybe<Scalars['Bytes']>,
  beneficiary_not_contains?: Maybe<Scalars['Bytes']>,
  descriptionHash?: Maybe<Scalars['String']>,
  descriptionHash_not?: Maybe<Scalars['String']>,
  descriptionHash_gt?: Maybe<Scalars['String']>,
  descriptionHash_lt?: Maybe<Scalars['String']>,
  descriptionHash_gte?: Maybe<Scalars['String']>,
  descriptionHash_lte?: Maybe<Scalars['String']>,
  descriptionHash_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_not_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_contains?: Maybe<Scalars['String']>,
  descriptionHash_not_contains?: Maybe<Scalars['String']>,
  descriptionHash_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_not_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_ends_with?: Maybe<Scalars['String']>,
  descriptionHash_not_ends_with?: Maybe<Scalars['String']>,
  externalToken?: Maybe<Scalars['Bytes']>,
  externalToken_not?: Maybe<Scalars['Bytes']>,
  externalToken_in?: Maybe<Array<Scalars['Bytes']>>,
  externalToken_not_in?: Maybe<Array<Scalars['Bytes']>>,
  externalToken_contains?: Maybe<Scalars['Bytes']>,
  externalToken_not_contains?: Maybe<Scalars['Bytes']>,
  votingMachine?: Maybe<Scalars['Bytes']>,
  votingMachine_not?: Maybe<Scalars['Bytes']>,
  votingMachine_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_not_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_contains?: Maybe<Scalars['Bytes']>,
  votingMachine_not_contains?: Maybe<Scalars['Bytes']>,
  reputationReward?: Maybe<Scalars['BigInt']>,
  reputationReward_not?: Maybe<Scalars['BigInt']>,
  reputationReward_gt?: Maybe<Scalars['BigInt']>,
  reputationReward_lt?: Maybe<Scalars['BigInt']>,
  reputationReward_gte?: Maybe<Scalars['BigInt']>,
  reputationReward_lte?: Maybe<Scalars['BigInt']>,
  reputationReward_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationReward_not_in?: Maybe<Array<Scalars['BigInt']>>,
  nativeTokenReward?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_not?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_gt?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_lt?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_gte?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_lte?: Maybe<Scalars['BigInt']>,
  nativeTokenReward_in?: Maybe<Array<Scalars['BigInt']>>,
  nativeTokenReward_not_in?: Maybe<Array<Scalars['BigInt']>>,
  ethReward?: Maybe<Scalars['BigInt']>,
  ethReward_not?: Maybe<Scalars['BigInt']>,
  ethReward_gt?: Maybe<Scalars['BigInt']>,
  ethReward_lt?: Maybe<Scalars['BigInt']>,
  ethReward_gte?: Maybe<Scalars['BigInt']>,
  ethReward_lte?: Maybe<Scalars['BigInt']>,
  ethReward_in?: Maybe<Array<Scalars['BigInt']>>,
  ethReward_not_in?: Maybe<Array<Scalars['BigInt']>>,
  externalTokenReward?: Maybe<Scalars['BigInt']>,
  externalTokenReward_not?: Maybe<Scalars['BigInt']>,
  externalTokenReward_gt?: Maybe<Scalars['BigInt']>,
  externalTokenReward_lt?: Maybe<Scalars['BigInt']>,
  externalTokenReward_gte?: Maybe<Scalars['BigInt']>,
  externalTokenReward_lte?: Maybe<Scalars['BigInt']>,
  externalTokenReward_in?: Maybe<Array<Scalars['BigInt']>>,
  externalTokenReward_not_in?: Maybe<Array<Scalars['BigInt']>>,
  periods?: Maybe<Scalars['BigInt']>,
  periods_not?: Maybe<Scalars['BigInt']>,
  periods_gt?: Maybe<Scalars['BigInt']>,
  periods_lt?: Maybe<Scalars['BigInt']>,
  periods_gte?: Maybe<Scalars['BigInt']>,
  periods_lte?: Maybe<Scalars['BigInt']>,
  periods_in?: Maybe<Array<Scalars['BigInt']>>,
  periods_not_in?: Maybe<Array<Scalars['BigInt']>>,
  periodLength?: Maybe<Scalars['BigInt']>,
  periodLength_not?: Maybe<Scalars['BigInt']>,
  periodLength_gt?: Maybe<Scalars['BigInt']>,
  periodLength_lt?: Maybe<Scalars['BigInt']>,
  periodLength_gte?: Maybe<Scalars['BigInt']>,
  periodLength_lte?: Maybe<Scalars['BigInt']>,
  periodLength_in?: Maybe<Array<Scalars['BigInt']>>,
  periodLength_not_in?: Maybe<Array<Scalars['BigInt']>>,
  executedAt?: Maybe<Scalars['BigInt']>,
  executedAt_not?: Maybe<Scalars['BigInt']>,
  executedAt_gt?: Maybe<Scalars['BigInt']>,
  executedAt_lt?: Maybe<Scalars['BigInt']>,
  executedAt_gte?: Maybe<Scalars['BigInt']>,
  executedAt_lte?: Maybe<Scalars['BigInt']>,
  executedAt_in?: Maybe<Array<Scalars['BigInt']>>,
  executedAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  alreadyRedeemedReputationPeriods?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedReputationPeriods_not?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedReputationPeriods_gt?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedReputationPeriods_lt?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedReputationPeriods_gte?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedReputationPeriods_lte?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedReputationPeriods_in?: Maybe<Array<Scalars['BigInt']>>,
  alreadyRedeemedReputationPeriods_not_in?: Maybe<Array<Scalars['BigInt']>>,
  alreadyRedeemedNativeTokenPeriods?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedNativeTokenPeriods_not?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedNativeTokenPeriods_gt?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedNativeTokenPeriods_lt?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedNativeTokenPeriods_gte?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedNativeTokenPeriods_lte?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedNativeTokenPeriods_in?: Maybe<Array<Scalars['BigInt']>>,
  alreadyRedeemedNativeTokenPeriods_not_in?: Maybe<Array<Scalars['BigInt']>>,
  alreadyRedeemedEthPeriods?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedEthPeriods_not?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedEthPeriods_gt?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedEthPeriods_lt?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedEthPeriods_gte?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedEthPeriods_lte?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedEthPeriods_in?: Maybe<Array<Scalars['BigInt']>>,
  alreadyRedeemedEthPeriods_not_in?: Maybe<Array<Scalars['BigInt']>>,
  alreadyRedeemedExternalTokenPeriods?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedExternalTokenPeriods_not?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedExternalTokenPeriods_gt?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedExternalTokenPeriods_lt?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedExternalTokenPeriods_gte?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedExternalTokenPeriods_lte?: Maybe<Scalars['BigInt']>,
  alreadyRedeemedExternalTokenPeriods_in?: Maybe<Array<Scalars['BigInt']>>,
  alreadyRedeemedExternalTokenPeriods_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ContributionRewardProposal_OrderBy {
  Id = 'id',
  ProposalId = 'proposalId',
  Contract = 'contract',
  Avatar = 'avatar',
  Beneficiary = 'beneficiary',
  DescriptionHash = 'descriptionHash',
  ExternalToken = 'externalToken',
  VotingMachine = 'votingMachine',
  ReputationReward = 'reputationReward',
  NativeTokenReward = 'nativeTokenReward',
  EthReward = 'ethReward',
  ExternalTokenReward = 'externalTokenReward',
  Periods = 'periods',
  PeriodLength = 'periodLength',
  ExecutedAt = 'executedAt',
  AlreadyRedeemedReputationPeriods = 'alreadyRedeemedReputationPeriods',
  AlreadyRedeemedNativeTokenPeriods = 'alreadyRedeemedNativeTokenPeriods',
  AlreadyRedeemedEthPeriods = 'alreadyRedeemedEthPeriods',
  AlreadyRedeemedExternalTokenPeriods = 'alreadyRedeemedExternalTokenPeriods'
}

export type ContributionRewardProposalResolved = {
   __typename?: 'ContributionRewardProposalResolved',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  passed?: Maybe<Scalars['Boolean']>,
};

export type ContributionRewardProposalResolved_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  passed?: Maybe<Scalars['Boolean']>,
  passed_not?: Maybe<Scalars['Boolean']>,
  passed_in?: Maybe<Array<Scalars['Boolean']>>,
  passed_not_in?: Maybe<Array<Scalars['Boolean']>>,
};

export enum ContributionRewardProposalResolved_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Avatar = 'avatar',
  ProposalId = 'proposalId',
  Passed = 'passed'
}

export type ContributionRewardRedeemEther = {
   __typename?: 'ContributionRewardRedeemEther',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  beneficiary: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  amount: Scalars['BigInt'],
};

export type ContributionRewardRedeemEther_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  beneficiary?: Maybe<Scalars['Bytes']>,
  beneficiary_not?: Maybe<Scalars['Bytes']>,
  beneficiary_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_not_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_contains?: Maybe<Scalars['Bytes']>,
  beneficiary_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  amount?: Maybe<Scalars['BigInt']>,
  amount_not?: Maybe<Scalars['BigInt']>,
  amount_gt?: Maybe<Scalars['BigInt']>,
  amount_lt?: Maybe<Scalars['BigInt']>,
  amount_gte?: Maybe<Scalars['BigInt']>,
  amount_lte?: Maybe<Scalars['BigInt']>,
  amount_in?: Maybe<Array<Scalars['BigInt']>>,
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ContributionRewardRedeemEther_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Avatar = 'avatar',
  Beneficiary = 'beneficiary',
  ProposalId = 'proposalId',
  Amount = 'amount'
}

export type ContributionRewardRedeemExternalToken = {
   __typename?: 'ContributionRewardRedeemExternalToken',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  beneficiary: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  amount: Scalars['BigInt'],
};

export type ContributionRewardRedeemExternalToken_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  beneficiary?: Maybe<Scalars['Bytes']>,
  beneficiary_not?: Maybe<Scalars['Bytes']>,
  beneficiary_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_not_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_contains?: Maybe<Scalars['Bytes']>,
  beneficiary_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  amount?: Maybe<Scalars['BigInt']>,
  amount_not?: Maybe<Scalars['BigInt']>,
  amount_gt?: Maybe<Scalars['BigInt']>,
  amount_lt?: Maybe<Scalars['BigInt']>,
  amount_gte?: Maybe<Scalars['BigInt']>,
  amount_lte?: Maybe<Scalars['BigInt']>,
  amount_in?: Maybe<Array<Scalars['BigInt']>>,
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ContributionRewardRedeemExternalToken_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Avatar = 'avatar',
  Beneficiary = 'beneficiary',
  ProposalId = 'proposalId',
  Amount = 'amount'
}

export type ContributionRewardRedeemNativeToken = {
   __typename?: 'ContributionRewardRedeemNativeToken',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  beneficiary: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  amount: Scalars['BigInt'],
};

export type ContributionRewardRedeemNativeToken_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  beneficiary?: Maybe<Scalars['Bytes']>,
  beneficiary_not?: Maybe<Scalars['Bytes']>,
  beneficiary_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_not_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_contains?: Maybe<Scalars['Bytes']>,
  beneficiary_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  amount?: Maybe<Scalars['BigInt']>,
  amount_not?: Maybe<Scalars['BigInt']>,
  amount_gt?: Maybe<Scalars['BigInt']>,
  amount_lt?: Maybe<Scalars['BigInt']>,
  amount_gte?: Maybe<Scalars['BigInt']>,
  amount_lte?: Maybe<Scalars['BigInt']>,
  amount_in?: Maybe<Array<Scalars['BigInt']>>,
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ContributionRewardRedeemNativeToken_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Avatar = 'avatar',
  Beneficiary = 'beneficiary',
  ProposalId = 'proposalId',
  Amount = 'amount'
}

export type ContributionRewardRedeemReputation = {
   __typename?: 'ContributionRewardRedeemReputation',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  beneficiary: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  amount: Scalars['BigInt'],
};

export type ContributionRewardRedeemReputation_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  beneficiary?: Maybe<Scalars['Bytes']>,
  beneficiary_not?: Maybe<Scalars['Bytes']>,
  beneficiary_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_not_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_contains?: Maybe<Scalars['Bytes']>,
  beneficiary_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  amount?: Maybe<Scalars['BigInt']>,
  amount_not?: Maybe<Scalars['BigInt']>,
  amount_gt?: Maybe<Scalars['BigInt']>,
  amount_lt?: Maybe<Scalars['BigInt']>,
  amount_gte?: Maybe<Scalars['BigInt']>,
  amount_lte?: Maybe<Scalars['BigInt']>,
  amount_in?: Maybe<Array<Scalars['BigInt']>>,
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ContributionRewardRedeemReputation_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Avatar = 'avatar',
  Beneficiary = 'beneficiary',
  ProposalId = 'proposalId',
  Amount = 'amount'
}

export type ControllerAddGlobalConstraint = {
   __typename?: 'ControllerAddGlobalConstraint',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  globalConstraint: Scalars['Bytes'],
  paramsHash: Scalars['Bytes'],
  type: Scalars['String'],
};

export type ControllerAddGlobalConstraint_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  globalConstraint?: Maybe<Scalars['Bytes']>,
  globalConstraint_not?: Maybe<Scalars['Bytes']>,
  globalConstraint_in?: Maybe<Array<Scalars['Bytes']>>,
  globalConstraint_not_in?: Maybe<Array<Scalars['Bytes']>>,
  globalConstraint_contains?: Maybe<Scalars['Bytes']>,
  globalConstraint_not_contains?: Maybe<Scalars['Bytes']>,
  paramsHash?: Maybe<Scalars['Bytes']>,
  paramsHash_not?: Maybe<Scalars['Bytes']>,
  paramsHash_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_contains?: Maybe<Scalars['Bytes']>,
  paramsHash_not_contains?: Maybe<Scalars['Bytes']>,
  type?: Maybe<Scalars['String']>,
  type_not?: Maybe<Scalars['String']>,
  type_gt?: Maybe<Scalars['String']>,
  type_lt?: Maybe<Scalars['String']>,
  type_gte?: Maybe<Scalars['String']>,
  type_lte?: Maybe<Scalars['String']>,
  type_in?: Maybe<Array<Scalars['String']>>,
  type_not_in?: Maybe<Array<Scalars['String']>>,
  type_contains?: Maybe<Scalars['String']>,
  type_not_contains?: Maybe<Scalars['String']>,
  type_starts_with?: Maybe<Scalars['String']>,
  type_not_starts_with?: Maybe<Scalars['String']>,
  type_ends_with?: Maybe<Scalars['String']>,
  type_not_ends_with?: Maybe<Scalars['String']>,
};

export enum ControllerAddGlobalConstraint_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  GlobalConstraint = 'globalConstraint',
  ParamsHash = 'paramsHash',
  Type = 'type'
}

export type ControllerGlobalConstraint = {
   __typename?: 'ControllerGlobalConstraint',
  id: Scalars['ID'],
  address: Scalars['Bytes'],
  paramsHash: Scalars['Bytes'],
  type: Scalars['String'],
};

export type ControllerGlobalConstraint_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  paramsHash?: Maybe<Scalars['Bytes']>,
  paramsHash_not?: Maybe<Scalars['Bytes']>,
  paramsHash_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_contains?: Maybe<Scalars['Bytes']>,
  paramsHash_not_contains?: Maybe<Scalars['Bytes']>,
  type?: Maybe<Scalars['String']>,
  type_not?: Maybe<Scalars['String']>,
  type_gt?: Maybe<Scalars['String']>,
  type_lt?: Maybe<Scalars['String']>,
  type_gte?: Maybe<Scalars['String']>,
  type_lte?: Maybe<Scalars['String']>,
  type_in?: Maybe<Array<Scalars['String']>>,
  type_not_in?: Maybe<Array<Scalars['String']>>,
  type_contains?: Maybe<Scalars['String']>,
  type_not_contains?: Maybe<Scalars['String']>,
  type_starts_with?: Maybe<Scalars['String']>,
  type_not_starts_with?: Maybe<Scalars['String']>,
  type_ends_with?: Maybe<Scalars['String']>,
  type_not_ends_with?: Maybe<Scalars['String']>,
};

export enum ControllerGlobalConstraint_OrderBy {
  Id = 'id',
  Address = 'address',
  ParamsHash = 'paramsHash',
  Type = 'type'
}

export type ControllerOrganization = {
   __typename?: 'ControllerOrganization',
  id: Scalars['ID'],
  avatarAddress: Scalars['Bytes'],
  nativeToken: TokenContract,
  nativeReputation: ReputationContract,
  controller: Scalars['Bytes'],
};

export type ControllerOrganization_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  nativeToken?: Maybe<Scalars['String']>,
  nativeToken_not?: Maybe<Scalars['String']>,
  nativeToken_gt?: Maybe<Scalars['String']>,
  nativeToken_lt?: Maybe<Scalars['String']>,
  nativeToken_gte?: Maybe<Scalars['String']>,
  nativeToken_lte?: Maybe<Scalars['String']>,
  nativeToken_in?: Maybe<Array<Scalars['String']>>,
  nativeToken_not_in?: Maybe<Array<Scalars['String']>>,
  nativeToken_contains?: Maybe<Scalars['String']>,
  nativeToken_not_contains?: Maybe<Scalars['String']>,
  nativeToken_starts_with?: Maybe<Scalars['String']>,
  nativeToken_not_starts_with?: Maybe<Scalars['String']>,
  nativeToken_ends_with?: Maybe<Scalars['String']>,
  nativeToken_not_ends_with?: Maybe<Scalars['String']>,
  nativeReputation?: Maybe<Scalars['String']>,
  nativeReputation_not?: Maybe<Scalars['String']>,
  nativeReputation_gt?: Maybe<Scalars['String']>,
  nativeReputation_lt?: Maybe<Scalars['String']>,
  nativeReputation_gte?: Maybe<Scalars['String']>,
  nativeReputation_lte?: Maybe<Scalars['String']>,
  nativeReputation_in?: Maybe<Array<Scalars['String']>>,
  nativeReputation_not_in?: Maybe<Array<Scalars['String']>>,
  nativeReputation_contains?: Maybe<Scalars['String']>,
  nativeReputation_not_contains?: Maybe<Scalars['String']>,
  nativeReputation_starts_with?: Maybe<Scalars['String']>,
  nativeReputation_not_starts_with?: Maybe<Scalars['String']>,
  nativeReputation_ends_with?: Maybe<Scalars['String']>,
  nativeReputation_not_ends_with?: Maybe<Scalars['String']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum ControllerOrganization_OrderBy {
  Id = 'id',
  AvatarAddress = 'avatarAddress',
  NativeToken = 'nativeToken',
  NativeReputation = 'nativeReputation',
  Controller = 'controller'
}

export type ControllerRegisterScheme = {
   __typename?: 'ControllerRegisterScheme',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  scheme: Scalars['Bytes'],
};

export type ControllerRegisterScheme_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  scheme?: Maybe<Scalars['Bytes']>,
  scheme_not?: Maybe<Scalars['Bytes']>,
  scheme_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_not_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_contains?: Maybe<Scalars['Bytes']>,
  scheme_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum ControllerRegisterScheme_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  Contract = 'contract',
  Scheme = 'scheme'
}

export type ControllerRemoveGlobalConstraint = {
   __typename?: 'ControllerRemoveGlobalConstraint',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  globalConstraint: Scalars['Bytes'],
  isPre?: Maybe<Scalars['Boolean']>,
};

export type ControllerRemoveGlobalConstraint_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  globalConstraint?: Maybe<Scalars['Bytes']>,
  globalConstraint_not?: Maybe<Scalars['Bytes']>,
  globalConstraint_in?: Maybe<Array<Scalars['Bytes']>>,
  globalConstraint_not_in?: Maybe<Array<Scalars['Bytes']>>,
  globalConstraint_contains?: Maybe<Scalars['Bytes']>,
  globalConstraint_not_contains?: Maybe<Scalars['Bytes']>,
  isPre?: Maybe<Scalars['Boolean']>,
  isPre_not?: Maybe<Scalars['Boolean']>,
  isPre_in?: Maybe<Array<Scalars['Boolean']>>,
  isPre_not_in?: Maybe<Array<Scalars['Boolean']>>,
};

export enum ControllerRemoveGlobalConstraint_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  GlobalConstraint = 'globalConstraint',
  IsPre = 'isPre'
}

export type ControllerScheme = {
   __typename?: 'ControllerScheme',
  id: Scalars['ID'],
  dao: Dao,
  paramsHash: Scalars['Bytes'],
  canRegisterSchemes?: Maybe<Scalars['Boolean']>,
  canManageGlobalConstraints?: Maybe<Scalars['Boolean']>,
  canUpgradeController?: Maybe<Scalars['Boolean']>,
  canDelegateCall?: Maybe<Scalars['Boolean']>,
  gpQueue?: Maybe<GpQueue>,
  address: Scalars['Bytes'],
  name?: Maybe<Scalars['String']>,
  version?: Maybe<Scalars['String']>,
  contributionRewardParams?: Maybe<ContributionRewardParam>,
  schemeRegistrarParams?: Maybe<SchemeRegistrarParam>,
  genericSchemeParams?: Maybe<GenericSchemeParam>,
};

export type ControllerScheme_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  paramsHash?: Maybe<Scalars['Bytes']>,
  paramsHash_not?: Maybe<Scalars['Bytes']>,
  paramsHash_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_contains?: Maybe<Scalars['Bytes']>,
  paramsHash_not_contains?: Maybe<Scalars['Bytes']>,
  canRegisterSchemes?: Maybe<Scalars['Boolean']>,
  canRegisterSchemes_not?: Maybe<Scalars['Boolean']>,
  canRegisterSchemes_in?: Maybe<Array<Scalars['Boolean']>>,
  canRegisterSchemes_not_in?: Maybe<Array<Scalars['Boolean']>>,
  canManageGlobalConstraints?: Maybe<Scalars['Boolean']>,
  canManageGlobalConstraints_not?: Maybe<Scalars['Boolean']>,
  canManageGlobalConstraints_in?: Maybe<Array<Scalars['Boolean']>>,
  canManageGlobalConstraints_not_in?: Maybe<Array<Scalars['Boolean']>>,
  canUpgradeController?: Maybe<Scalars['Boolean']>,
  canUpgradeController_not?: Maybe<Scalars['Boolean']>,
  canUpgradeController_in?: Maybe<Array<Scalars['Boolean']>>,
  canUpgradeController_not_in?: Maybe<Array<Scalars['Boolean']>>,
  canDelegateCall?: Maybe<Scalars['Boolean']>,
  canDelegateCall_not?: Maybe<Scalars['Boolean']>,
  canDelegateCall_in?: Maybe<Array<Scalars['Boolean']>>,
  canDelegateCall_not_in?: Maybe<Array<Scalars['Boolean']>>,
  gpQueue?: Maybe<Scalars['String']>,
  gpQueue_not?: Maybe<Scalars['String']>,
  gpQueue_gt?: Maybe<Scalars['String']>,
  gpQueue_lt?: Maybe<Scalars['String']>,
  gpQueue_gte?: Maybe<Scalars['String']>,
  gpQueue_lte?: Maybe<Scalars['String']>,
  gpQueue_in?: Maybe<Array<Scalars['String']>>,
  gpQueue_not_in?: Maybe<Array<Scalars['String']>>,
  gpQueue_contains?: Maybe<Scalars['String']>,
  gpQueue_not_contains?: Maybe<Scalars['String']>,
  gpQueue_starts_with?: Maybe<Scalars['String']>,
  gpQueue_not_starts_with?: Maybe<Scalars['String']>,
  gpQueue_ends_with?: Maybe<Scalars['String']>,
  gpQueue_not_ends_with?: Maybe<Scalars['String']>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  name?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_lt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_contains?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
  version?: Maybe<Scalars['String']>,
  version_not?: Maybe<Scalars['String']>,
  version_gt?: Maybe<Scalars['String']>,
  version_lt?: Maybe<Scalars['String']>,
  version_gte?: Maybe<Scalars['String']>,
  version_lte?: Maybe<Scalars['String']>,
  version_in?: Maybe<Array<Scalars['String']>>,
  version_not_in?: Maybe<Array<Scalars['String']>>,
  version_contains?: Maybe<Scalars['String']>,
  version_not_contains?: Maybe<Scalars['String']>,
  version_starts_with?: Maybe<Scalars['String']>,
  version_not_starts_with?: Maybe<Scalars['String']>,
  version_ends_with?: Maybe<Scalars['String']>,
  version_not_ends_with?: Maybe<Scalars['String']>,
  contributionRewardParams?: Maybe<Scalars['String']>,
  contributionRewardParams_not?: Maybe<Scalars['String']>,
  contributionRewardParams_gt?: Maybe<Scalars['String']>,
  contributionRewardParams_lt?: Maybe<Scalars['String']>,
  contributionRewardParams_gte?: Maybe<Scalars['String']>,
  contributionRewardParams_lte?: Maybe<Scalars['String']>,
  contributionRewardParams_in?: Maybe<Array<Scalars['String']>>,
  contributionRewardParams_not_in?: Maybe<Array<Scalars['String']>>,
  contributionRewardParams_contains?: Maybe<Scalars['String']>,
  contributionRewardParams_not_contains?: Maybe<Scalars['String']>,
  contributionRewardParams_starts_with?: Maybe<Scalars['String']>,
  contributionRewardParams_not_starts_with?: Maybe<Scalars['String']>,
  contributionRewardParams_ends_with?: Maybe<Scalars['String']>,
  contributionRewardParams_not_ends_with?: Maybe<Scalars['String']>,
  schemeRegistrarParams?: Maybe<Scalars['String']>,
  schemeRegistrarParams_not?: Maybe<Scalars['String']>,
  schemeRegistrarParams_gt?: Maybe<Scalars['String']>,
  schemeRegistrarParams_lt?: Maybe<Scalars['String']>,
  schemeRegistrarParams_gte?: Maybe<Scalars['String']>,
  schemeRegistrarParams_lte?: Maybe<Scalars['String']>,
  schemeRegistrarParams_in?: Maybe<Array<Scalars['String']>>,
  schemeRegistrarParams_not_in?: Maybe<Array<Scalars['String']>>,
  schemeRegistrarParams_contains?: Maybe<Scalars['String']>,
  schemeRegistrarParams_not_contains?: Maybe<Scalars['String']>,
  schemeRegistrarParams_starts_with?: Maybe<Scalars['String']>,
  schemeRegistrarParams_not_starts_with?: Maybe<Scalars['String']>,
  schemeRegistrarParams_ends_with?: Maybe<Scalars['String']>,
  schemeRegistrarParams_not_ends_with?: Maybe<Scalars['String']>,
  genericSchemeParams?: Maybe<Scalars['String']>,
  genericSchemeParams_not?: Maybe<Scalars['String']>,
  genericSchemeParams_gt?: Maybe<Scalars['String']>,
  genericSchemeParams_lt?: Maybe<Scalars['String']>,
  genericSchemeParams_gte?: Maybe<Scalars['String']>,
  genericSchemeParams_lte?: Maybe<Scalars['String']>,
  genericSchemeParams_in?: Maybe<Array<Scalars['String']>>,
  genericSchemeParams_not_in?: Maybe<Array<Scalars['String']>>,
  genericSchemeParams_contains?: Maybe<Scalars['String']>,
  genericSchemeParams_not_contains?: Maybe<Scalars['String']>,
  genericSchemeParams_starts_with?: Maybe<Scalars['String']>,
  genericSchemeParams_not_starts_with?: Maybe<Scalars['String']>,
  genericSchemeParams_ends_with?: Maybe<Scalars['String']>,
  genericSchemeParams_not_ends_with?: Maybe<Scalars['String']>,
};

export enum ControllerScheme_OrderBy {
  Id = 'id',
  Dao = 'dao',
  ParamsHash = 'paramsHash',
  CanRegisterSchemes = 'canRegisterSchemes',
  CanManageGlobalConstraints = 'canManageGlobalConstraints',
  CanUpgradeController = 'canUpgradeController',
  CanDelegateCall = 'canDelegateCall',
  GpQueue = 'gpQueue',
  Address = 'address',
  Name = 'name',
  Version = 'version',
  ContributionRewardParams = 'contributionRewardParams',
  SchemeRegistrarParams = 'schemeRegistrarParams',
  GenericSchemeParams = 'genericSchemeParams'
}

export type ControllerUnregisterScheme = {
   __typename?: 'ControllerUnregisterScheme',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  scheme: Scalars['Bytes'],
};

export type ControllerUnregisterScheme_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  scheme?: Maybe<Scalars['Bytes']>,
  scheme_not?: Maybe<Scalars['Bytes']>,
  scheme_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_not_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_contains?: Maybe<Scalars['Bytes']>,
  scheme_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum ControllerUnregisterScheme_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  Contract = 'contract',
  Scheme = 'scheme'
}

export type ControllerUpgradeController = {
   __typename?: 'ControllerUpgradeController',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  newController: Scalars['Bytes'],
};

export type ControllerUpgradeController_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  newController?: Maybe<Scalars['Bytes']>,
  newController_not?: Maybe<Scalars['Bytes']>,
  newController_in?: Maybe<Array<Scalars['Bytes']>>,
  newController_not_in?: Maybe<Array<Scalars['Bytes']>>,
  newController_contains?: Maybe<Scalars['Bytes']>,
  newController_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum ControllerUpgradeController_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  NewController = 'newController'
}

export type Dao = {
   __typename?: 'DAO',
  id: Scalars['ID'],
  name: Scalars['String'],
  nativeToken: Token,
  nativeReputation: Rep,
  proposals?: Maybe<Array<Proposal>>,
  reputationHolders?: Maybe<Array<ReputationHolder>>,
  reputationHoldersCount: Scalars['BigInt'],
  rewards?: Maybe<Array<GpReward>>,
  register: Scalars['String'],
  schemes?: Maybe<Array<ControllerScheme>>,
  gpQueues?: Maybe<Array<GpQueue>>,
};


export type DaoProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Proposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>
};


export type DaoReputationHoldersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ReputationHolder_OrderBy>,
  orderDirection?: Maybe<OrderDirection>
};


export type DaoRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GpReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>
};


export type DaoSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>
};


export type DaoGpQueuesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GpQueue_OrderBy>,
  orderDirection?: Maybe<OrderDirection>
};

export type Dao_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  name?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_lt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_contains?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
  nativeToken?: Maybe<Scalars['String']>,
  nativeToken_not?: Maybe<Scalars['String']>,
  nativeToken_gt?: Maybe<Scalars['String']>,
  nativeToken_lt?: Maybe<Scalars['String']>,
  nativeToken_gte?: Maybe<Scalars['String']>,
  nativeToken_lte?: Maybe<Scalars['String']>,
  nativeToken_in?: Maybe<Array<Scalars['String']>>,
  nativeToken_not_in?: Maybe<Array<Scalars['String']>>,
  nativeToken_contains?: Maybe<Scalars['String']>,
  nativeToken_not_contains?: Maybe<Scalars['String']>,
  nativeToken_starts_with?: Maybe<Scalars['String']>,
  nativeToken_not_starts_with?: Maybe<Scalars['String']>,
  nativeToken_ends_with?: Maybe<Scalars['String']>,
  nativeToken_not_ends_with?: Maybe<Scalars['String']>,
  nativeReputation?: Maybe<Scalars['String']>,
  nativeReputation_not?: Maybe<Scalars['String']>,
  nativeReputation_gt?: Maybe<Scalars['String']>,
  nativeReputation_lt?: Maybe<Scalars['String']>,
  nativeReputation_gte?: Maybe<Scalars['String']>,
  nativeReputation_lte?: Maybe<Scalars['String']>,
  nativeReputation_in?: Maybe<Array<Scalars['String']>>,
  nativeReputation_not_in?: Maybe<Array<Scalars['String']>>,
  nativeReputation_contains?: Maybe<Scalars['String']>,
  nativeReputation_not_contains?: Maybe<Scalars['String']>,
  nativeReputation_starts_with?: Maybe<Scalars['String']>,
  nativeReputation_not_starts_with?: Maybe<Scalars['String']>,
  nativeReputation_ends_with?: Maybe<Scalars['String']>,
  nativeReputation_not_ends_with?: Maybe<Scalars['String']>,
  reputationHoldersCount?: Maybe<Scalars['BigInt']>,
  reputationHoldersCount_not?: Maybe<Scalars['BigInt']>,
  reputationHoldersCount_gt?: Maybe<Scalars['BigInt']>,
  reputationHoldersCount_lt?: Maybe<Scalars['BigInt']>,
  reputationHoldersCount_gte?: Maybe<Scalars['BigInt']>,
  reputationHoldersCount_lte?: Maybe<Scalars['BigInt']>,
  reputationHoldersCount_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationHoldersCount_not_in?: Maybe<Array<Scalars['BigInt']>>,
  register?: Maybe<Scalars['String']>,
  register_not?: Maybe<Scalars['String']>,
  register_gt?: Maybe<Scalars['String']>,
  register_lt?: Maybe<Scalars['String']>,
  register_gte?: Maybe<Scalars['String']>,
  register_lte?: Maybe<Scalars['String']>,
  register_in?: Maybe<Array<Scalars['String']>>,
  register_not_in?: Maybe<Array<Scalars['String']>>,
  register_contains?: Maybe<Scalars['String']>,
  register_not_contains?: Maybe<Scalars['String']>,
  register_starts_with?: Maybe<Scalars['String']>,
  register_not_starts_with?: Maybe<Scalars['String']>,
  register_ends_with?: Maybe<Scalars['String']>,
  register_not_ends_with?: Maybe<Scalars['String']>,
};

export enum Dao_OrderBy {
  Id = 'id',
  Name = 'name',
  NativeToken = 'nativeToken',
  NativeReputation = 'nativeReputation',
  Proposals = 'proposals',
  ReputationHolders = 'reputationHolders',
  ReputationHoldersCount = 'reputationHoldersCount',
  Rewards = 'rewards',
  Register = 'register',
  Schemes = 'schemes',
  GpQueues = 'gpQueues'
}

export type DaoRegistryContract = {
   __typename?: 'DAORegistryContract',
  id: Scalars['ID'],
  address: Scalars['Bytes'],
  owner: Scalars['Bytes'],
};

export type DaoRegistryContract_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  owner?: Maybe<Scalars['Bytes']>,
  owner_not?: Maybe<Scalars['Bytes']>,
  owner_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_contains?: Maybe<Scalars['Bytes']>,
  owner_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum DaoRegistryContract_OrderBy {
  Id = 'id',
  Address = 'address',
  Owner = 'owner'
}

export type Debug = {
   __typename?: 'Debug',
  id: Scalars['ID'],
  message: Scalars['String'],
};

export type Debug_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  message?: Maybe<Scalars['String']>,
  message_not?: Maybe<Scalars['String']>,
  message_gt?: Maybe<Scalars['String']>,
  message_lt?: Maybe<Scalars['String']>,
  message_gte?: Maybe<Scalars['String']>,
  message_lte?: Maybe<Scalars['String']>,
  message_in?: Maybe<Array<Scalars['String']>>,
  message_not_in?: Maybe<Array<Scalars['String']>>,
  message_contains?: Maybe<Scalars['String']>,
  message_not_contains?: Maybe<Scalars['String']>,
  message_starts_with?: Maybe<Scalars['String']>,
  message_not_starts_with?: Maybe<Scalars['String']>,
  message_ends_with?: Maybe<Scalars['String']>,
  message_not_ends_with?: Maybe<Scalars['String']>,
};

export enum Debug_OrderBy {
  Id = 'id',
  Message = 'message'
}

export type FirstRegisterSchemeFlag = {
   __typename?: 'FirstRegisterSchemeFlag',
  id: Scalars['ID'],
};

export type FirstRegisterSchemeFlag_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
};

export enum FirstRegisterSchemeFlag_OrderBy {
  Id = 'id'
}

export type GenericSchemeParam = {
   __typename?: 'GenericSchemeParam',
  id: Scalars['ID'],
  votingMachine: Scalars['Bytes'],
  voteParams: GenesisProtocolParam,
  contractToCall: Scalars['Bytes'],
};

export type GenericSchemeParam_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  votingMachine?: Maybe<Scalars['Bytes']>,
  votingMachine_not?: Maybe<Scalars['Bytes']>,
  votingMachine_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_not_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_contains?: Maybe<Scalars['Bytes']>,
  votingMachine_not_contains?: Maybe<Scalars['Bytes']>,
  voteParams?: Maybe<Scalars['String']>,
  voteParams_not?: Maybe<Scalars['String']>,
  voteParams_gt?: Maybe<Scalars['String']>,
  voteParams_lt?: Maybe<Scalars['String']>,
  voteParams_gte?: Maybe<Scalars['String']>,
  voteParams_lte?: Maybe<Scalars['String']>,
  voteParams_in?: Maybe<Array<Scalars['String']>>,
  voteParams_not_in?: Maybe<Array<Scalars['String']>>,
  voteParams_contains?: Maybe<Scalars['String']>,
  voteParams_not_contains?: Maybe<Scalars['String']>,
  voteParams_starts_with?: Maybe<Scalars['String']>,
  voteParams_not_starts_with?: Maybe<Scalars['String']>,
  voteParams_ends_with?: Maybe<Scalars['String']>,
  voteParams_not_ends_with?: Maybe<Scalars['String']>,
  contractToCall?: Maybe<Scalars['Bytes']>,
  contractToCall_not?: Maybe<Scalars['Bytes']>,
  contractToCall_in?: Maybe<Array<Scalars['Bytes']>>,
  contractToCall_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contractToCall_contains?: Maybe<Scalars['Bytes']>,
  contractToCall_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum GenericSchemeParam_OrderBy {
  Id = 'id',
  VotingMachine = 'votingMachine',
  VoteParams = 'voteParams',
  ContractToCall = 'contractToCall'
}

export type GenericSchemeProposal = {
   __typename?: 'GenericSchemeProposal',
  id: Scalars['ID'],
  dao: Dao,
  contractToCall: Scalars['Bytes'],
  callData: Scalars['Bytes'],
  value: Scalars['BigInt'],
  executed: Scalars['Boolean'],
  returnValue?: Maybe<Scalars['Bytes']>,
};

export type GenericSchemeProposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  contractToCall?: Maybe<Scalars['Bytes']>,
  contractToCall_not?: Maybe<Scalars['Bytes']>,
  contractToCall_in?: Maybe<Array<Scalars['Bytes']>>,
  contractToCall_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contractToCall_contains?: Maybe<Scalars['Bytes']>,
  contractToCall_not_contains?: Maybe<Scalars['Bytes']>,
  callData?: Maybe<Scalars['Bytes']>,
  callData_not?: Maybe<Scalars['Bytes']>,
  callData_in?: Maybe<Array<Scalars['Bytes']>>,
  callData_not_in?: Maybe<Array<Scalars['Bytes']>>,
  callData_contains?: Maybe<Scalars['Bytes']>,
  callData_not_contains?: Maybe<Scalars['Bytes']>,
  value?: Maybe<Scalars['BigInt']>,
  value_not?: Maybe<Scalars['BigInt']>,
  value_gt?: Maybe<Scalars['BigInt']>,
  value_lt?: Maybe<Scalars['BigInt']>,
  value_gte?: Maybe<Scalars['BigInt']>,
  value_lte?: Maybe<Scalars['BigInt']>,
  value_in?: Maybe<Array<Scalars['BigInt']>>,
  value_not_in?: Maybe<Array<Scalars['BigInt']>>,
  executed?: Maybe<Scalars['Boolean']>,
  executed_not?: Maybe<Scalars['Boolean']>,
  executed_in?: Maybe<Array<Scalars['Boolean']>>,
  executed_not_in?: Maybe<Array<Scalars['Boolean']>>,
  returnValue?: Maybe<Scalars['Bytes']>,
  returnValue_not?: Maybe<Scalars['Bytes']>,
  returnValue_in?: Maybe<Array<Scalars['Bytes']>>,
  returnValue_not_in?: Maybe<Array<Scalars['Bytes']>>,
  returnValue_contains?: Maybe<Scalars['Bytes']>,
  returnValue_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum GenericSchemeProposal_OrderBy {
  Id = 'id',
  Dao = 'dao',
  ContractToCall = 'contractToCall',
  CallData = 'callData',
  Value = 'value',
  Executed = 'executed',
  ReturnValue = 'returnValue'
}

export type GenesisProtocolExecuteProposal = {
   __typename?: 'GenesisProtocolExecuteProposal',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  organization: Scalars['Bytes'],
  decision: Scalars['BigInt'],
  totalReputation: Scalars['BigInt'],
};

export type GenesisProtocolExecuteProposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  organization?: Maybe<Scalars['Bytes']>,
  organization_not?: Maybe<Scalars['Bytes']>,
  organization_in?: Maybe<Array<Scalars['Bytes']>>,
  organization_not_in?: Maybe<Array<Scalars['Bytes']>>,
  organization_contains?: Maybe<Scalars['Bytes']>,
  organization_not_contains?: Maybe<Scalars['Bytes']>,
  decision?: Maybe<Scalars['BigInt']>,
  decision_not?: Maybe<Scalars['BigInt']>,
  decision_gt?: Maybe<Scalars['BigInt']>,
  decision_lt?: Maybe<Scalars['BigInt']>,
  decision_gte?: Maybe<Scalars['BigInt']>,
  decision_lte?: Maybe<Scalars['BigInt']>,
  decision_in?: Maybe<Array<Scalars['BigInt']>>,
  decision_not_in?: Maybe<Array<Scalars['BigInt']>>,
  totalReputation?: Maybe<Scalars['BigInt']>,
  totalReputation_not?: Maybe<Scalars['BigInt']>,
  totalReputation_gt?: Maybe<Scalars['BigInt']>,
  totalReputation_lt?: Maybe<Scalars['BigInt']>,
  totalReputation_gte?: Maybe<Scalars['BigInt']>,
  totalReputation_lte?: Maybe<Scalars['BigInt']>,
  totalReputation_in?: Maybe<Array<Scalars['BigInt']>>,
  totalReputation_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum GenesisProtocolExecuteProposal_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  ProposalId = 'proposalId',
  Organization = 'organization',
  Decision = 'decision',
  TotalReputation = 'totalReputation'
}

export type GenesisProtocolGpExecuteProposal = {
   __typename?: 'GenesisProtocolGPExecuteProposal',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  executionState?: Maybe<Scalars['Int']>,
};

export type GenesisProtocolGpExecuteProposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  executionState?: Maybe<Scalars['Int']>,
  executionState_not?: Maybe<Scalars['Int']>,
  executionState_gt?: Maybe<Scalars['Int']>,
  executionState_lt?: Maybe<Scalars['Int']>,
  executionState_gte?: Maybe<Scalars['Int']>,
  executionState_lte?: Maybe<Scalars['Int']>,
  executionState_in?: Maybe<Array<Scalars['Int']>>,
  executionState_not_in?: Maybe<Array<Scalars['Int']>>,
};

export enum GenesisProtocolGpExecuteProposal_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  ProposalId = 'proposalId',
  ExecutionState = 'executionState'
}

export type GenesisProtocolParam = {
   __typename?: 'GenesisProtocolParam',
  id: Scalars['ID'],
  queuedVoteRequiredPercentage: Scalars['BigInt'],
  queuedVotePeriodLimit: Scalars['BigInt'],
  boostedVotePeriodLimit: Scalars['BigInt'],
  preBoostedVotePeriodLimit: Scalars['BigInt'],
  thresholdConst: Scalars['BigInt'],
  limitExponentValue: Scalars['BigInt'],
  quietEndingPeriod: Scalars['BigInt'],
  proposingRepReward: Scalars['BigInt'],
  votersReputationLossRatio: Scalars['BigInt'],
  minimumDaoBounty: Scalars['BigInt'],
  daoBountyConst: Scalars['BigInt'],
  activationTime: Scalars['BigInt'],
  voteOnBehalf: Scalars['Bytes'],
};

export type GenesisProtocolParam_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  queuedVoteRequiredPercentage?: Maybe<Scalars['BigInt']>,
  queuedVoteRequiredPercentage_not?: Maybe<Scalars['BigInt']>,
  queuedVoteRequiredPercentage_gt?: Maybe<Scalars['BigInt']>,
  queuedVoteRequiredPercentage_lt?: Maybe<Scalars['BigInt']>,
  queuedVoteRequiredPercentage_gte?: Maybe<Scalars['BigInt']>,
  queuedVoteRequiredPercentage_lte?: Maybe<Scalars['BigInt']>,
  queuedVoteRequiredPercentage_in?: Maybe<Array<Scalars['BigInt']>>,
  queuedVoteRequiredPercentage_not_in?: Maybe<Array<Scalars['BigInt']>>,
  queuedVotePeriodLimit?: Maybe<Scalars['BigInt']>,
  queuedVotePeriodLimit_not?: Maybe<Scalars['BigInt']>,
  queuedVotePeriodLimit_gt?: Maybe<Scalars['BigInt']>,
  queuedVotePeriodLimit_lt?: Maybe<Scalars['BigInt']>,
  queuedVotePeriodLimit_gte?: Maybe<Scalars['BigInt']>,
  queuedVotePeriodLimit_lte?: Maybe<Scalars['BigInt']>,
  queuedVotePeriodLimit_in?: Maybe<Array<Scalars['BigInt']>>,
  queuedVotePeriodLimit_not_in?: Maybe<Array<Scalars['BigInt']>>,
  boostedVotePeriodLimit?: Maybe<Scalars['BigInt']>,
  boostedVotePeriodLimit_not?: Maybe<Scalars['BigInt']>,
  boostedVotePeriodLimit_gt?: Maybe<Scalars['BigInt']>,
  boostedVotePeriodLimit_lt?: Maybe<Scalars['BigInt']>,
  boostedVotePeriodLimit_gte?: Maybe<Scalars['BigInt']>,
  boostedVotePeriodLimit_lte?: Maybe<Scalars['BigInt']>,
  boostedVotePeriodLimit_in?: Maybe<Array<Scalars['BigInt']>>,
  boostedVotePeriodLimit_not_in?: Maybe<Array<Scalars['BigInt']>>,
  preBoostedVotePeriodLimit?: Maybe<Scalars['BigInt']>,
  preBoostedVotePeriodLimit_not?: Maybe<Scalars['BigInt']>,
  preBoostedVotePeriodLimit_gt?: Maybe<Scalars['BigInt']>,
  preBoostedVotePeriodLimit_lt?: Maybe<Scalars['BigInt']>,
  preBoostedVotePeriodLimit_gte?: Maybe<Scalars['BigInt']>,
  preBoostedVotePeriodLimit_lte?: Maybe<Scalars['BigInt']>,
  preBoostedVotePeriodLimit_in?: Maybe<Array<Scalars['BigInt']>>,
  preBoostedVotePeriodLimit_not_in?: Maybe<Array<Scalars['BigInt']>>,
  thresholdConst?: Maybe<Scalars['BigInt']>,
  thresholdConst_not?: Maybe<Scalars['BigInt']>,
  thresholdConst_gt?: Maybe<Scalars['BigInt']>,
  thresholdConst_lt?: Maybe<Scalars['BigInt']>,
  thresholdConst_gte?: Maybe<Scalars['BigInt']>,
  thresholdConst_lte?: Maybe<Scalars['BigInt']>,
  thresholdConst_in?: Maybe<Array<Scalars['BigInt']>>,
  thresholdConst_not_in?: Maybe<Array<Scalars['BigInt']>>,
  limitExponentValue?: Maybe<Scalars['BigInt']>,
  limitExponentValue_not?: Maybe<Scalars['BigInt']>,
  limitExponentValue_gt?: Maybe<Scalars['BigInt']>,
  limitExponentValue_lt?: Maybe<Scalars['BigInt']>,
  limitExponentValue_gte?: Maybe<Scalars['BigInt']>,
  limitExponentValue_lte?: Maybe<Scalars['BigInt']>,
  limitExponentValue_in?: Maybe<Array<Scalars['BigInt']>>,
  limitExponentValue_not_in?: Maybe<Array<Scalars['BigInt']>>,
  quietEndingPeriod?: Maybe<Scalars['BigInt']>,
  quietEndingPeriod_not?: Maybe<Scalars['BigInt']>,
  quietEndingPeriod_gt?: Maybe<Scalars['BigInt']>,
  quietEndingPeriod_lt?: Maybe<Scalars['BigInt']>,
  quietEndingPeriod_gte?: Maybe<Scalars['BigInt']>,
  quietEndingPeriod_lte?: Maybe<Scalars['BigInt']>,
  quietEndingPeriod_in?: Maybe<Array<Scalars['BigInt']>>,
  quietEndingPeriod_not_in?: Maybe<Array<Scalars['BigInt']>>,
  proposingRepReward?: Maybe<Scalars['BigInt']>,
  proposingRepReward_not?: Maybe<Scalars['BigInt']>,
  proposingRepReward_gt?: Maybe<Scalars['BigInt']>,
  proposingRepReward_lt?: Maybe<Scalars['BigInt']>,
  proposingRepReward_gte?: Maybe<Scalars['BigInt']>,
  proposingRepReward_lte?: Maybe<Scalars['BigInt']>,
  proposingRepReward_in?: Maybe<Array<Scalars['BigInt']>>,
  proposingRepReward_not_in?: Maybe<Array<Scalars['BigInt']>>,
  votersReputationLossRatio?: Maybe<Scalars['BigInt']>,
  votersReputationLossRatio_not?: Maybe<Scalars['BigInt']>,
  votersReputationLossRatio_gt?: Maybe<Scalars['BigInt']>,
  votersReputationLossRatio_lt?: Maybe<Scalars['BigInt']>,
  votersReputationLossRatio_gte?: Maybe<Scalars['BigInt']>,
  votersReputationLossRatio_lte?: Maybe<Scalars['BigInt']>,
  votersReputationLossRatio_in?: Maybe<Array<Scalars['BigInt']>>,
  votersReputationLossRatio_not_in?: Maybe<Array<Scalars['BigInt']>>,
  minimumDaoBounty?: Maybe<Scalars['BigInt']>,
  minimumDaoBounty_not?: Maybe<Scalars['BigInt']>,
  minimumDaoBounty_gt?: Maybe<Scalars['BigInt']>,
  minimumDaoBounty_lt?: Maybe<Scalars['BigInt']>,
  minimumDaoBounty_gte?: Maybe<Scalars['BigInt']>,
  minimumDaoBounty_lte?: Maybe<Scalars['BigInt']>,
  minimumDaoBounty_in?: Maybe<Array<Scalars['BigInt']>>,
  minimumDaoBounty_not_in?: Maybe<Array<Scalars['BigInt']>>,
  daoBountyConst?: Maybe<Scalars['BigInt']>,
  daoBountyConst_not?: Maybe<Scalars['BigInt']>,
  daoBountyConst_gt?: Maybe<Scalars['BigInt']>,
  daoBountyConst_lt?: Maybe<Scalars['BigInt']>,
  daoBountyConst_gte?: Maybe<Scalars['BigInt']>,
  daoBountyConst_lte?: Maybe<Scalars['BigInt']>,
  daoBountyConst_in?: Maybe<Array<Scalars['BigInt']>>,
  daoBountyConst_not_in?: Maybe<Array<Scalars['BigInt']>>,
  activationTime?: Maybe<Scalars['BigInt']>,
  activationTime_not?: Maybe<Scalars['BigInt']>,
  activationTime_gt?: Maybe<Scalars['BigInt']>,
  activationTime_lt?: Maybe<Scalars['BigInt']>,
  activationTime_gte?: Maybe<Scalars['BigInt']>,
  activationTime_lte?: Maybe<Scalars['BigInt']>,
  activationTime_in?: Maybe<Array<Scalars['BigInt']>>,
  activationTime_not_in?: Maybe<Array<Scalars['BigInt']>>,
  voteOnBehalf?: Maybe<Scalars['Bytes']>,
  voteOnBehalf_not?: Maybe<Scalars['Bytes']>,
  voteOnBehalf_in?: Maybe<Array<Scalars['Bytes']>>,
  voteOnBehalf_not_in?: Maybe<Array<Scalars['Bytes']>>,
  voteOnBehalf_contains?: Maybe<Scalars['Bytes']>,
  voteOnBehalf_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum GenesisProtocolParam_OrderBy {
  Id = 'id',
  QueuedVoteRequiredPercentage = 'queuedVoteRequiredPercentage',
  QueuedVotePeriodLimit = 'queuedVotePeriodLimit',
  BoostedVotePeriodLimit = 'boostedVotePeriodLimit',
  PreBoostedVotePeriodLimit = 'preBoostedVotePeriodLimit',
  ThresholdConst = 'thresholdConst',
  LimitExponentValue = 'limitExponentValue',
  QuietEndingPeriod = 'quietEndingPeriod',
  ProposingRepReward = 'proposingRepReward',
  VotersReputationLossRatio = 'votersReputationLossRatio',
  MinimumDaoBounty = 'minimumDaoBounty',
  DaoBountyConst = 'daoBountyConst',
  ActivationTime = 'activationTime',
  VoteOnBehalf = 'voteOnBehalf'
}

export type GenesisProtocolProposal = {
   __typename?: 'GenesisProtocolProposal',
  id: Scalars['ID'],
  proposalId: Scalars['Bytes'],
  submittedTime: Scalars['BigInt'],
  proposer: Scalars['Bytes'],
  daoAvatarAddress: Scalars['Bytes'],
  numOfChoices?: Maybe<Scalars['BigInt']>,
  executionState?: Maybe<Scalars['Int']>,
  state?: Maybe<Scalars['Int']>,
  decision?: Maybe<Scalars['BigInt']>,
  executionTime?: Maybe<Scalars['BigInt']>,
  totalReputation?: Maybe<Scalars['BigInt']>,
  paramsHash: Scalars['Bytes'],
  address: Scalars['Bytes'],
};

export type GenesisProtocolProposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  submittedTime?: Maybe<Scalars['BigInt']>,
  submittedTime_not?: Maybe<Scalars['BigInt']>,
  submittedTime_gt?: Maybe<Scalars['BigInt']>,
  submittedTime_lt?: Maybe<Scalars['BigInt']>,
  submittedTime_gte?: Maybe<Scalars['BigInt']>,
  submittedTime_lte?: Maybe<Scalars['BigInt']>,
  submittedTime_in?: Maybe<Array<Scalars['BigInt']>>,
  submittedTime_not_in?: Maybe<Array<Scalars['BigInt']>>,
  proposer?: Maybe<Scalars['Bytes']>,
  proposer_not?: Maybe<Scalars['Bytes']>,
  proposer_in?: Maybe<Array<Scalars['Bytes']>>,
  proposer_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposer_contains?: Maybe<Scalars['Bytes']>,
  proposer_not_contains?: Maybe<Scalars['Bytes']>,
  daoAvatarAddress?: Maybe<Scalars['Bytes']>,
  daoAvatarAddress_not?: Maybe<Scalars['Bytes']>,
  daoAvatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  daoAvatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  daoAvatarAddress_contains?: Maybe<Scalars['Bytes']>,
  daoAvatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  numOfChoices?: Maybe<Scalars['BigInt']>,
  numOfChoices_not?: Maybe<Scalars['BigInt']>,
  numOfChoices_gt?: Maybe<Scalars['BigInt']>,
  numOfChoices_lt?: Maybe<Scalars['BigInt']>,
  numOfChoices_gte?: Maybe<Scalars['BigInt']>,
  numOfChoices_lte?: Maybe<Scalars['BigInt']>,
  numOfChoices_in?: Maybe<Array<Scalars['BigInt']>>,
  numOfChoices_not_in?: Maybe<Array<Scalars['BigInt']>>,
  executionState?: Maybe<Scalars['Int']>,
  executionState_not?: Maybe<Scalars['Int']>,
  executionState_gt?: Maybe<Scalars['Int']>,
  executionState_lt?: Maybe<Scalars['Int']>,
  executionState_gte?: Maybe<Scalars['Int']>,
  executionState_lte?: Maybe<Scalars['Int']>,
  executionState_in?: Maybe<Array<Scalars['Int']>>,
  executionState_not_in?: Maybe<Array<Scalars['Int']>>,
  state?: Maybe<Scalars['Int']>,
  state_not?: Maybe<Scalars['Int']>,
  state_gt?: Maybe<Scalars['Int']>,
  state_lt?: Maybe<Scalars['Int']>,
  state_gte?: Maybe<Scalars['Int']>,
  state_lte?: Maybe<Scalars['Int']>,
  state_in?: Maybe<Array<Scalars['Int']>>,
  state_not_in?: Maybe<Array<Scalars['Int']>>,
  decision?: Maybe<Scalars['BigInt']>,
  decision_not?: Maybe<Scalars['BigInt']>,
  decision_gt?: Maybe<Scalars['BigInt']>,
  decision_lt?: Maybe<Scalars['BigInt']>,
  decision_gte?: Maybe<Scalars['BigInt']>,
  decision_lte?: Maybe<Scalars['BigInt']>,
  decision_in?: Maybe<Array<Scalars['BigInt']>>,
  decision_not_in?: Maybe<Array<Scalars['BigInt']>>,
  executionTime?: Maybe<Scalars['BigInt']>,
  executionTime_not?: Maybe<Scalars['BigInt']>,
  executionTime_gt?: Maybe<Scalars['BigInt']>,
  executionTime_lt?: Maybe<Scalars['BigInt']>,
  executionTime_gte?: Maybe<Scalars['BigInt']>,
  executionTime_lte?: Maybe<Scalars['BigInt']>,
  executionTime_in?: Maybe<Array<Scalars['BigInt']>>,
  executionTime_not_in?: Maybe<Array<Scalars['BigInt']>>,
  totalReputation?: Maybe<Scalars['BigInt']>,
  totalReputation_not?: Maybe<Scalars['BigInt']>,
  totalReputation_gt?: Maybe<Scalars['BigInt']>,
  totalReputation_lt?: Maybe<Scalars['BigInt']>,
  totalReputation_gte?: Maybe<Scalars['BigInt']>,
  totalReputation_lte?: Maybe<Scalars['BigInt']>,
  totalReputation_in?: Maybe<Array<Scalars['BigInt']>>,
  totalReputation_not_in?: Maybe<Array<Scalars['BigInt']>>,
  paramsHash?: Maybe<Scalars['Bytes']>,
  paramsHash_not?: Maybe<Scalars['Bytes']>,
  paramsHash_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_contains?: Maybe<Scalars['Bytes']>,
  paramsHash_not_contains?: Maybe<Scalars['Bytes']>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum GenesisProtocolProposal_OrderBy {
  Id = 'id',
  ProposalId = 'proposalId',
  SubmittedTime = 'submittedTime',
  Proposer = 'proposer',
  DaoAvatarAddress = 'daoAvatarAddress',
  NumOfChoices = 'numOfChoices',
  ExecutionState = 'executionState',
  State = 'state',
  Decision = 'decision',
  ExecutionTime = 'executionTime',
  TotalReputation = 'totalReputation',
  ParamsHash = 'paramsHash',
  Address = 'address'
}

export type GenesisProtocolRedemption = {
   __typename?: 'GenesisProtocolRedemption',
  id: Scalars['ID'],
  rewardId: GenesisProtocolReward,
  proposalId: Scalars['ID'],
  redeemer: Scalars['Bytes'],
};

export type GenesisProtocolRedemption_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  rewardId?: Maybe<Scalars['String']>,
  rewardId_not?: Maybe<Scalars['String']>,
  rewardId_gt?: Maybe<Scalars['String']>,
  rewardId_lt?: Maybe<Scalars['String']>,
  rewardId_gte?: Maybe<Scalars['String']>,
  rewardId_lte?: Maybe<Scalars['String']>,
  rewardId_in?: Maybe<Array<Scalars['String']>>,
  rewardId_not_in?: Maybe<Array<Scalars['String']>>,
  rewardId_contains?: Maybe<Scalars['String']>,
  rewardId_not_contains?: Maybe<Scalars['String']>,
  rewardId_starts_with?: Maybe<Scalars['String']>,
  rewardId_not_starts_with?: Maybe<Scalars['String']>,
  rewardId_ends_with?: Maybe<Scalars['String']>,
  rewardId_not_ends_with?: Maybe<Scalars['String']>,
  proposalId?: Maybe<Scalars['ID']>,
  proposalId_not?: Maybe<Scalars['ID']>,
  proposalId_gt?: Maybe<Scalars['ID']>,
  proposalId_lt?: Maybe<Scalars['ID']>,
  proposalId_gte?: Maybe<Scalars['ID']>,
  proposalId_lte?: Maybe<Scalars['ID']>,
  proposalId_in?: Maybe<Array<Scalars['ID']>>,
  proposalId_not_in?: Maybe<Array<Scalars['ID']>>,
  redeemer?: Maybe<Scalars['Bytes']>,
  redeemer_not?: Maybe<Scalars['Bytes']>,
  redeemer_in?: Maybe<Array<Scalars['Bytes']>>,
  redeemer_not_in?: Maybe<Array<Scalars['Bytes']>>,
  redeemer_contains?: Maybe<Scalars['Bytes']>,
  redeemer_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum GenesisProtocolRedemption_OrderBy {
  Id = 'id',
  RewardId = 'rewardId',
  ProposalId = 'proposalId',
  Redeemer = 'redeemer'
}

export type GenesisProtocolReward = {
   __typename?: 'GenesisProtocolReward',
  id: Scalars['ID'],
  type?: Maybe<GenesisProtocolRewardType>,
  amount: Scalars['BigInt'],
};

export type GenesisProtocolReward_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  type?: Maybe<GenesisProtocolRewardType>,
  type_not?: Maybe<GenesisProtocolRewardType>,
  amount?: Maybe<Scalars['BigInt']>,
  amount_not?: Maybe<Scalars['BigInt']>,
  amount_gt?: Maybe<Scalars['BigInt']>,
  amount_lt?: Maybe<Scalars['BigInt']>,
  amount_gte?: Maybe<Scalars['BigInt']>,
  amount_lte?: Maybe<Scalars['BigInt']>,
  amount_in?: Maybe<Array<Scalars['BigInt']>>,
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum GenesisProtocolReward_OrderBy {
  Id = 'id',
  Type = 'type',
  Amount = 'amount'
}

export enum GenesisProtocolRewardType {
  BeneficiaryEth = 'beneficiaryEth',
  BeneficiaryNativeToken = 'beneficiaryNativeToken',
  BeneficiaryReputation = 'beneficiaryReputation',
  BeneficiaryExternalToken = 'beneficiaryExternalToken',
  GpRep = 'gpRep',
  GpGen = 'gpGen',
  GpBounty = 'gpBounty'
}

export type GenesisProtocolStake = {
   __typename?: 'GenesisProtocolStake',
  id: Scalars['ID'],
  avatarAddress: Scalars['Bytes'],
  stakerAddress: Scalars['Bytes'],
  prediction: Scalars['BigInt'],
  stakeAmount: Scalars['BigInt'],
  proposalId: GenesisProtocolProposal,
};

export type GenesisProtocolStake_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  stakerAddress?: Maybe<Scalars['Bytes']>,
  stakerAddress_not?: Maybe<Scalars['Bytes']>,
  stakerAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  stakerAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  stakerAddress_contains?: Maybe<Scalars['Bytes']>,
  stakerAddress_not_contains?: Maybe<Scalars['Bytes']>,
  prediction?: Maybe<Scalars['BigInt']>,
  prediction_not?: Maybe<Scalars['BigInt']>,
  prediction_gt?: Maybe<Scalars['BigInt']>,
  prediction_lt?: Maybe<Scalars['BigInt']>,
  prediction_gte?: Maybe<Scalars['BigInt']>,
  prediction_lte?: Maybe<Scalars['BigInt']>,
  prediction_in?: Maybe<Array<Scalars['BigInt']>>,
  prediction_not_in?: Maybe<Array<Scalars['BigInt']>>,
  stakeAmount?: Maybe<Scalars['BigInt']>,
  stakeAmount_not?: Maybe<Scalars['BigInt']>,
  stakeAmount_gt?: Maybe<Scalars['BigInt']>,
  stakeAmount_lt?: Maybe<Scalars['BigInt']>,
  stakeAmount_gte?: Maybe<Scalars['BigInt']>,
  stakeAmount_lte?: Maybe<Scalars['BigInt']>,
  stakeAmount_in?: Maybe<Array<Scalars['BigInt']>>,
  stakeAmount_not_in?: Maybe<Array<Scalars['BigInt']>>,
  proposalId?: Maybe<Scalars['String']>,
  proposalId_not?: Maybe<Scalars['String']>,
  proposalId_gt?: Maybe<Scalars['String']>,
  proposalId_lt?: Maybe<Scalars['String']>,
  proposalId_gte?: Maybe<Scalars['String']>,
  proposalId_lte?: Maybe<Scalars['String']>,
  proposalId_in?: Maybe<Array<Scalars['String']>>,
  proposalId_not_in?: Maybe<Array<Scalars['String']>>,
  proposalId_contains?: Maybe<Scalars['String']>,
  proposalId_not_contains?: Maybe<Scalars['String']>,
  proposalId_starts_with?: Maybe<Scalars['String']>,
  proposalId_not_starts_with?: Maybe<Scalars['String']>,
  proposalId_ends_with?: Maybe<Scalars['String']>,
  proposalId_not_ends_with?: Maybe<Scalars['String']>,
};

export enum GenesisProtocolStake_OrderBy {
  Id = 'id',
  AvatarAddress = 'avatarAddress',
  StakerAddress = 'stakerAddress',
  Prediction = 'prediction',
  StakeAmount = 'stakeAmount',
  ProposalId = 'proposalId'
}

export type GenesisProtocolVote = {
   __typename?: 'GenesisProtocolVote',
  id: Scalars['ID'],
  avatarAddress: Scalars['Bytes'],
  voterAddress: Scalars['Bytes'],
  reputation: Scalars['BigInt'],
  voteOption: Scalars['BigInt'],
  proposalId: GenesisProtocolProposal,
};

export type GenesisProtocolVote_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  voterAddress?: Maybe<Scalars['Bytes']>,
  voterAddress_not?: Maybe<Scalars['Bytes']>,
  voterAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  voterAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  voterAddress_contains?: Maybe<Scalars['Bytes']>,
  voterAddress_not_contains?: Maybe<Scalars['Bytes']>,
  reputation?: Maybe<Scalars['BigInt']>,
  reputation_not?: Maybe<Scalars['BigInt']>,
  reputation_gt?: Maybe<Scalars['BigInt']>,
  reputation_lt?: Maybe<Scalars['BigInt']>,
  reputation_gte?: Maybe<Scalars['BigInt']>,
  reputation_lte?: Maybe<Scalars['BigInt']>,
  reputation_in?: Maybe<Array<Scalars['BigInt']>>,
  reputation_not_in?: Maybe<Array<Scalars['BigInt']>>,
  voteOption?: Maybe<Scalars['BigInt']>,
  voteOption_not?: Maybe<Scalars['BigInt']>,
  voteOption_gt?: Maybe<Scalars['BigInt']>,
  voteOption_lt?: Maybe<Scalars['BigInt']>,
  voteOption_gte?: Maybe<Scalars['BigInt']>,
  voteOption_lte?: Maybe<Scalars['BigInt']>,
  voteOption_in?: Maybe<Array<Scalars['BigInt']>>,
  voteOption_not_in?: Maybe<Array<Scalars['BigInt']>>,
  proposalId?: Maybe<Scalars['String']>,
  proposalId_not?: Maybe<Scalars['String']>,
  proposalId_gt?: Maybe<Scalars['String']>,
  proposalId_lt?: Maybe<Scalars['String']>,
  proposalId_gte?: Maybe<Scalars['String']>,
  proposalId_lte?: Maybe<Scalars['String']>,
  proposalId_in?: Maybe<Array<Scalars['String']>>,
  proposalId_not_in?: Maybe<Array<Scalars['String']>>,
  proposalId_contains?: Maybe<Scalars['String']>,
  proposalId_not_contains?: Maybe<Scalars['String']>,
  proposalId_starts_with?: Maybe<Scalars['String']>,
  proposalId_not_starts_with?: Maybe<Scalars['String']>,
  proposalId_ends_with?: Maybe<Scalars['String']>,
  proposalId_not_ends_with?: Maybe<Scalars['String']>,
};

export enum GenesisProtocolVote_OrderBy {
  Id = 'id',
  AvatarAddress = 'avatarAddress',
  VoterAddress = 'voterAddress',
  Reputation = 'reputation',
  VoteOption = 'voteOption',
  ProposalId = 'proposalId'
}

export type GpQueue = {
   __typename?: 'GPQueue',
  id: Scalars['ID'],
  threshold: Scalars['BigInt'],
  scheme?: Maybe<ControllerScheme>,
  dao: Dao,
  votingMachine: Scalars['Bytes'],
};

export type GpQueue_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  threshold?: Maybe<Scalars['BigInt']>,
  threshold_not?: Maybe<Scalars['BigInt']>,
  threshold_gt?: Maybe<Scalars['BigInt']>,
  threshold_lt?: Maybe<Scalars['BigInt']>,
  threshold_gte?: Maybe<Scalars['BigInt']>,
  threshold_lte?: Maybe<Scalars['BigInt']>,
  threshold_in?: Maybe<Array<Scalars['BigInt']>>,
  threshold_not_in?: Maybe<Array<Scalars['BigInt']>>,
  scheme?: Maybe<Scalars['String']>,
  scheme_not?: Maybe<Scalars['String']>,
  scheme_gt?: Maybe<Scalars['String']>,
  scheme_lt?: Maybe<Scalars['String']>,
  scheme_gte?: Maybe<Scalars['String']>,
  scheme_lte?: Maybe<Scalars['String']>,
  scheme_in?: Maybe<Array<Scalars['String']>>,
  scheme_not_in?: Maybe<Array<Scalars['String']>>,
  scheme_contains?: Maybe<Scalars['String']>,
  scheme_not_contains?: Maybe<Scalars['String']>,
  scheme_starts_with?: Maybe<Scalars['String']>,
  scheme_not_starts_with?: Maybe<Scalars['String']>,
  scheme_ends_with?: Maybe<Scalars['String']>,
  scheme_not_ends_with?: Maybe<Scalars['String']>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  votingMachine?: Maybe<Scalars['Bytes']>,
  votingMachine_not?: Maybe<Scalars['Bytes']>,
  votingMachine_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_not_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_contains?: Maybe<Scalars['Bytes']>,
  votingMachine_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum GpQueue_OrderBy {
  Id = 'id',
  Threshold = 'threshold',
  Scheme = 'scheme',
  Dao = 'dao',
  VotingMachine = 'votingMachine'
}

export type GpReward = {
   __typename?: 'GPReward',
  id: Scalars['ID'],
  createdAt: Scalars['BigInt'],
  dao: Dao,
  beneficiary: Scalars['Bytes'],
  proposal: Proposal,
  reputationForVoter?: Maybe<Scalars['BigInt']>,
  tokensForStaker?: Maybe<Scalars['BigInt']>,
  daoBountyForStaker?: Maybe<Scalars['BigInt']>,
  reputationForProposer?: Maybe<Scalars['BigInt']>,
  tokenAddress?: Maybe<Scalars['Bytes']>,
  reputationForVoterRedeemedAt: Scalars['BigInt'],
  tokensForStakerRedeemedAt: Scalars['BigInt'],
  reputationForProposerRedeemedAt: Scalars['BigInt'],
  daoBountyForStakerRedeemedAt: Scalars['BigInt'],
};

export type GpReward_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  createdAt?: Maybe<Scalars['BigInt']>,
  createdAt_not?: Maybe<Scalars['BigInt']>,
  createdAt_gt?: Maybe<Scalars['BigInt']>,
  createdAt_lt?: Maybe<Scalars['BigInt']>,
  createdAt_gte?: Maybe<Scalars['BigInt']>,
  createdAt_lte?: Maybe<Scalars['BigInt']>,
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>,
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  beneficiary?: Maybe<Scalars['Bytes']>,
  beneficiary_not?: Maybe<Scalars['Bytes']>,
  beneficiary_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_not_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_contains?: Maybe<Scalars['Bytes']>,
  beneficiary_not_contains?: Maybe<Scalars['Bytes']>,
  proposal?: Maybe<Scalars['String']>,
  proposal_not?: Maybe<Scalars['String']>,
  proposal_gt?: Maybe<Scalars['String']>,
  proposal_lt?: Maybe<Scalars['String']>,
  proposal_gte?: Maybe<Scalars['String']>,
  proposal_lte?: Maybe<Scalars['String']>,
  proposal_in?: Maybe<Array<Scalars['String']>>,
  proposal_not_in?: Maybe<Array<Scalars['String']>>,
  proposal_contains?: Maybe<Scalars['String']>,
  proposal_not_contains?: Maybe<Scalars['String']>,
  proposal_starts_with?: Maybe<Scalars['String']>,
  proposal_not_starts_with?: Maybe<Scalars['String']>,
  proposal_ends_with?: Maybe<Scalars['String']>,
  proposal_not_ends_with?: Maybe<Scalars['String']>,
  reputationForVoter?: Maybe<Scalars['BigInt']>,
  reputationForVoter_not?: Maybe<Scalars['BigInt']>,
  reputationForVoter_gt?: Maybe<Scalars['BigInt']>,
  reputationForVoter_lt?: Maybe<Scalars['BigInt']>,
  reputationForVoter_gte?: Maybe<Scalars['BigInt']>,
  reputationForVoter_lte?: Maybe<Scalars['BigInt']>,
  reputationForVoter_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationForVoter_not_in?: Maybe<Array<Scalars['BigInt']>>,
  tokensForStaker?: Maybe<Scalars['BigInt']>,
  tokensForStaker_not?: Maybe<Scalars['BigInt']>,
  tokensForStaker_gt?: Maybe<Scalars['BigInt']>,
  tokensForStaker_lt?: Maybe<Scalars['BigInt']>,
  tokensForStaker_gte?: Maybe<Scalars['BigInt']>,
  tokensForStaker_lte?: Maybe<Scalars['BigInt']>,
  tokensForStaker_in?: Maybe<Array<Scalars['BigInt']>>,
  tokensForStaker_not_in?: Maybe<Array<Scalars['BigInt']>>,
  daoBountyForStaker?: Maybe<Scalars['BigInt']>,
  daoBountyForStaker_not?: Maybe<Scalars['BigInt']>,
  daoBountyForStaker_gt?: Maybe<Scalars['BigInt']>,
  daoBountyForStaker_lt?: Maybe<Scalars['BigInt']>,
  daoBountyForStaker_gte?: Maybe<Scalars['BigInt']>,
  daoBountyForStaker_lte?: Maybe<Scalars['BigInt']>,
  daoBountyForStaker_in?: Maybe<Array<Scalars['BigInt']>>,
  daoBountyForStaker_not_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationForProposer?: Maybe<Scalars['BigInt']>,
  reputationForProposer_not?: Maybe<Scalars['BigInt']>,
  reputationForProposer_gt?: Maybe<Scalars['BigInt']>,
  reputationForProposer_lt?: Maybe<Scalars['BigInt']>,
  reputationForProposer_gte?: Maybe<Scalars['BigInt']>,
  reputationForProposer_lte?: Maybe<Scalars['BigInt']>,
  reputationForProposer_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationForProposer_not_in?: Maybe<Array<Scalars['BigInt']>>,
  tokenAddress?: Maybe<Scalars['Bytes']>,
  tokenAddress_not?: Maybe<Scalars['Bytes']>,
  tokenAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  tokenAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  tokenAddress_contains?: Maybe<Scalars['Bytes']>,
  tokenAddress_not_contains?: Maybe<Scalars['Bytes']>,
  reputationForVoterRedeemedAt?: Maybe<Scalars['BigInt']>,
  reputationForVoterRedeemedAt_not?: Maybe<Scalars['BigInt']>,
  reputationForVoterRedeemedAt_gt?: Maybe<Scalars['BigInt']>,
  reputationForVoterRedeemedAt_lt?: Maybe<Scalars['BigInt']>,
  reputationForVoterRedeemedAt_gte?: Maybe<Scalars['BigInt']>,
  reputationForVoterRedeemedAt_lte?: Maybe<Scalars['BigInt']>,
  reputationForVoterRedeemedAt_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationForVoterRedeemedAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  tokensForStakerRedeemedAt?: Maybe<Scalars['BigInt']>,
  tokensForStakerRedeemedAt_not?: Maybe<Scalars['BigInt']>,
  tokensForStakerRedeemedAt_gt?: Maybe<Scalars['BigInt']>,
  tokensForStakerRedeemedAt_lt?: Maybe<Scalars['BigInt']>,
  tokensForStakerRedeemedAt_gte?: Maybe<Scalars['BigInt']>,
  tokensForStakerRedeemedAt_lte?: Maybe<Scalars['BigInt']>,
  tokensForStakerRedeemedAt_in?: Maybe<Array<Scalars['BigInt']>>,
  tokensForStakerRedeemedAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationForProposerRedeemedAt?: Maybe<Scalars['BigInt']>,
  reputationForProposerRedeemedAt_not?: Maybe<Scalars['BigInt']>,
  reputationForProposerRedeemedAt_gt?: Maybe<Scalars['BigInt']>,
  reputationForProposerRedeemedAt_lt?: Maybe<Scalars['BigInt']>,
  reputationForProposerRedeemedAt_gte?: Maybe<Scalars['BigInt']>,
  reputationForProposerRedeemedAt_lte?: Maybe<Scalars['BigInt']>,
  reputationForProposerRedeemedAt_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationForProposerRedeemedAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  daoBountyForStakerRedeemedAt?: Maybe<Scalars['BigInt']>,
  daoBountyForStakerRedeemedAt_not?: Maybe<Scalars['BigInt']>,
  daoBountyForStakerRedeemedAt_gt?: Maybe<Scalars['BigInt']>,
  daoBountyForStakerRedeemedAt_lt?: Maybe<Scalars['BigInt']>,
  daoBountyForStakerRedeemedAt_gte?: Maybe<Scalars['BigInt']>,
  daoBountyForStakerRedeemedAt_lte?: Maybe<Scalars['BigInt']>,
  daoBountyForStakerRedeemedAt_in?: Maybe<Array<Scalars['BigInt']>>,
  daoBountyForStakerRedeemedAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum GpReward_OrderBy {
  Id = 'id',
  CreatedAt = 'createdAt',
  Dao = 'dao',
  Beneficiary = 'beneficiary',
  Proposal = 'proposal',
  ReputationForVoter = 'reputationForVoter',
  TokensForStaker = 'tokensForStaker',
  DaoBountyForStaker = 'daoBountyForStaker',
  ReputationForProposer = 'reputationForProposer',
  TokenAddress = 'tokenAddress',
  ReputationForVoterRedeemedAt = 'reputationForVoterRedeemedAt',
  TokensForStakerRedeemedAt = 'tokensForStakerRedeemedAt',
  ReputationForProposerRedeemedAt = 'reputationForProposerRedeemedAt',
  DaoBountyForStakerRedeemedAt = 'daoBountyForStakerRedeemedAt'
}

export type GpRewardsHelper = {
   __typename?: 'GPRewardsHelper',
  id: Scalars['ID'],
  gpRewards?: Maybe<Array<PreGpReward>>,
};


export type GpRewardsHelperGpRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<PreGpReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>
};

export type GpRewardsHelper_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  gpRewards?: Maybe<Array<Scalars['String']>>,
  gpRewards_not?: Maybe<Array<Scalars['String']>>,
  gpRewards_contains?: Maybe<Array<Scalars['String']>>,
  gpRewards_not_contains?: Maybe<Array<Scalars['String']>>,
};

export enum GpRewardsHelper_OrderBy {
  Id = 'id',
  GpRewards = 'gpRewards'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export enum Outcome {
  Pass = 'Pass',
  Fail = 'Fail'
}

export type PreGpReward = {
   __typename?: 'PreGPReward',
  id: Scalars['ID'],
  beneficiary: Scalars['Bytes'],
};

export type PreGpReward_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  beneficiary?: Maybe<Scalars['Bytes']>,
  beneficiary_not?: Maybe<Scalars['Bytes']>,
  beneficiary_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_not_in?: Maybe<Array<Scalars['Bytes']>>,
  beneficiary_contains?: Maybe<Scalars['Bytes']>,
  beneficiary_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum PreGpReward_OrderBy {
  Id = 'id',
  Beneficiary = 'beneficiary'
}

export type Proposal = {
   __typename?: 'Proposal',
  id: Scalars['ID'],
  dao: Dao,
  proposer: Scalars['Bytes'],
  stage: Scalars['String'],
  createdAt: Scalars['BigInt'],
  preBoostedAt?: Maybe<Scalars['BigInt']>,
  boostedAt?: Maybe<Scalars['BigInt']>,
  quietEndingPeriodBeganAt?: Maybe<Scalars['BigInt']>,
  closingAt?: Maybe<Scalars['BigInt']>,
  executedAt?: Maybe<Scalars['BigInt']>,
  totalRepWhenExecuted?: Maybe<Scalars['BigInt']>,
  totalRepWhenCreated?: Maybe<Scalars['BigInt']>,
  votingMachine: Scalars['Bytes'],
  executionState: Scalars['String'],
  paramsHash: Scalars['Bytes'],
  organizationId: Scalars['Bytes'],
  confidenceThreshold: Scalars['BigInt'],
  descriptionHash: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  url?: Maybe<Scalars['String']>,
  gpRewards?: Maybe<Array<GpReward>>,
  accountsWithUnclaimedRewards?: Maybe<Array<Scalars['Bytes']>>,
  expiresInQueueAt: Scalars['BigInt'],
  votes?: Maybe<Array<ProposalVote>>,
  votesFor: Scalars['BigInt'],
  votesAgainst: Scalars['BigInt'],
  winningOutcome: Outcome,
  stakes?: Maybe<Array<ProposalStake>>,
  stakesFor: Scalars['BigInt'],
  stakesAgainst: Scalars['BigInt'],
  confidence: Scalars['BigDecimal'],
  gpQueue: GpQueue,
  scheme?: Maybe<ControllerScheme>,
  contributionReward?: Maybe<ContributionRewardProposal>,
  genericScheme?: Maybe<GenericSchemeProposal>,
  schemeRegistrar?: Maybe<SchemeRegistrarProposal>,
  genesisProtocolParams: GenesisProtocolParam,
};


export type ProposalGpRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GpReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>
};


export type ProposalVotesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ProposalVote_OrderBy>,
  orderDirection?: Maybe<OrderDirection>
};


export type ProposalStakesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ProposalStake_OrderBy>,
  orderDirection?: Maybe<OrderDirection>
};

export type Proposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  proposer?: Maybe<Scalars['Bytes']>,
  proposer_not?: Maybe<Scalars['Bytes']>,
  proposer_in?: Maybe<Array<Scalars['Bytes']>>,
  proposer_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposer_contains?: Maybe<Scalars['Bytes']>,
  proposer_not_contains?: Maybe<Scalars['Bytes']>,
  stage?: Maybe<Scalars['String']>,
  stage_not?: Maybe<Scalars['String']>,
  stage_gt?: Maybe<Scalars['String']>,
  stage_lt?: Maybe<Scalars['String']>,
  stage_gte?: Maybe<Scalars['String']>,
  stage_lte?: Maybe<Scalars['String']>,
  stage_in?: Maybe<Array<Scalars['String']>>,
  stage_not_in?: Maybe<Array<Scalars['String']>>,
  stage_contains?: Maybe<Scalars['String']>,
  stage_not_contains?: Maybe<Scalars['String']>,
  stage_starts_with?: Maybe<Scalars['String']>,
  stage_not_starts_with?: Maybe<Scalars['String']>,
  stage_ends_with?: Maybe<Scalars['String']>,
  stage_not_ends_with?: Maybe<Scalars['String']>,
  createdAt?: Maybe<Scalars['BigInt']>,
  createdAt_not?: Maybe<Scalars['BigInt']>,
  createdAt_gt?: Maybe<Scalars['BigInt']>,
  createdAt_lt?: Maybe<Scalars['BigInt']>,
  createdAt_gte?: Maybe<Scalars['BigInt']>,
  createdAt_lte?: Maybe<Scalars['BigInt']>,
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>,
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  preBoostedAt?: Maybe<Scalars['BigInt']>,
  preBoostedAt_not?: Maybe<Scalars['BigInt']>,
  preBoostedAt_gt?: Maybe<Scalars['BigInt']>,
  preBoostedAt_lt?: Maybe<Scalars['BigInt']>,
  preBoostedAt_gte?: Maybe<Scalars['BigInt']>,
  preBoostedAt_lte?: Maybe<Scalars['BigInt']>,
  preBoostedAt_in?: Maybe<Array<Scalars['BigInt']>>,
  preBoostedAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  boostedAt?: Maybe<Scalars['BigInt']>,
  boostedAt_not?: Maybe<Scalars['BigInt']>,
  boostedAt_gt?: Maybe<Scalars['BigInt']>,
  boostedAt_lt?: Maybe<Scalars['BigInt']>,
  boostedAt_gte?: Maybe<Scalars['BigInt']>,
  boostedAt_lte?: Maybe<Scalars['BigInt']>,
  boostedAt_in?: Maybe<Array<Scalars['BigInt']>>,
  boostedAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  quietEndingPeriodBeganAt?: Maybe<Scalars['BigInt']>,
  quietEndingPeriodBeganAt_not?: Maybe<Scalars['BigInt']>,
  quietEndingPeriodBeganAt_gt?: Maybe<Scalars['BigInt']>,
  quietEndingPeriodBeganAt_lt?: Maybe<Scalars['BigInt']>,
  quietEndingPeriodBeganAt_gte?: Maybe<Scalars['BigInt']>,
  quietEndingPeriodBeganAt_lte?: Maybe<Scalars['BigInt']>,
  quietEndingPeriodBeganAt_in?: Maybe<Array<Scalars['BigInt']>>,
  quietEndingPeriodBeganAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  closingAt?: Maybe<Scalars['BigInt']>,
  closingAt_not?: Maybe<Scalars['BigInt']>,
  closingAt_gt?: Maybe<Scalars['BigInt']>,
  closingAt_lt?: Maybe<Scalars['BigInt']>,
  closingAt_gte?: Maybe<Scalars['BigInt']>,
  closingAt_lte?: Maybe<Scalars['BigInt']>,
  closingAt_in?: Maybe<Array<Scalars['BigInt']>>,
  closingAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  executedAt?: Maybe<Scalars['BigInt']>,
  executedAt_not?: Maybe<Scalars['BigInt']>,
  executedAt_gt?: Maybe<Scalars['BigInt']>,
  executedAt_lt?: Maybe<Scalars['BigInt']>,
  executedAt_gte?: Maybe<Scalars['BigInt']>,
  executedAt_lte?: Maybe<Scalars['BigInt']>,
  executedAt_in?: Maybe<Array<Scalars['BigInt']>>,
  executedAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  totalRepWhenExecuted?: Maybe<Scalars['BigInt']>,
  totalRepWhenExecuted_not?: Maybe<Scalars['BigInt']>,
  totalRepWhenExecuted_gt?: Maybe<Scalars['BigInt']>,
  totalRepWhenExecuted_lt?: Maybe<Scalars['BigInt']>,
  totalRepWhenExecuted_gte?: Maybe<Scalars['BigInt']>,
  totalRepWhenExecuted_lte?: Maybe<Scalars['BigInt']>,
  totalRepWhenExecuted_in?: Maybe<Array<Scalars['BigInt']>>,
  totalRepWhenExecuted_not_in?: Maybe<Array<Scalars['BigInt']>>,
  totalRepWhenCreated?: Maybe<Scalars['BigInt']>,
  totalRepWhenCreated_not?: Maybe<Scalars['BigInt']>,
  totalRepWhenCreated_gt?: Maybe<Scalars['BigInt']>,
  totalRepWhenCreated_lt?: Maybe<Scalars['BigInt']>,
  totalRepWhenCreated_gte?: Maybe<Scalars['BigInt']>,
  totalRepWhenCreated_lte?: Maybe<Scalars['BigInt']>,
  totalRepWhenCreated_in?: Maybe<Array<Scalars['BigInt']>>,
  totalRepWhenCreated_not_in?: Maybe<Array<Scalars['BigInt']>>,
  votingMachine?: Maybe<Scalars['Bytes']>,
  votingMachine_not?: Maybe<Scalars['Bytes']>,
  votingMachine_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_not_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_contains?: Maybe<Scalars['Bytes']>,
  votingMachine_not_contains?: Maybe<Scalars['Bytes']>,
  executionState?: Maybe<Scalars['String']>,
  executionState_not?: Maybe<Scalars['String']>,
  executionState_gt?: Maybe<Scalars['String']>,
  executionState_lt?: Maybe<Scalars['String']>,
  executionState_gte?: Maybe<Scalars['String']>,
  executionState_lte?: Maybe<Scalars['String']>,
  executionState_in?: Maybe<Array<Scalars['String']>>,
  executionState_not_in?: Maybe<Array<Scalars['String']>>,
  executionState_contains?: Maybe<Scalars['String']>,
  executionState_not_contains?: Maybe<Scalars['String']>,
  executionState_starts_with?: Maybe<Scalars['String']>,
  executionState_not_starts_with?: Maybe<Scalars['String']>,
  executionState_ends_with?: Maybe<Scalars['String']>,
  executionState_not_ends_with?: Maybe<Scalars['String']>,
  paramsHash?: Maybe<Scalars['Bytes']>,
  paramsHash_not?: Maybe<Scalars['Bytes']>,
  paramsHash_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_contains?: Maybe<Scalars['Bytes']>,
  paramsHash_not_contains?: Maybe<Scalars['Bytes']>,
  organizationId?: Maybe<Scalars['Bytes']>,
  organizationId_not?: Maybe<Scalars['Bytes']>,
  organizationId_in?: Maybe<Array<Scalars['Bytes']>>,
  organizationId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  organizationId_contains?: Maybe<Scalars['Bytes']>,
  organizationId_not_contains?: Maybe<Scalars['Bytes']>,
  confidenceThreshold?: Maybe<Scalars['BigInt']>,
  confidenceThreshold_not?: Maybe<Scalars['BigInt']>,
  confidenceThreshold_gt?: Maybe<Scalars['BigInt']>,
  confidenceThreshold_lt?: Maybe<Scalars['BigInt']>,
  confidenceThreshold_gte?: Maybe<Scalars['BigInt']>,
  confidenceThreshold_lte?: Maybe<Scalars['BigInt']>,
  confidenceThreshold_in?: Maybe<Array<Scalars['BigInt']>>,
  confidenceThreshold_not_in?: Maybe<Array<Scalars['BigInt']>>,
  descriptionHash?: Maybe<Scalars['String']>,
  descriptionHash_not?: Maybe<Scalars['String']>,
  descriptionHash_gt?: Maybe<Scalars['String']>,
  descriptionHash_lt?: Maybe<Scalars['String']>,
  descriptionHash_gte?: Maybe<Scalars['String']>,
  descriptionHash_lte?: Maybe<Scalars['String']>,
  descriptionHash_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_not_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_contains?: Maybe<Scalars['String']>,
  descriptionHash_not_contains?: Maybe<Scalars['String']>,
  descriptionHash_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_not_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_ends_with?: Maybe<Scalars['String']>,
  descriptionHash_not_ends_with?: Maybe<Scalars['String']>,
  title?: Maybe<Scalars['String']>,
  title_not?: Maybe<Scalars['String']>,
  title_gt?: Maybe<Scalars['String']>,
  title_lt?: Maybe<Scalars['String']>,
  title_gte?: Maybe<Scalars['String']>,
  title_lte?: Maybe<Scalars['String']>,
  title_in?: Maybe<Array<Scalars['String']>>,
  title_not_in?: Maybe<Array<Scalars['String']>>,
  title_contains?: Maybe<Scalars['String']>,
  title_not_contains?: Maybe<Scalars['String']>,
  title_starts_with?: Maybe<Scalars['String']>,
  title_not_starts_with?: Maybe<Scalars['String']>,
  title_ends_with?: Maybe<Scalars['String']>,
  title_not_ends_with?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  description_not?: Maybe<Scalars['String']>,
  description_gt?: Maybe<Scalars['String']>,
  description_lt?: Maybe<Scalars['String']>,
  description_gte?: Maybe<Scalars['String']>,
  description_lte?: Maybe<Scalars['String']>,
  description_in?: Maybe<Array<Scalars['String']>>,
  description_not_in?: Maybe<Array<Scalars['String']>>,
  description_contains?: Maybe<Scalars['String']>,
  description_not_contains?: Maybe<Scalars['String']>,
  description_starts_with?: Maybe<Scalars['String']>,
  description_not_starts_with?: Maybe<Scalars['String']>,
  description_ends_with?: Maybe<Scalars['String']>,
  description_not_ends_with?: Maybe<Scalars['String']>,
  url?: Maybe<Scalars['String']>,
  url_not?: Maybe<Scalars['String']>,
  url_gt?: Maybe<Scalars['String']>,
  url_lt?: Maybe<Scalars['String']>,
  url_gte?: Maybe<Scalars['String']>,
  url_lte?: Maybe<Scalars['String']>,
  url_in?: Maybe<Array<Scalars['String']>>,
  url_not_in?: Maybe<Array<Scalars['String']>>,
  url_contains?: Maybe<Scalars['String']>,
  url_not_contains?: Maybe<Scalars['String']>,
  url_starts_with?: Maybe<Scalars['String']>,
  url_not_starts_with?: Maybe<Scalars['String']>,
  url_ends_with?: Maybe<Scalars['String']>,
  url_not_ends_with?: Maybe<Scalars['String']>,
  accountsWithUnclaimedRewards?: Maybe<Array<Scalars['Bytes']>>,
  accountsWithUnclaimedRewards_not?: Maybe<Array<Scalars['Bytes']>>,
  accountsWithUnclaimedRewards_contains?: Maybe<Array<Scalars['Bytes']>>,
  accountsWithUnclaimedRewards_not_contains?: Maybe<Array<Scalars['Bytes']>>,
  expiresInQueueAt?: Maybe<Scalars['BigInt']>,
  expiresInQueueAt_not?: Maybe<Scalars['BigInt']>,
  expiresInQueueAt_gt?: Maybe<Scalars['BigInt']>,
  expiresInQueueAt_lt?: Maybe<Scalars['BigInt']>,
  expiresInQueueAt_gte?: Maybe<Scalars['BigInt']>,
  expiresInQueueAt_lte?: Maybe<Scalars['BigInt']>,
  expiresInQueueAt_in?: Maybe<Array<Scalars['BigInt']>>,
  expiresInQueueAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  votesFor?: Maybe<Scalars['BigInt']>,
  votesFor_not?: Maybe<Scalars['BigInt']>,
  votesFor_gt?: Maybe<Scalars['BigInt']>,
  votesFor_lt?: Maybe<Scalars['BigInt']>,
  votesFor_gte?: Maybe<Scalars['BigInt']>,
  votesFor_lte?: Maybe<Scalars['BigInt']>,
  votesFor_in?: Maybe<Array<Scalars['BigInt']>>,
  votesFor_not_in?: Maybe<Array<Scalars['BigInt']>>,
  votesAgainst?: Maybe<Scalars['BigInt']>,
  votesAgainst_not?: Maybe<Scalars['BigInt']>,
  votesAgainst_gt?: Maybe<Scalars['BigInt']>,
  votesAgainst_lt?: Maybe<Scalars['BigInt']>,
  votesAgainst_gte?: Maybe<Scalars['BigInt']>,
  votesAgainst_lte?: Maybe<Scalars['BigInt']>,
  votesAgainst_in?: Maybe<Array<Scalars['BigInt']>>,
  votesAgainst_not_in?: Maybe<Array<Scalars['BigInt']>>,
  winningOutcome?: Maybe<Outcome>,
  winningOutcome_not?: Maybe<Outcome>,
  stakesFor?: Maybe<Scalars['BigInt']>,
  stakesFor_not?: Maybe<Scalars['BigInt']>,
  stakesFor_gt?: Maybe<Scalars['BigInt']>,
  stakesFor_lt?: Maybe<Scalars['BigInt']>,
  stakesFor_gte?: Maybe<Scalars['BigInt']>,
  stakesFor_lte?: Maybe<Scalars['BigInt']>,
  stakesFor_in?: Maybe<Array<Scalars['BigInt']>>,
  stakesFor_not_in?: Maybe<Array<Scalars['BigInt']>>,
  stakesAgainst?: Maybe<Scalars['BigInt']>,
  stakesAgainst_not?: Maybe<Scalars['BigInt']>,
  stakesAgainst_gt?: Maybe<Scalars['BigInt']>,
  stakesAgainst_lt?: Maybe<Scalars['BigInt']>,
  stakesAgainst_gte?: Maybe<Scalars['BigInt']>,
  stakesAgainst_lte?: Maybe<Scalars['BigInt']>,
  stakesAgainst_in?: Maybe<Array<Scalars['BigInt']>>,
  stakesAgainst_not_in?: Maybe<Array<Scalars['BigInt']>>,
  confidence?: Maybe<Scalars['BigDecimal']>,
  confidence_not?: Maybe<Scalars['BigDecimal']>,
  confidence_gt?: Maybe<Scalars['BigDecimal']>,
  confidence_lt?: Maybe<Scalars['BigDecimal']>,
  confidence_gte?: Maybe<Scalars['BigDecimal']>,
  confidence_lte?: Maybe<Scalars['BigDecimal']>,
  confidence_in?: Maybe<Array<Scalars['BigDecimal']>>,
  confidence_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
  gpQueue?: Maybe<Scalars['String']>,
  gpQueue_not?: Maybe<Scalars['String']>,
  gpQueue_gt?: Maybe<Scalars['String']>,
  gpQueue_lt?: Maybe<Scalars['String']>,
  gpQueue_gte?: Maybe<Scalars['String']>,
  gpQueue_lte?: Maybe<Scalars['String']>,
  gpQueue_in?: Maybe<Array<Scalars['String']>>,
  gpQueue_not_in?: Maybe<Array<Scalars['String']>>,
  gpQueue_contains?: Maybe<Scalars['String']>,
  gpQueue_not_contains?: Maybe<Scalars['String']>,
  gpQueue_starts_with?: Maybe<Scalars['String']>,
  gpQueue_not_starts_with?: Maybe<Scalars['String']>,
  gpQueue_ends_with?: Maybe<Scalars['String']>,
  gpQueue_not_ends_with?: Maybe<Scalars['String']>,
  scheme?: Maybe<Scalars['String']>,
  scheme_not?: Maybe<Scalars['String']>,
  scheme_gt?: Maybe<Scalars['String']>,
  scheme_lt?: Maybe<Scalars['String']>,
  scheme_gte?: Maybe<Scalars['String']>,
  scheme_lte?: Maybe<Scalars['String']>,
  scheme_in?: Maybe<Array<Scalars['String']>>,
  scheme_not_in?: Maybe<Array<Scalars['String']>>,
  scheme_contains?: Maybe<Scalars['String']>,
  scheme_not_contains?: Maybe<Scalars['String']>,
  scheme_starts_with?: Maybe<Scalars['String']>,
  scheme_not_starts_with?: Maybe<Scalars['String']>,
  scheme_ends_with?: Maybe<Scalars['String']>,
  scheme_not_ends_with?: Maybe<Scalars['String']>,
  contributionReward?: Maybe<Scalars['String']>,
  contributionReward_not?: Maybe<Scalars['String']>,
  contributionReward_gt?: Maybe<Scalars['String']>,
  contributionReward_lt?: Maybe<Scalars['String']>,
  contributionReward_gte?: Maybe<Scalars['String']>,
  contributionReward_lte?: Maybe<Scalars['String']>,
  contributionReward_in?: Maybe<Array<Scalars['String']>>,
  contributionReward_not_in?: Maybe<Array<Scalars['String']>>,
  contributionReward_contains?: Maybe<Scalars['String']>,
  contributionReward_not_contains?: Maybe<Scalars['String']>,
  contributionReward_starts_with?: Maybe<Scalars['String']>,
  contributionReward_not_starts_with?: Maybe<Scalars['String']>,
  contributionReward_ends_with?: Maybe<Scalars['String']>,
  contributionReward_not_ends_with?: Maybe<Scalars['String']>,
  genericScheme?: Maybe<Scalars['String']>,
  genericScheme_not?: Maybe<Scalars['String']>,
  genericScheme_gt?: Maybe<Scalars['String']>,
  genericScheme_lt?: Maybe<Scalars['String']>,
  genericScheme_gte?: Maybe<Scalars['String']>,
  genericScheme_lte?: Maybe<Scalars['String']>,
  genericScheme_in?: Maybe<Array<Scalars['String']>>,
  genericScheme_not_in?: Maybe<Array<Scalars['String']>>,
  genericScheme_contains?: Maybe<Scalars['String']>,
  genericScheme_not_contains?: Maybe<Scalars['String']>,
  genericScheme_starts_with?: Maybe<Scalars['String']>,
  genericScheme_not_starts_with?: Maybe<Scalars['String']>,
  genericScheme_ends_with?: Maybe<Scalars['String']>,
  genericScheme_not_ends_with?: Maybe<Scalars['String']>,
  schemeRegistrar?: Maybe<Scalars['String']>,
  schemeRegistrar_not?: Maybe<Scalars['String']>,
  schemeRegistrar_gt?: Maybe<Scalars['String']>,
  schemeRegistrar_lt?: Maybe<Scalars['String']>,
  schemeRegistrar_gte?: Maybe<Scalars['String']>,
  schemeRegistrar_lte?: Maybe<Scalars['String']>,
  schemeRegistrar_in?: Maybe<Array<Scalars['String']>>,
  schemeRegistrar_not_in?: Maybe<Array<Scalars['String']>>,
  schemeRegistrar_contains?: Maybe<Scalars['String']>,
  schemeRegistrar_not_contains?: Maybe<Scalars['String']>,
  schemeRegistrar_starts_with?: Maybe<Scalars['String']>,
  schemeRegistrar_not_starts_with?: Maybe<Scalars['String']>,
  schemeRegistrar_ends_with?: Maybe<Scalars['String']>,
  schemeRegistrar_not_ends_with?: Maybe<Scalars['String']>,
  genesisProtocolParams?: Maybe<Scalars['String']>,
  genesisProtocolParams_not?: Maybe<Scalars['String']>,
  genesisProtocolParams_gt?: Maybe<Scalars['String']>,
  genesisProtocolParams_lt?: Maybe<Scalars['String']>,
  genesisProtocolParams_gte?: Maybe<Scalars['String']>,
  genesisProtocolParams_lte?: Maybe<Scalars['String']>,
  genesisProtocolParams_in?: Maybe<Array<Scalars['String']>>,
  genesisProtocolParams_not_in?: Maybe<Array<Scalars['String']>>,
  genesisProtocolParams_contains?: Maybe<Scalars['String']>,
  genesisProtocolParams_not_contains?: Maybe<Scalars['String']>,
  genesisProtocolParams_starts_with?: Maybe<Scalars['String']>,
  genesisProtocolParams_not_starts_with?: Maybe<Scalars['String']>,
  genesisProtocolParams_ends_with?: Maybe<Scalars['String']>,
  genesisProtocolParams_not_ends_with?: Maybe<Scalars['String']>,
};

export enum Proposal_OrderBy {
  Id = 'id',
  Dao = 'dao',
  Proposer = 'proposer',
  Stage = 'stage',
  CreatedAt = 'createdAt',
  PreBoostedAt = 'preBoostedAt',
  BoostedAt = 'boostedAt',
  QuietEndingPeriodBeganAt = 'quietEndingPeriodBeganAt',
  ClosingAt = 'closingAt',
  ExecutedAt = 'executedAt',
  TotalRepWhenExecuted = 'totalRepWhenExecuted',
  TotalRepWhenCreated = 'totalRepWhenCreated',
  VotingMachine = 'votingMachine',
  ExecutionState = 'executionState',
  ParamsHash = 'paramsHash',
  OrganizationId = 'organizationId',
  ConfidenceThreshold = 'confidenceThreshold',
  DescriptionHash = 'descriptionHash',
  Title = 'title',
  Description = 'description',
  Url = 'url',
  GpRewards = 'gpRewards',
  AccountsWithUnclaimedRewards = 'accountsWithUnclaimedRewards',
  ExpiresInQueueAt = 'expiresInQueueAt',
  Votes = 'votes',
  VotesFor = 'votesFor',
  VotesAgainst = 'votesAgainst',
  WinningOutcome = 'winningOutcome',
  Stakes = 'stakes',
  StakesFor = 'stakesFor',
  StakesAgainst = 'stakesAgainst',
  Confidence = 'confidence',
  GpQueue = 'gpQueue',
  Scheme = 'scheme',
  ContributionReward = 'contributionReward',
  GenericScheme = 'genericScheme',
  SchemeRegistrar = 'schemeRegistrar',
  GenesisProtocolParams = 'genesisProtocolParams'
}

export type ProposalStake = {
   __typename?: 'ProposalStake',
  id: Scalars['ID'],
  createdAt: Scalars['BigInt'],
  staker: Scalars['Bytes'],
  proposal: Proposal,
  dao: Dao,
  outcome: Outcome,
  amount: Scalars['BigInt'],
};

export type ProposalStake_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  createdAt?: Maybe<Scalars['BigInt']>,
  createdAt_not?: Maybe<Scalars['BigInt']>,
  createdAt_gt?: Maybe<Scalars['BigInt']>,
  createdAt_lt?: Maybe<Scalars['BigInt']>,
  createdAt_gte?: Maybe<Scalars['BigInt']>,
  createdAt_lte?: Maybe<Scalars['BigInt']>,
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>,
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  staker?: Maybe<Scalars['Bytes']>,
  staker_not?: Maybe<Scalars['Bytes']>,
  staker_in?: Maybe<Array<Scalars['Bytes']>>,
  staker_not_in?: Maybe<Array<Scalars['Bytes']>>,
  staker_contains?: Maybe<Scalars['Bytes']>,
  staker_not_contains?: Maybe<Scalars['Bytes']>,
  proposal?: Maybe<Scalars['String']>,
  proposal_not?: Maybe<Scalars['String']>,
  proposal_gt?: Maybe<Scalars['String']>,
  proposal_lt?: Maybe<Scalars['String']>,
  proposal_gte?: Maybe<Scalars['String']>,
  proposal_lte?: Maybe<Scalars['String']>,
  proposal_in?: Maybe<Array<Scalars['String']>>,
  proposal_not_in?: Maybe<Array<Scalars['String']>>,
  proposal_contains?: Maybe<Scalars['String']>,
  proposal_not_contains?: Maybe<Scalars['String']>,
  proposal_starts_with?: Maybe<Scalars['String']>,
  proposal_not_starts_with?: Maybe<Scalars['String']>,
  proposal_ends_with?: Maybe<Scalars['String']>,
  proposal_not_ends_with?: Maybe<Scalars['String']>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  outcome?: Maybe<Outcome>,
  outcome_not?: Maybe<Outcome>,
  amount?: Maybe<Scalars['BigInt']>,
  amount_not?: Maybe<Scalars['BigInt']>,
  amount_gt?: Maybe<Scalars['BigInt']>,
  amount_lt?: Maybe<Scalars['BigInt']>,
  amount_gte?: Maybe<Scalars['BigInt']>,
  amount_lte?: Maybe<Scalars['BigInt']>,
  amount_in?: Maybe<Array<Scalars['BigInt']>>,
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ProposalStake_OrderBy {
  Id = 'id',
  CreatedAt = 'createdAt',
  Staker = 'staker',
  Proposal = 'proposal',
  Dao = 'dao',
  Outcome = 'outcome',
  Amount = 'amount'
}

export type ProposalVote = {
   __typename?: 'ProposalVote',
  id: Scalars['ID'],
  createdAt: Scalars['BigInt'],
  voter: Scalars['Bytes'],
  proposal: Proposal,
  dao: Dao,
  outcome: Outcome,
  reputation: Scalars['BigInt'],
};

export type ProposalVote_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  createdAt?: Maybe<Scalars['BigInt']>,
  createdAt_not?: Maybe<Scalars['BigInt']>,
  createdAt_gt?: Maybe<Scalars['BigInt']>,
  createdAt_lt?: Maybe<Scalars['BigInt']>,
  createdAt_gte?: Maybe<Scalars['BigInt']>,
  createdAt_lte?: Maybe<Scalars['BigInt']>,
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>,
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>,
  voter?: Maybe<Scalars['Bytes']>,
  voter_not?: Maybe<Scalars['Bytes']>,
  voter_in?: Maybe<Array<Scalars['Bytes']>>,
  voter_not_in?: Maybe<Array<Scalars['Bytes']>>,
  voter_contains?: Maybe<Scalars['Bytes']>,
  voter_not_contains?: Maybe<Scalars['Bytes']>,
  proposal?: Maybe<Scalars['String']>,
  proposal_not?: Maybe<Scalars['String']>,
  proposal_gt?: Maybe<Scalars['String']>,
  proposal_lt?: Maybe<Scalars['String']>,
  proposal_gte?: Maybe<Scalars['String']>,
  proposal_lte?: Maybe<Scalars['String']>,
  proposal_in?: Maybe<Array<Scalars['String']>>,
  proposal_not_in?: Maybe<Array<Scalars['String']>>,
  proposal_contains?: Maybe<Scalars['String']>,
  proposal_not_contains?: Maybe<Scalars['String']>,
  proposal_starts_with?: Maybe<Scalars['String']>,
  proposal_not_starts_with?: Maybe<Scalars['String']>,
  proposal_ends_with?: Maybe<Scalars['String']>,
  proposal_not_ends_with?: Maybe<Scalars['String']>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  outcome?: Maybe<Outcome>,
  outcome_not?: Maybe<Outcome>,
  reputation?: Maybe<Scalars['BigInt']>,
  reputation_not?: Maybe<Scalars['BigInt']>,
  reputation_gt?: Maybe<Scalars['BigInt']>,
  reputation_lt?: Maybe<Scalars['BigInt']>,
  reputation_gte?: Maybe<Scalars['BigInt']>,
  reputation_lte?: Maybe<Scalars['BigInt']>,
  reputation_in?: Maybe<Array<Scalars['BigInt']>>,
  reputation_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ProposalVote_OrderBy {
  Id = 'id',
  CreatedAt = 'createdAt',
  Voter = 'voter',
  Proposal = 'proposal',
  Dao = 'dao',
  Outcome = 'outcome',
  Reputation = 'reputation'
}

export type Query = {
   __typename?: 'Query',
  avatarContract?: Maybe<AvatarContract>,
  avatarContracts: Array<AvatarContract>,
  contributionRewardRedeemReputation?: Maybe<ContributionRewardRedeemReputation>,
  contributionRewardRedeemReputations: Array<ContributionRewardRedeemReputation>,
  contributionRewardRedeemNativeToken?: Maybe<ContributionRewardRedeemNativeToken>,
  contributionRewardRedeemNativeTokens: Array<ContributionRewardRedeemNativeToken>,
  contributionRewardRedeemExternalToken?: Maybe<ContributionRewardRedeemExternalToken>,
  contributionRewardRedeemExternalTokens: Array<ContributionRewardRedeemExternalToken>,
  contributionRewardRedeemEther?: Maybe<ContributionRewardRedeemEther>,
  contributionRewardRedeemEthers: Array<ContributionRewardRedeemEther>,
  contributionRewardProposalResolved?: Maybe<ContributionRewardProposalResolved>,
  contributionRewardProposalResolveds: Array<ContributionRewardProposalResolved>,
  contributionRewardNewContributionProposal?: Maybe<ContributionRewardNewContributionProposal>,
  contributionRewardNewContributionProposals: Array<ContributionRewardNewContributionProposal>,
  contributionRewardProposal?: Maybe<ContributionRewardProposal>,
  contributionRewardProposals: Array<ContributionRewardProposal>,
  controllerOrganization?: Maybe<ControllerOrganization>,
  controllerOrganizations: Array<ControllerOrganization>,
  controllerScheme?: Maybe<ControllerScheme>,
  controllerSchemes: Array<ControllerScheme>,
  controllerGlobalConstraint?: Maybe<ControllerGlobalConstraint>,
  controllerGlobalConstraints: Array<ControllerGlobalConstraint>,
  controllerRegisterScheme?: Maybe<ControllerRegisterScheme>,
  controllerRegisterSchemes: Array<ControllerRegisterScheme>,
  controllerUnregisterScheme?: Maybe<ControllerUnregisterScheme>,
  controllerUnregisterSchemes: Array<ControllerUnregisterScheme>,
  controllerUpgradeController?: Maybe<ControllerUpgradeController>,
  controllerUpgradeControllers: Array<ControllerUpgradeController>,
  controllerAddGlobalConstraint?: Maybe<ControllerAddGlobalConstraint>,
  controllerAddGlobalConstraints: Array<ControllerAddGlobalConstraint>,
  controllerRemoveGlobalConstraint?: Maybe<ControllerRemoveGlobalConstraint>,
  controllerRemoveGlobalConstraints: Array<ControllerRemoveGlobalConstraint>,
  contributionRewardParam?: Maybe<ContributionRewardParam>,
  contributionRewardParams: Array<ContributionRewardParam>,
  schemeRegistrarParam?: Maybe<SchemeRegistrarParam>,
  schemeRegistrarParams: Array<SchemeRegistrarParam>,
  genericSchemeParam?: Maybe<GenericSchemeParam>,
  genericSchemeParams: Array<GenericSchemeParam>,
  genesisProtocolParam?: Maybe<GenesisProtocolParam>,
  genesisProtocolParams: Array<GenesisProtocolParam>,
  daoregistryContract?: Maybe<DaoRegistryContract>,
  daoregistryContracts: Array<DaoRegistryContract>,
  tokenContract?: Maybe<TokenContract>,
  tokenContracts: Array<TokenContract>,
  tokenHolder?: Maybe<TokenHolder>,
  tokenHolders: Array<TokenHolder>,
  allowance?: Maybe<Allowance>,
  allowances: Array<Allowance>,
  tokenTransfer?: Maybe<TokenTransfer>,
  tokenTransfers: Array<TokenTransfer>,
  tokenApproval?: Maybe<TokenApproval>,
  tokenApprovals: Array<TokenApproval>,
  genericSchemeProposal?: Maybe<GenericSchemeProposal>,
  genericSchemeProposals: Array<GenericSchemeProposal>,
  genesisProtocolProposal?: Maybe<GenesisProtocolProposal>,
  genesisProtocolProposals: Array<GenesisProtocolProposal>,
  genesisProtocolVote?: Maybe<GenesisProtocolVote>,
  genesisProtocolVotes: Array<GenesisProtocolVote>,
  genesisProtocolStake?: Maybe<GenesisProtocolStake>,
  genesisProtocolStakes: Array<GenesisProtocolStake>,
  genesisProtocolRedemption?: Maybe<GenesisProtocolRedemption>,
  genesisProtocolRedemptions: Array<GenesisProtocolRedemption>,
  genesisProtocolReward?: Maybe<GenesisProtocolReward>,
  genesisProtocolRewards: Array<GenesisProtocolReward>,
  genesisProtocolExecuteProposal?: Maybe<GenesisProtocolExecuteProposal>,
  genesisProtocolExecuteProposals: Array<GenesisProtocolExecuteProposal>,
  genesisProtocolGPExecuteProposal?: Maybe<GenesisProtocolGpExecuteProposal>,
  genesisProtocolGPExecuteProposals: Array<GenesisProtocolGpExecuteProposal>,
  reputationContract?: Maybe<ReputationContract>,
  reputationContracts: Array<ReputationContract>,
  reputationHolder?: Maybe<ReputationHolder>,
  reputationHolders: Array<ReputationHolder>,
  reputationMint?: Maybe<ReputationMint>,
  reputationMints: Array<ReputationMint>,
  reputationBurn?: Maybe<ReputationBurn>,
  reputationBurns: Array<ReputationBurn>,
  schemeRegistrarNewSchemeProposal?: Maybe<SchemeRegistrarNewSchemeProposal>,
  schemeRegistrarNewSchemeProposals: Array<SchemeRegistrarNewSchemeProposal>,
  schemeRegistrarRemoveSchemeProposal?: Maybe<SchemeRegistrarRemoveSchemeProposal>,
  schemeRegistrarRemoveSchemeProposals: Array<SchemeRegistrarRemoveSchemeProposal>,
  schemeRegistrarProposalExecuted?: Maybe<SchemeRegistrarProposalExecuted>,
  schemeRegistrarProposalExecuteds: Array<SchemeRegistrarProposalExecuted>,
  schemeRegistrarProposal?: Maybe<SchemeRegistrarProposal>,
  schemeRegistrarProposals: Array<SchemeRegistrarProposal>,
  ucontrollerOrganization?: Maybe<UControllerOrganization>,
  ucontrollerOrganizations: Array<UControllerOrganization>,
  ucontrollerGlobalConstraint?: Maybe<UControllerGlobalConstraint>,
  ucontrollerGlobalConstraints: Array<UControllerGlobalConstraint>,
  ucontrollerRegisterScheme?: Maybe<UControllerRegisterScheme>,
  ucontrollerRegisterSchemes: Array<UControllerRegisterScheme>,
  ucontrollerUnregisterScheme?: Maybe<UControllerUnregisterScheme>,
  ucontrollerUnregisterSchemes: Array<UControllerUnregisterScheme>,
  ucontrollerUpgradeController?: Maybe<UControllerUpgradeController>,
  ucontrollerUpgradeControllers: Array<UControllerUpgradeController>,
  ucontrollerAddGlobalConstraint?: Maybe<UControllerAddGlobalConstraint>,
  ucontrollerAddGlobalConstraints: Array<UControllerAddGlobalConstraint>,
  ucontrollerRemoveGlobalConstraint?: Maybe<UControllerRemoveGlobalConstraint>,
  ucontrollerRemoveGlobalConstraints: Array<UControllerRemoveGlobalConstraint>,
  debug?: Maybe<Debug>,
  debugs: Array<Debug>,
  dao?: Maybe<Dao>,
  daos: Array<Dao>,
  gpqueue?: Maybe<GpQueue>,
  gpqueues: Array<GpQueue>,
  rep?: Maybe<Rep>,
  reps: Array<Rep>,
  token?: Maybe<Token>,
  tokens: Array<Token>,
  proposal?: Maybe<Proposal>,
  proposals: Array<Proposal>,
  proposalStake?: Maybe<ProposalStake>,
  proposalStakes: Array<ProposalStake>,
  proposalVote?: Maybe<ProposalVote>,
  proposalVotes: Array<ProposalVote>,
  gprewardsHelper?: Maybe<GpRewardsHelper>,
  gprewardsHelpers: Array<GpRewardsHelper>,
  preGPReward?: Maybe<PreGpReward>,
  preGPRewards: Array<PreGpReward>,
  gpreward?: Maybe<GpReward>,
  gprewards: Array<GpReward>,
  firstRegisterSchemeFlag?: Maybe<FirstRegisterSchemeFlag>,
  firstRegisterSchemeFlags: Array<FirstRegisterSchemeFlag>,
  contractInfo?: Maybe<ContractInfo>,
  contractInfos: Array<ContractInfo>,
};


export type QueryAvatarContractArgs = {
  id: Scalars['ID']
};


export type QueryAvatarContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<AvatarContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<AvatarContract_Filter>
};


export type QueryContributionRewardRedeemReputationArgs = {
  id: Scalars['ID']
};


export type QueryContributionRewardRedeemReputationsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardRedeemReputation_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardRedeemReputation_Filter>
};


export type QueryContributionRewardRedeemNativeTokenArgs = {
  id: Scalars['ID']
};


export type QueryContributionRewardRedeemNativeTokensArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardRedeemNativeToken_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardRedeemNativeToken_Filter>
};


export type QueryContributionRewardRedeemExternalTokenArgs = {
  id: Scalars['ID']
};


export type QueryContributionRewardRedeemExternalTokensArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardRedeemExternalToken_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardRedeemExternalToken_Filter>
};


export type QueryContributionRewardRedeemEtherArgs = {
  id: Scalars['ID']
};


export type QueryContributionRewardRedeemEthersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardRedeemEther_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardRedeemEther_Filter>
};


export type QueryContributionRewardProposalResolvedArgs = {
  id: Scalars['ID']
};


export type QueryContributionRewardProposalResolvedsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardProposalResolved_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardProposalResolved_Filter>
};


export type QueryContributionRewardNewContributionProposalArgs = {
  id: Scalars['ID']
};


export type QueryContributionRewardNewContributionProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardNewContributionProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardNewContributionProposal_Filter>
};


export type QueryContributionRewardProposalArgs = {
  id: Scalars['ID']
};


export type QueryContributionRewardProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardProposal_Filter>
};


export type QueryControllerOrganizationArgs = {
  id: Scalars['ID']
};


export type QueryControllerOrganizationsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerOrganization_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerOrganization_Filter>
};


export type QueryControllerSchemeArgs = {
  id: Scalars['ID']
};


export type QueryControllerSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerScheme_Filter>
};


export type QueryControllerGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type QueryControllerGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerGlobalConstraint_Filter>
};


export type QueryControllerRegisterSchemeArgs = {
  id: Scalars['ID']
};


export type QueryControllerRegisterSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerRegisterScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerRegisterScheme_Filter>
};


export type QueryControllerUnregisterSchemeArgs = {
  id: Scalars['ID']
};


export type QueryControllerUnregisterSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerUnregisterScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerUnregisterScheme_Filter>
};


export type QueryControllerUpgradeControllerArgs = {
  id: Scalars['ID']
};


export type QueryControllerUpgradeControllersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerUpgradeController_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerUpgradeController_Filter>
};


export type QueryControllerAddGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type QueryControllerAddGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerAddGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerAddGlobalConstraint_Filter>
};


export type QueryControllerRemoveGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type QueryControllerRemoveGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerRemoveGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerRemoveGlobalConstraint_Filter>
};


export type QueryContributionRewardParamArgs = {
  id: Scalars['ID']
};


export type QueryContributionRewardParamsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardParam_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardParam_Filter>
};


export type QuerySchemeRegistrarParamArgs = {
  id: Scalars['ID']
};


export type QuerySchemeRegistrarParamsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarParam_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarParam_Filter>
};


export type QueryGenericSchemeParamArgs = {
  id: Scalars['ID']
};


export type QueryGenericSchemeParamsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenericSchemeParam_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenericSchemeParam_Filter>
};


export type QueryGenesisProtocolParamArgs = {
  id: Scalars['ID']
};


export type QueryGenesisProtocolParamsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolParam_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolParam_Filter>
};


export type QueryDaoregistryContractArgs = {
  id: Scalars['ID']
};


export type QueryDaoregistryContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<DaoRegistryContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<DaoRegistryContract_Filter>
};


export type QueryTokenContractArgs = {
  id: Scalars['ID']
};


export type QueryTokenContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TokenContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TokenContract_Filter>
};


export type QueryTokenHolderArgs = {
  id: Scalars['ID']
};


export type QueryTokenHoldersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TokenHolder_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TokenHolder_Filter>
};


export type QueryAllowanceArgs = {
  id: Scalars['ID']
};


export type QueryAllowancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Allowance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Allowance_Filter>
};


export type QueryTokenTransferArgs = {
  id: Scalars['ID']
};


export type QueryTokenTransfersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TokenTransfer_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TokenTransfer_Filter>
};


export type QueryTokenApprovalArgs = {
  id: Scalars['ID']
};


export type QueryTokenApprovalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TokenApproval_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TokenApproval_Filter>
};


export type QueryGenericSchemeProposalArgs = {
  id: Scalars['ID']
};


export type QueryGenericSchemeProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenericSchemeProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenericSchemeProposal_Filter>
};


export type QueryGenesisProtocolProposalArgs = {
  id: Scalars['ID']
};


export type QueryGenesisProtocolProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolProposal_Filter>
};


export type QueryGenesisProtocolVoteArgs = {
  id: Scalars['ID']
};


export type QueryGenesisProtocolVotesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolVote_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolVote_Filter>
};


export type QueryGenesisProtocolStakeArgs = {
  id: Scalars['ID']
};


export type QueryGenesisProtocolStakesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolStake_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolStake_Filter>
};


export type QueryGenesisProtocolRedemptionArgs = {
  id: Scalars['ID']
};


export type QueryGenesisProtocolRedemptionsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolRedemption_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolRedemption_Filter>
};


export type QueryGenesisProtocolRewardArgs = {
  id: Scalars['ID']
};


export type QueryGenesisProtocolRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolReward_Filter>
};


export type QueryGenesisProtocolExecuteProposalArgs = {
  id: Scalars['ID']
};


export type QueryGenesisProtocolExecuteProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolExecuteProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolExecuteProposal_Filter>
};


export type QueryGenesisProtocolGpExecuteProposalArgs = {
  id: Scalars['ID']
};


export type QueryGenesisProtocolGpExecuteProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolGpExecuteProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolGpExecuteProposal_Filter>
};


export type QueryReputationContractArgs = {
  id: Scalars['ID']
};


export type QueryReputationContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ReputationContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ReputationContract_Filter>
};


export type QueryReputationHolderArgs = {
  id: Scalars['ID']
};


export type QueryReputationHoldersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ReputationHolder_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ReputationHolder_Filter>
};


export type QueryReputationMintArgs = {
  id: Scalars['ID']
};


export type QueryReputationMintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ReputationMint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ReputationMint_Filter>
};


export type QueryReputationBurnArgs = {
  id: Scalars['ID']
};


export type QueryReputationBurnsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ReputationBurn_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ReputationBurn_Filter>
};


export type QuerySchemeRegistrarNewSchemeProposalArgs = {
  id: Scalars['ID']
};


export type QuerySchemeRegistrarNewSchemeProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarNewSchemeProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarNewSchemeProposal_Filter>
};


export type QuerySchemeRegistrarRemoveSchemeProposalArgs = {
  id: Scalars['ID']
};


export type QuerySchemeRegistrarRemoveSchemeProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarRemoveSchemeProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarRemoveSchemeProposal_Filter>
};


export type QuerySchemeRegistrarProposalExecutedArgs = {
  id: Scalars['ID']
};


export type QuerySchemeRegistrarProposalExecutedsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarProposalExecuted_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarProposalExecuted_Filter>
};


export type QuerySchemeRegistrarProposalArgs = {
  id: Scalars['ID']
};


export type QuerySchemeRegistrarProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarProposal_Filter>
};


export type QueryUcontrollerOrganizationArgs = {
  id: Scalars['ID']
};


export type QueryUcontrollerOrganizationsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerOrganization_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerOrganization_Filter>
};


export type QueryUcontrollerGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type QueryUcontrollerGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerGlobalConstraint_Filter>
};


export type QueryUcontrollerRegisterSchemeArgs = {
  id: Scalars['ID']
};


export type QueryUcontrollerRegisterSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerRegisterScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerRegisterScheme_Filter>
};


export type QueryUcontrollerUnregisterSchemeArgs = {
  id: Scalars['ID']
};


export type QueryUcontrollerUnregisterSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerUnregisterScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerUnregisterScheme_Filter>
};


export type QueryUcontrollerUpgradeControllerArgs = {
  id: Scalars['ID']
};


export type QueryUcontrollerUpgradeControllersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerUpgradeController_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerUpgradeController_Filter>
};


export type QueryUcontrollerAddGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type QueryUcontrollerAddGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerAddGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerAddGlobalConstraint_Filter>
};


export type QueryUcontrollerRemoveGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type QueryUcontrollerRemoveGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerRemoveGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerRemoveGlobalConstraint_Filter>
};


export type QueryDebugArgs = {
  id: Scalars['ID']
};


export type QueryDebugsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Debug_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Debug_Filter>
};


export type QueryDaoArgs = {
  id: Scalars['ID']
};


export type QueryDaosArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Dao_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Dao_Filter>
};


export type QueryGpqueueArgs = {
  id: Scalars['ID']
};


export type QueryGpqueuesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GpQueue_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GpQueue_Filter>
};


export type QueryRepArgs = {
  id: Scalars['ID']
};


export type QueryRepsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Rep_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Rep_Filter>
};


export type QueryTokenArgs = {
  id: Scalars['ID']
};


export type QueryTokensArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Token_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Token_Filter>
};


export type QueryProposalArgs = {
  id: Scalars['ID']
};


export type QueryProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Proposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Proposal_Filter>
};


export type QueryProposalStakeArgs = {
  id: Scalars['ID']
};


export type QueryProposalStakesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ProposalStake_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ProposalStake_Filter>
};


export type QueryProposalVoteArgs = {
  id: Scalars['ID']
};


export type QueryProposalVotesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ProposalVote_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ProposalVote_Filter>
};


export type QueryGprewardsHelperArgs = {
  id: Scalars['ID']
};


export type QueryGprewardsHelpersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GpRewardsHelper_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GpRewardsHelper_Filter>
};


export type QueryPreGpRewardArgs = {
  id: Scalars['ID']
};


export type QueryPreGpRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<PreGpReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<PreGpReward_Filter>
};


export type QueryGprewardArgs = {
  id: Scalars['ID']
};


export type QueryGprewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GpReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GpReward_Filter>
};


export type QueryFirstRegisterSchemeFlagArgs = {
  id: Scalars['ID']
};


export type QueryFirstRegisterSchemeFlagsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<FirstRegisterSchemeFlag_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<FirstRegisterSchemeFlag_Filter>
};


export type QueryContractInfoArgs = {
  id: Scalars['ID']
};


export type QueryContractInfosArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContractInfo_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContractInfo_Filter>
};

export type Rep = {
   __typename?: 'Rep',
  id: Scalars['ID'],
  dao?: Maybe<Dao>,
  totalSupply: Scalars['BigInt'],
};

export type Rep_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  totalSupply?: Maybe<Scalars['BigInt']>,
  totalSupply_not?: Maybe<Scalars['BigInt']>,
  totalSupply_gt?: Maybe<Scalars['BigInt']>,
  totalSupply_lt?: Maybe<Scalars['BigInt']>,
  totalSupply_gte?: Maybe<Scalars['BigInt']>,
  totalSupply_lte?: Maybe<Scalars['BigInt']>,
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>,
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum Rep_OrderBy {
  Id = 'id',
  Dao = 'dao',
  TotalSupply = 'totalSupply'
}

export type ReputationBurn = {
   __typename?: 'ReputationBurn',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  address: Scalars['Bytes'],
  amount: Scalars['BigInt'],
};

export type ReputationBurn_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  amount?: Maybe<Scalars['BigInt']>,
  amount_not?: Maybe<Scalars['BigInt']>,
  amount_gt?: Maybe<Scalars['BigInt']>,
  amount_lt?: Maybe<Scalars['BigInt']>,
  amount_gte?: Maybe<Scalars['BigInt']>,
  amount_lte?: Maybe<Scalars['BigInt']>,
  amount_in?: Maybe<Array<Scalars['BigInt']>>,
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ReputationBurn_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Address = 'address',
  Amount = 'amount'
}

export type ReputationContract = {
   __typename?: 'ReputationContract',
  id: Scalars['ID'],
  address: Scalars['Bytes'],
  totalSupply: Scalars['BigInt'],
  reputationHolders?: Maybe<Array<Scalars['String']>>,
};

export type ReputationContract_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  totalSupply?: Maybe<Scalars['BigInt']>,
  totalSupply_not?: Maybe<Scalars['BigInt']>,
  totalSupply_gt?: Maybe<Scalars['BigInt']>,
  totalSupply_lt?: Maybe<Scalars['BigInt']>,
  totalSupply_gte?: Maybe<Scalars['BigInt']>,
  totalSupply_lte?: Maybe<Scalars['BigInt']>,
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>,
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>,
  reputationHolders?: Maybe<Array<Scalars['String']>>,
  reputationHolders_not?: Maybe<Array<Scalars['String']>>,
  reputationHolders_contains?: Maybe<Array<Scalars['String']>>,
  reputationHolders_not_contains?: Maybe<Array<Scalars['String']>>,
};

export enum ReputationContract_OrderBy {
  Id = 'id',
  Address = 'address',
  TotalSupply = 'totalSupply',
  ReputationHolders = 'reputationHolders'
}

export type ReputationHolder = {
   __typename?: 'ReputationHolder',
  id: Scalars['ID'],
  contract: Scalars['Bytes'],
  address: Scalars['Bytes'],
  balance: Scalars['BigInt'],
  dao?: Maybe<Dao>,
};

export type ReputationHolder_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  balance?: Maybe<Scalars['BigInt']>,
  balance_not?: Maybe<Scalars['BigInt']>,
  balance_gt?: Maybe<Scalars['BigInt']>,
  balance_lt?: Maybe<Scalars['BigInt']>,
  balance_gte?: Maybe<Scalars['BigInt']>,
  balance_lte?: Maybe<Scalars['BigInt']>,
  balance_in?: Maybe<Array<Scalars['BigInt']>>,
  balance_not_in?: Maybe<Array<Scalars['BigInt']>>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
};

export enum ReputationHolder_OrderBy {
  Id = 'id',
  Contract = 'contract',
  Address = 'address',
  Balance = 'balance',
  Dao = 'dao'
}

export type ReputationMint = {
   __typename?: 'ReputationMint',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  address: Scalars['Bytes'],
  amount: Scalars['BigInt'],
};

export type ReputationMint_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  amount?: Maybe<Scalars['BigInt']>,
  amount_not?: Maybe<Scalars['BigInt']>,
  amount_gt?: Maybe<Scalars['BigInt']>,
  amount_lt?: Maybe<Scalars['BigInt']>,
  amount_gte?: Maybe<Scalars['BigInt']>,
  amount_lte?: Maybe<Scalars['BigInt']>,
  amount_in?: Maybe<Array<Scalars['BigInt']>>,
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum ReputationMint_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Address = 'address',
  Amount = 'amount'
}

export enum RewardReason {
  Contribution = 'Contribution',
  Proposer = 'Proposer',
  Voter = 'Voter',
  Staker = 'Staker',
  Bounty = 'Bounty'
}

export enum RewardType {
  Reputation = 'Reputation',
  Token = 'Token',
  Eth = 'ETH',
  External = 'External'
}

export type SchemeRegistrarNewSchemeProposal = {
   __typename?: 'SchemeRegistrarNewSchemeProposal',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  votingMachine: Scalars['Bytes'],
  scheme: Scalars['Bytes'],
  paramsHash: Scalars['Bytes'],
  permission: Scalars['Bytes'],
  descriptionHash: Scalars['String'],
};

export type SchemeRegistrarNewSchemeProposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  votingMachine?: Maybe<Scalars['Bytes']>,
  votingMachine_not?: Maybe<Scalars['Bytes']>,
  votingMachine_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_not_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_contains?: Maybe<Scalars['Bytes']>,
  votingMachine_not_contains?: Maybe<Scalars['Bytes']>,
  scheme?: Maybe<Scalars['Bytes']>,
  scheme_not?: Maybe<Scalars['Bytes']>,
  scheme_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_not_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_contains?: Maybe<Scalars['Bytes']>,
  scheme_not_contains?: Maybe<Scalars['Bytes']>,
  paramsHash?: Maybe<Scalars['Bytes']>,
  paramsHash_not?: Maybe<Scalars['Bytes']>,
  paramsHash_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_contains?: Maybe<Scalars['Bytes']>,
  paramsHash_not_contains?: Maybe<Scalars['Bytes']>,
  permission?: Maybe<Scalars['Bytes']>,
  permission_not?: Maybe<Scalars['Bytes']>,
  permission_in?: Maybe<Array<Scalars['Bytes']>>,
  permission_not_in?: Maybe<Array<Scalars['Bytes']>>,
  permission_contains?: Maybe<Scalars['Bytes']>,
  permission_not_contains?: Maybe<Scalars['Bytes']>,
  descriptionHash?: Maybe<Scalars['String']>,
  descriptionHash_not?: Maybe<Scalars['String']>,
  descriptionHash_gt?: Maybe<Scalars['String']>,
  descriptionHash_lt?: Maybe<Scalars['String']>,
  descriptionHash_gte?: Maybe<Scalars['String']>,
  descriptionHash_lte?: Maybe<Scalars['String']>,
  descriptionHash_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_not_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_contains?: Maybe<Scalars['String']>,
  descriptionHash_not_contains?: Maybe<Scalars['String']>,
  descriptionHash_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_not_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_ends_with?: Maybe<Scalars['String']>,
  descriptionHash_not_ends_with?: Maybe<Scalars['String']>,
};

export enum SchemeRegistrarNewSchemeProposal_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Avatar = 'avatar',
  ProposalId = 'proposalId',
  VotingMachine = 'votingMachine',
  Scheme = 'scheme',
  ParamsHash = 'paramsHash',
  Permission = 'permission',
  DescriptionHash = 'descriptionHash'
}

export type SchemeRegistrarParam = {
   __typename?: 'SchemeRegistrarParam',
  id: Scalars['ID'],
  votingMachine: Scalars['Bytes'],
  voteRegisterParams: GenesisProtocolParam,
  voteRemoveParams: GenesisProtocolParam,
};

export type SchemeRegistrarParam_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  votingMachine?: Maybe<Scalars['Bytes']>,
  votingMachine_not?: Maybe<Scalars['Bytes']>,
  votingMachine_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_not_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_contains?: Maybe<Scalars['Bytes']>,
  votingMachine_not_contains?: Maybe<Scalars['Bytes']>,
  voteRegisterParams?: Maybe<Scalars['String']>,
  voteRegisterParams_not?: Maybe<Scalars['String']>,
  voteRegisterParams_gt?: Maybe<Scalars['String']>,
  voteRegisterParams_lt?: Maybe<Scalars['String']>,
  voteRegisterParams_gte?: Maybe<Scalars['String']>,
  voteRegisterParams_lte?: Maybe<Scalars['String']>,
  voteRegisterParams_in?: Maybe<Array<Scalars['String']>>,
  voteRegisterParams_not_in?: Maybe<Array<Scalars['String']>>,
  voteRegisterParams_contains?: Maybe<Scalars['String']>,
  voteRegisterParams_not_contains?: Maybe<Scalars['String']>,
  voteRegisterParams_starts_with?: Maybe<Scalars['String']>,
  voteRegisterParams_not_starts_with?: Maybe<Scalars['String']>,
  voteRegisterParams_ends_with?: Maybe<Scalars['String']>,
  voteRegisterParams_not_ends_with?: Maybe<Scalars['String']>,
  voteRemoveParams?: Maybe<Scalars['String']>,
  voteRemoveParams_not?: Maybe<Scalars['String']>,
  voteRemoveParams_gt?: Maybe<Scalars['String']>,
  voteRemoveParams_lt?: Maybe<Scalars['String']>,
  voteRemoveParams_gte?: Maybe<Scalars['String']>,
  voteRemoveParams_lte?: Maybe<Scalars['String']>,
  voteRemoveParams_in?: Maybe<Array<Scalars['String']>>,
  voteRemoveParams_not_in?: Maybe<Array<Scalars['String']>>,
  voteRemoveParams_contains?: Maybe<Scalars['String']>,
  voteRemoveParams_not_contains?: Maybe<Scalars['String']>,
  voteRemoveParams_starts_with?: Maybe<Scalars['String']>,
  voteRemoveParams_not_starts_with?: Maybe<Scalars['String']>,
  voteRemoveParams_ends_with?: Maybe<Scalars['String']>,
  voteRemoveParams_not_ends_with?: Maybe<Scalars['String']>,
};

export enum SchemeRegistrarParam_OrderBy {
  Id = 'id',
  VotingMachine = 'votingMachine',
  VoteRegisterParams = 'voteRegisterParams',
  VoteRemoveParams = 'voteRemoveParams'
}

export type SchemeRegistrarProposal = {
   __typename?: 'SchemeRegistrarProposal',
  id: Scalars['ID'],
  dao: Dao,
  schemeToRegister?: Maybe<Scalars['Bytes']>,
  schemeToRegisterParamsHash?: Maybe<Scalars['Bytes']>,
  schemeToRegisterPermission?: Maybe<Scalars['Bytes']>,
  schemeToRemove?: Maybe<Scalars['Bytes']>,
  decision?: Maybe<Scalars['BigInt']>,
  schemeRegistered?: Maybe<Scalars['Boolean']>,
  schemeRemoved?: Maybe<Scalars['Boolean']>,
};

export type SchemeRegistrarProposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  schemeToRegister?: Maybe<Scalars['Bytes']>,
  schemeToRegister_not?: Maybe<Scalars['Bytes']>,
  schemeToRegister_in?: Maybe<Array<Scalars['Bytes']>>,
  schemeToRegister_not_in?: Maybe<Array<Scalars['Bytes']>>,
  schemeToRegister_contains?: Maybe<Scalars['Bytes']>,
  schemeToRegister_not_contains?: Maybe<Scalars['Bytes']>,
  schemeToRegisterParamsHash?: Maybe<Scalars['Bytes']>,
  schemeToRegisterParamsHash_not?: Maybe<Scalars['Bytes']>,
  schemeToRegisterParamsHash_in?: Maybe<Array<Scalars['Bytes']>>,
  schemeToRegisterParamsHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  schemeToRegisterParamsHash_contains?: Maybe<Scalars['Bytes']>,
  schemeToRegisterParamsHash_not_contains?: Maybe<Scalars['Bytes']>,
  schemeToRegisterPermission?: Maybe<Scalars['Bytes']>,
  schemeToRegisterPermission_not?: Maybe<Scalars['Bytes']>,
  schemeToRegisterPermission_in?: Maybe<Array<Scalars['Bytes']>>,
  schemeToRegisterPermission_not_in?: Maybe<Array<Scalars['Bytes']>>,
  schemeToRegisterPermission_contains?: Maybe<Scalars['Bytes']>,
  schemeToRegisterPermission_not_contains?: Maybe<Scalars['Bytes']>,
  schemeToRemove?: Maybe<Scalars['Bytes']>,
  schemeToRemove_not?: Maybe<Scalars['Bytes']>,
  schemeToRemove_in?: Maybe<Array<Scalars['Bytes']>>,
  schemeToRemove_not_in?: Maybe<Array<Scalars['Bytes']>>,
  schemeToRemove_contains?: Maybe<Scalars['Bytes']>,
  schemeToRemove_not_contains?: Maybe<Scalars['Bytes']>,
  decision?: Maybe<Scalars['BigInt']>,
  decision_not?: Maybe<Scalars['BigInt']>,
  decision_gt?: Maybe<Scalars['BigInt']>,
  decision_lt?: Maybe<Scalars['BigInt']>,
  decision_gte?: Maybe<Scalars['BigInt']>,
  decision_lte?: Maybe<Scalars['BigInt']>,
  decision_in?: Maybe<Array<Scalars['BigInt']>>,
  decision_not_in?: Maybe<Array<Scalars['BigInt']>>,
  schemeRegistered?: Maybe<Scalars['Boolean']>,
  schemeRegistered_not?: Maybe<Scalars['Boolean']>,
  schemeRegistered_in?: Maybe<Array<Scalars['Boolean']>>,
  schemeRegistered_not_in?: Maybe<Array<Scalars['Boolean']>>,
  schemeRemoved?: Maybe<Scalars['Boolean']>,
  schemeRemoved_not?: Maybe<Scalars['Boolean']>,
  schemeRemoved_in?: Maybe<Array<Scalars['Boolean']>>,
  schemeRemoved_not_in?: Maybe<Array<Scalars['Boolean']>>,
};

export enum SchemeRegistrarProposal_OrderBy {
  Id = 'id',
  Dao = 'dao',
  SchemeToRegister = 'schemeToRegister',
  SchemeToRegisterParamsHash = 'schemeToRegisterParamsHash',
  SchemeToRegisterPermission = 'schemeToRegisterPermission',
  SchemeToRemove = 'schemeToRemove',
  Decision = 'decision',
  SchemeRegistered = 'schemeRegistered',
  SchemeRemoved = 'schemeRemoved'
}

export type SchemeRegistrarProposalExecuted = {
   __typename?: 'SchemeRegistrarProposalExecuted',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  decision: Scalars['BigInt'],
};

export type SchemeRegistrarProposalExecuted_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  decision?: Maybe<Scalars['BigInt']>,
  decision_not?: Maybe<Scalars['BigInt']>,
  decision_gt?: Maybe<Scalars['BigInt']>,
  decision_lt?: Maybe<Scalars['BigInt']>,
  decision_gte?: Maybe<Scalars['BigInt']>,
  decision_lte?: Maybe<Scalars['BigInt']>,
  decision_in?: Maybe<Array<Scalars['BigInt']>>,
  decision_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum SchemeRegistrarProposalExecuted_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Avatar = 'avatar',
  ProposalId = 'proposalId',
  Decision = 'decision'
}

export type SchemeRegistrarRemoveSchemeProposal = {
   __typename?: 'SchemeRegistrarRemoveSchemeProposal',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatar: Scalars['Bytes'],
  proposalId: Scalars['Bytes'],
  votingMachine: Scalars['Bytes'],
  scheme: Scalars['Bytes'],
  descriptionHash: Scalars['String'],
};

export type SchemeRegistrarRemoveSchemeProposal_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatar?: Maybe<Scalars['Bytes']>,
  avatar_not?: Maybe<Scalars['Bytes']>,
  avatar_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatar_contains?: Maybe<Scalars['Bytes']>,
  avatar_not_contains?: Maybe<Scalars['Bytes']>,
  proposalId?: Maybe<Scalars['Bytes']>,
  proposalId_not?: Maybe<Scalars['Bytes']>,
  proposalId_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_not_in?: Maybe<Array<Scalars['Bytes']>>,
  proposalId_contains?: Maybe<Scalars['Bytes']>,
  proposalId_not_contains?: Maybe<Scalars['Bytes']>,
  votingMachine?: Maybe<Scalars['Bytes']>,
  votingMachine_not?: Maybe<Scalars['Bytes']>,
  votingMachine_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_not_in?: Maybe<Array<Scalars['Bytes']>>,
  votingMachine_contains?: Maybe<Scalars['Bytes']>,
  votingMachine_not_contains?: Maybe<Scalars['Bytes']>,
  scheme?: Maybe<Scalars['Bytes']>,
  scheme_not?: Maybe<Scalars['Bytes']>,
  scheme_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_not_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_contains?: Maybe<Scalars['Bytes']>,
  scheme_not_contains?: Maybe<Scalars['Bytes']>,
  descriptionHash?: Maybe<Scalars['String']>,
  descriptionHash_not?: Maybe<Scalars['String']>,
  descriptionHash_gt?: Maybe<Scalars['String']>,
  descriptionHash_lt?: Maybe<Scalars['String']>,
  descriptionHash_gte?: Maybe<Scalars['String']>,
  descriptionHash_lte?: Maybe<Scalars['String']>,
  descriptionHash_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_not_in?: Maybe<Array<Scalars['String']>>,
  descriptionHash_contains?: Maybe<Scalars['String']>,
  descriptionHash_not_contains?: Maybe<Scalars['String']>,
  descriptionHash_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_not_starts_with?: Maybe<Scalars['String']>,
  descriptionHash_ends_with?: Maybe<Scalars['String']>,
  descriptionHash_not_ends_with?: Maybe<Scalars['String']>,
};

export enum SchemeRegistrarRemoveSchemeProposal_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Avatar = 'avatar',
  ProposalId = 'proposalId',
  VotingMachine = 'votingMachine',
  Scheme = 'scheme',
  DescriptionHash = 'descriptionHash'
}

export type Subscription = {
   __typename?: 'Subscription',
  avatarContract?: Maybe<AvatarContract>,
  avatarContracts: Array<AvatarContract>,
  contributionRewardRedeemReputation?: Maybe<ContributionRewardRedeemReputation>,
  contributionRewardRedeemReputations: Array<ContributionRewardRedeemReputation>,
  contributionRewardRedeemNativeToken?: Maybe<ContributionRewardRedeemNativeToken>,
  contributionRewardRedeemNativeTokens: Array<ContributionRewardRedeemNativeToken>,
  contributionRewardRedeemExternalToken?: Maybe<ContributionRewardRedeemExternalToken>,
  contributionRewardRedeemExternalTokens: Array<ContributionRewardRedeemExternalToken>,
  contributionRewardRedeemEther?: Maybe<ContributionRewardRedeemEther>,
  contributionRewardRedeemEthers: Array<ContributionRewardRedeemEther>,
  contributionRewardProposalResolved?: Maybe<ContributionRewardProposalResolved>,
  contributionRewardProposalResolveds: Array<ContributionRewardProposalResolved>,
  contributionRewardNewContributionProposal?: Maybe<ContributionRewardNewContributionProposal>,
  contributionRewardNewContributionProposals: Array<ContributionRewardNewContributionProposal>,
  contributionRewardProposal?: Maybe<ContributionRewardProposal>,
  contributionRewardProposals: Array<ContributionRewardProposal>,
  controllerOrganization?: Maybe<ControllerOrganization>,
  controllerOrganizations: Array<ControllerOrganization>,
  controllerScheme?: Maybe<ControllerScheme>,
  controllerSchemes: Array<ControllerScheme>,
  controllerGlobalConstraint?: Maybe<ControllerGlobalConstraint>,
  controllerGlobalConstraints: Array<ControllerGlobalConstraint>,
  controllerRegisterScheme?: Maybe<ControllerRegisterScheme>,
  controllerRegisterSchemes: Array<ControllerRegisterScheme>,
  controllerUnregisterScheme?: Maybe<ControllerUnregisterScheme>,
  controllerUnregisterSchemes: Array<ControllerUnregisterScheme>,
  controllerUpgradeController?: Maybe<ControllerUpgradeController>,
  controllerUpgradeControllers: Array<ControllerUpgradeController>,
  controllerAddGlobalConstraint?: Maybe<ControllerAddGlobalConstraint>,
  controllerAddGlobalConstraints: Array<ControllerAddGlobalConstraint>,
  controllerRemoveGlobalConstraint?: Maybe<ControllerRemoveGlobalConstraint>,
  controllerRemoveGlobalConstraints: Array<ControllerRemoveGlobalConstraint>,
  contributionRewardParam?: Maybe<ContributionRewardParam>,
  contributionRewardParams: Array<ContributionRewardParam>,
  schemeRegistrarParam?: Maybe<SchemeRegistrarParam>,
  schemeRegistrarParams: Array<SchemeRegistrarParam>,
  genericSchemeParam?: Maybe<GenericSchemeParam>,
  genericSchemeParams: Array<GenericSchemeParam>,
  genesisProtocolParam?: Maybe<GenesisProtocolParam>,
  genesisProtocolParams: Array<GenesisProtocolParam>,
  daoregistryContract?: Maybe<DaoRegistryContract>,
  daoregistryContracts: Array<DaoRegistryContract>,
  tokenContract?: Maybe<TokenContract>,
  tokenContracts: Array<TokenContract>,
  tokenHolder?: Maybe<TokenHolder>,
  tokenHolders: Array<TokenHolder>,
  allowance?: Maybe<Allowance>,
  allowances: Array<Allowance>,
  tokenTransfer?: Maybe<TokenTransfer>,
  tokenTransfers: Array<TokenTransfer>,
  tokenApproval?: Maybe<TokenApproval>,
  tokenApprovals: Array<TokenApproval>,
  genericSchemeProposal?: Maybe<GenericSchemeProposal>,
  genericSchemeProposals: Array<GenericSchemeProposal>,
  genesisProtocolProposal?: Maybe<GenesisProtocolProposal>,
  genesisProtocolProposals: Array<GenesisProtocolProposal>,
  genesisProtocolVote?: Maybe<GenesisProtocolVote>,
  genesisProtocolVotes: Array<GenesisProtocolVote>,
  genesisProtocolStake?: Maybe<GenesisProtocolStake>,
  genesisProtocolStakes: Array<GenesisProtocolStake>,
  genesisProtocolRedemption?: Maybe<GenesisProtocolRedemption>,
  genesisProtocolRedemptions: Array<GenesisProtocolRedemption>,
  genesisProtocolReward?: Maybe<GenesisProtocolReward>,
  genesisProtocolRewards: Array<GenesisProtocolReward>,
  genesisProtocolExecuteProposal?: Maybe<GenesisProtocolExecuteProposal>,
  genesisProtocolExecuteProposals: Array<GenesisProtocolExecuteProposal>,
  genesisProtocolGPExecuteProposal?: Maybe<GenesisProtocolGpExecuteProposal>,
  genesisProtocolGPExecuteProposals: Array<GenesisProtocolGpExecuteProposal>,
  reputationContract?: Maybe<ReputationContract>,
  reputationContracts: Array<ReputationContract>,
  reputationHolder?: Maybe<ReputationHolder>,
  reputationHolders: Array<ReputationHolder>,
  reputationMint?: Maybe<ReputationMint>,
  reputationMints: Array<ReputationMint>,
  reputationBurn?: Maybe<ReputationBurn>,
  reputationBurns: Array<ReputationBurn>,
  schemeRegistrarNewSchemeProposal?: Maybe<SchemeRegistrarNewSchemeProposal>,
  schemeRegistrarNewSchemeProposals: Array<SchemeRegistrarNewSchemeProposal>,
  schemeRegistrarRemoveSchemeProposal?: Maybe<SchemeRegistrarRemoveSchemeProposal>,
  schemeRegistrarRemoveSchemeProposals: Array<SchemeRegistrarRemoveSchemeProposal>,
  schemeRegistrarProposalExecuted?: Maybe<SchemeRegistrarProposalExecuted>,
  schemeRegistrarProposalExecuteds: Array<SchemeRegistrarProposalExecuted>,
  schemeRegistrarProposal?: Maybe<SchemeRegistrarProposal>,
  schemeRegistrarProposals: Array<SchemeRegistrarProposal>,
  ucontrollerOrganization?: Maybe<UControllerOrganization>,
  ucontrollerOrganizations: Array<UControllerOrganization>,
  ucontrollerGlobalConstraint?: Maybe<UControllerGlobalConstraint>,
  ucontrollerGlobalConstraints: Array<UControllerGlobalConstraint>,
  ucontrollerRegisterScheme?: Maybe<UControllerRegisterScheme>,
  ucontrollerRegisterSchemes: Array<UControllerRegisterScheme>,
  ucontrollerUnregisterScheme?: Maybe<UControllerUnregisterScheme>,
  ucontrollerUnregisterSchemes: Array<UControllerUnregisterScheme>,
  ucontrollerUpgradeController?: Maybe<UControllerUpgradeController>,
  ucontrollerUpgradeControllers: Array<UControllerUpgradeController>,
  ucontrollerAddGlobalConstraint?: Maybe<UControllerAddGlobalConstraint>,
  ucontrollerAddGlobalConstraints: Array<UControllerAddGlobalConstraint>,
  ucontrollerRemoveGlobalConstraint?: Maybe<UControllerRemoveGlobalConstraint>,
  ucontrollerRemoveGlobalConstraints: Array<UControllerRemoveGlobalConstraint>,
  debug?: Maybe<Debug>,
  debugs: Array<Debug>,
  dao?: Maybe<Dao>,
  daos: Array<Dao>,
  gpqueue?: Maybe<GpQueue>,
  gpqueues: Array<GpQueue>,
  rep?: Maybe<Rep>,
  reps: Array<Rep>,
  token?: Maybe<Token>,
  tokens: Array<Token>,
  proposal?: Maybe<Proposal>,
  proposals: Array<Proposal>,
  proposalStake?: Maybe<ProposalStake>,
  proposalStakes: Array<ProposalStake>,
  proposalVote?: Maybe<ProposalVote>,
  proposalVotes: Array<ProposalVote>,
  gprewardsHelper?: Maybe<GpRewardsHelper>,
  gprewardsHelpers: Array<GpRewardsHelper>,
  preGPReward?: Maybe<PreGpReward>,
  preGPRewards: Array<PreGpReward>,
  gpreward?: Maybe<GpReward>,
  gprewards: Array<GpReward>,
  firstRegisterSchemeFlag?: Maybe<FirstRegisterSchemeFlag>,
  firstRegisterSchemeFlags: Array<FirstRegisterSchemeFlag>,
  contractInfo?: Maybe<ContractInfo>,
  contractInfos: Array<ContractInfo>,
};


export type SubscriptionAvatarContractArgs = {
  id: Scalars['ID']
};


export type SubscriptionAvatarContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<AvatarContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<AvatarContract_Filter>
};


export type SubscriptionContributionRewardRedeemReputationArgs = {
  id: Scalars['ID']
};


export type SubscriptionContributionRewardRedeemReputationsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardRedeemReputation_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardRedeemReputation_Filter>
};


export type SubscriptionContributionRewardRedeemNativeTokenArgs = {
  id: Scalars['ID']
};


export type SubscriptionContributionRewardRedeemNativeTokensArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardRedeemNativeToken_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardRedeemNativeToken_Filter>
};


export type SubscriptionContributionRewardRedeemExternalTokenArgs = {
  id: Scalars['ID']
};


export type SubscriptionContributionRewardRedeemExternalTokensArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardRedeemExternalToken_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardRedeemExternalToken_Filter>
};


export type SubscriptionContributionRewardRedeemEtherArgs = {
  id: Scalars['ID']
};


export type SubscriptionContributionRewardRedeemEthersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardRedeemEther_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardRedeemEther_Filter>
};


export type SubscriptionContributionRewardProposalResolvedArgs = {
  id: Scalars['ID']
};


export type SubscriptionContributionRewardProposalResolvedsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardProposalResolved_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardProposalResolved_Filter>
};


export type SubscriptionContributionRewardNewContributionProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionContributionRewardNewContributionProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardNewContributionProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardNewContributionProposal_Filter>
};


export type SubscriptionContributionRewardProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionContributionRewardProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardProposal_Filter>
};


export type SubscriptionControllerOrganizationArgs = {
  id: Scalars['ID']
};


export type SubscriptionControllerOrganizationsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerOrganization_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerOrganization_Filter>
};


export type SubscriptionControllerSchemeArgs = {
  id: Scalars['ID']
};


export type SubscriptionControllerSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerScheme_Filter>
};


export type SubscriptionControllerGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type SubscriptionControllerGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerGlobalConstraint_Filter>
};


export type SubscriptionControllerRegisterSchemeArgs = {
  id: Scalars['ID']
};


export type SubscriptionControllerRegisterSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerRegisterScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerRegisterScheme_Filter>
};


export type SubscriptionControllerUnregisterSchemeArgs = {
  id: Scalars['ID']
};


export type SubscriptionControllerUnregisterSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerUnregisterScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerUnregisterScheme_Filter>
};


export type SubscriptionControllerUpgradeControllerArgs = {
  id: Scalars['ID']
};


export type SubscriptionControllerUpgradeControllersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerUpgradeController_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerUpgradeController_Filter>
};


export type SubscriptionControllerAddGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type SubscriptionControllerAddGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerAddGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerAddGlobalConstraint_Filter>
};


export type SubscriptionControllerRemoveGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type SubscriptionControllerRemoveGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ControllerRemoveGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ControllerRemoveGlobalConstraint_Filter>
};


export type SubscriptionContributionRewardParamArgs = {
  id: Scalars['ID']
};


export type SubscriptionContributionRewardParamsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContributionRewardParam_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContributionRewardParam_Filter>
};


export type SubscriptionSchemeRegistrarParamArgs = {
  id: Scalars['ID']
};


export type SubscriptionSchemeRegistrarParamsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarParam_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarParam_Filter>
};


export type SubscriptionGenericSchemeParamArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenericSchemeParamsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenericSchemeParam_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenericSchemeParam_Filter>
};


export type SubscriptionGenesisProtocolParamArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenesisProtocolParamsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolParam_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolParam_Filter>
};


export type SubscriptionDaoregistryContractArgs = {
  id: Scalars['ID']
};


export type SubscriptionDaoregistryContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<DaoRegistryContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<DaoRegistryContract_Filter>
};


export type SubscriptionTokenContractArgs = {
  id: Scalars['ID']
};


export type SubscriptionTokenContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TokenContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TokenContract_Filter>
};


export type SubscriptionTokenHolderArgs = {
  id: Scalars['ID']
};


export type SubscriptionTokenHoldersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TokenHolder_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TokenHolder_Filter>
};


export type SubscriptionAllowanceArgs = {
  id: Scalars['ID']
};


export type SubscriptionAllowancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Allowance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Allowance_Filter>
};


export type SubscriptionTokenTransferArgs = {
  id: Scalars['ID']
};


export type SubscriptionTokenTransfersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TokenTransfer_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TokenTransfer_Filter>
};


export type SubscriptionTokenApprovalArgs = {
  id: Scalars['ID']
};


export type SubscriptionTokenApprovalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TokenApproval_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TokenApproval_Filter>
};


export type SubscriptionGenericSchemeProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenericSchemeProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenericSchemeProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenericSchemeProposal_Filter>
};


export type SubscriptionGenesisProtocolProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenesisProtocolProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolProposal_Filter>
};


export type SubscriptionGenesisProtocolVoteArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenesisProtocolVotesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolVote_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolVote_Filter>
};


export type SubscriptionGenesisProtocolStakeArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenesisProtocolStakesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolStake_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolStake_Filter>
};


export type SubscriptionGenesisProtocolRedemptionArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenesisProtocolRedemptionsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolRedemption_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolRedemption_Filter>
};


export type SubscriptionGenesisProtocolRewardArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenesisProtocolRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolReward_Filter>
};


export type SubscriptionGenesisProtocolExecuteProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenesisProtocolExecuteProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolExecuteProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolExecuteProposal_Filter>
};


export type SubscriptionGenesisProtocolGpExecuteProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionGenesisProtocolGpExecuteProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GenesisProtocolGpExecuteProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GenesisProtocolGpExecuteProposal_Filter>
};


export type SubscriptionReputationContractArgs = {
  id: Scalars['ID']
};


export type SubscriptionReputationContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ReputationContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ReputationContract_Filter>
};


export type SubscriptionReputationHolderArgs = {
  id: Scalars['ID']
};


export type SubscriptionReputationHoldersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ReputationHolder_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ReputationHolder_Filter>
};


export type SubscriptionReputationMintArgs = {
  id: Scalars['ID']
};


export type SubscriptionReputationMintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ReputationMint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ReputationMint_Filter>
};


export type SubscriptionReputationBurnArgs = {
  id: Scalars['ID']
};


export type SubscriptionReputationBurnsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ReputationBurn_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ReputationBurn_Filter>
};


export type SubscriptionSchemeRegistrarNewSchemeProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionSchemeRegistrarNewSchemeProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarNewSchemeProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarNewSchemeProposal_Filter>
};


export type SubscriptionSchemeRegistrarRemoveSchemeProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionSchemeRegistrarRemoveSchemeProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarRemoveSchemeProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarRemoveSchemeProposal_Filter>
};


export type SubscriptionSchemeRegistrarProposalExecutedArgs = {
  id: Scalars['ID']
};


export type SubscriptionSchemeRegistrarProposalExecutedsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarProposalExecuted_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarProposalExecuted_Filter>
};


export type SubscriptionSchemeRegistrarProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionSchemeRegistrarProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SchemeRegistrarProposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SchemeRegistrarProposal_Filter>
};


export type SubscriptionUcontrollerOrganizationArgs = {
  id: Scalars['ID']
};


export type SubscriptionUcontrollerOrganizationsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerOrganization_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerOrganization_Filter>
};


export type SubscriptionUcontrollerGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type SubscriptionUcontrollerGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerGlobalConstraint_Filter>
};


export type SubscriptionUcontrollerRegisterSchemeArgs = {
  id: Scalars['ID']
};


export type SubscriptionUcontrollerRegisterSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerRegisterScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerRegisterScheme_Filter>
};


export type SubscriptionUcontrollerUnregisterSchemeArgs = {
  id: Scalars['ID']
};


export type SubscriptionUcontrollerUnregisterSchemesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerUnregisterScheme_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerUnregisterScheme_Filter>
};


export type SubscriptionUcontrollerUpgradeControllerArgs = {
  id: Scalars['ID']
};


export type SubscriptionUcontrollerUpgradeControllersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerUpgradeController_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerUpgradeController_Filter>
};


export type SubscriptionUcontrollerAddGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type SubscriptionUcontrollerAddGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerAddGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerAddGlobalConstraint_Filter>
};


export type SubscriptionUcontrollerRemoveGlobalConstraintArgs = {
  id: Scalars['ID']
};


export type SubscriptionUcontrollerRemoveGlobalConstraintsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<UControllerRemoveGlobalConstraint_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<UControllerRemoveGlobalConstraint_Filter>
};


export type SubscriptionDebugArgs = {
  id: Scalars['ID']
};


export type SubscriptionDebugsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Debug_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Debug_Filter>
};


export type SubscriptionDaoArgs = {
  id: Scalars['ID']
};


export type SubscriptionDaosArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Dao_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Dao_Filter>
};


export type SubscriptionGpqueueArgs = {
  id: Scalars['ID']
};


export type SubscriptionGpqueuesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GpQueue_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GpQueue_Filter>
};


export type SubscriptionRepArgs = {
  id: Scalars['ID']
};


export type SubscriptionRepsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Rep_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Rep_Filter>
};


export type SubscriptionTokenArgs = {
  id: Scalars['ID']
};


export type SubscriptionTokensArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Token_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Token_Filter>
};


export type SubscriptionProposalArgs = {
  id: Scalars['ID']
};


export type SubscriptionProposalsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Proposal_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Proposal_Filter>
};


export type SubscriptionProposalStakeArgs = {
  id: Scalars['ID']
};


export type SubscriptionProposalStakesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ProposalStake_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ProposalStake_Filter>
};


export type SubscriptionProposalVoteArgs = {
  id: Scalars['ID']
};


export type SubscriptionProposalVotesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ProposalVote_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ProposalVote_Filter>
};


export type SubscriptionGprewardsHelperArgs = {
  id: Scalars['ID']
};


export type SubscriptionGprewardsHelpersArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GpRewardsHelper_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GpRewardsHelper_Filter>
};


export type SubscriptionPreGpRewardArgs = {
  id: Scalars['ID']
};


export type SubscriptionPreGpRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<PreGpReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<PreGpReward_Filter>
};


export type SubscriptionGprewardArgs = {
  id: Scalars['ID']
};


export type SubscriptionGprewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<GpReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<GpReward_Filter>
};


export type SubscriptionFirstRegisterSchemeFlagArgs = {
  id: Scalars['ID']
};


export type SubscriptionFirstRegisterSchemeFlagsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<FirstRegisterSchemeFlag_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<FirstRegisterSchemeFlag_Filter>
};


export type SubscriptionContractInfoArgs = {
  id: Scalars['ID']
};


export type SubscriptionContractInfosArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ContractInfo_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ContractInfo_Filter>
};

export type Token = {
   __typename?: 'Token',
  id: Scalars['ID'],
  dao?: Maybe<Dao>,
  name: Scalars['String'],
  symbol: Scalars['String'],
  totalSupply: Scalars['BigInt'],
};

export type Token_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  dao?: Maybe<Scalars['String']>,
  dao_not?: Maybe<Scalars['String']>,
  dao_gt?: Maybe<Scalars['String']>,
  dao_lt?: Maybe<Scalars['String']>,
  dao_gte?: Maybe<Scalars['String']>,
  dao_lte?: Maybe<Scalars['String']>,
  dao_in?: Maybe<Array<Scalars['String']>>,
  dao_not_in?: Maybe<Array<Scalars['String']>>,
  dao_contains?: Maybe<Scalars['String']>,
  dao_not_contains?: Maybe<Scalars['String']>,
  dao_starts_with?: Maybe<Scalars['String']>,
  dao_not_starts_with?: Maybe<Scalars['String']>,
  dao_ends_with?: Maybe<Scalars['String']>,
  dao_not_ends_with?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_lt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_contains?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
  symbol?: Maybe<Scalars['String']>,
  symbol_not?: Maybe<Scalars['String']>,
  symbol_gt?: Maybe<Scalars['String']>,
  symbol_lt?: Maybe<Scalars['String']>,
  symbol_gte?: Maybe<Scalars['String']>,
  symbol_lte?: Maybe<Scalars['String']>,
  symbol_in?: Maybe<Array<Scalars['String']>>,
  symbol_not_in?: Maybe<Array<Scalars['String']>>,
  symbol_contains?: Maybe<Scalars['String']>,
  symbol_not_contains?: Maybe<Scalars['String']>,
  symbol_starts_with?: Maybe<Scalars['String']>,
  symbol_not_starts_with?: Maybe<Scalars['String']>,
  symbol_ends_with?: Maybe<Scalars['String']>,
  symbol_not_ends_with?: Maybe<Scalars['String']>,
  totalSupply?: Maybe<Scalars['BigInt']>,
  totalSupply_not?: Maybe<Scalars['BigInt']>,
  totalSupply_gt?: Maybe<Scalars['BigInt']>,
  totalSupply_lt?: Maybe<Scalars['BigInt']>,
  totalSupply_gte?: Maybe<Scalars['BigInt']>,
  totalSupply_lte?: Maybe<Scalars['BigInt']>,
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>,
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum Token_OrderBy {
  Id = 'id',
  Dao = 'dao',
  Name = 'name',
  Symbol = 'symbol',
  TotalSupply = 'totalSupply'
}

export type TokenApproval = {
   __typename?: 'TokenApproval',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  owner: Scalars['Bytes'],
  spender: Scalars['Bytes'],
  value: Scalars['BigInt'],
};

export type TokenApproval_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  owner?: Maybe<Scalars['Bytes']>,
  owner_not?: Maybe<Scalars['Bytes']>,
  owner_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_contains?: Maybe<Scalars['Bytes']>,
  owner_not_contains?: Maybe<Scalars['Bytes']>,
  spender?: Maybe<Scalars['Bytes']>,
  spender_not?: Maybe<Scalars['Bytes']>,
  spender_in?: Maybe<Array<Scalars['Bytes']>>,
  spender_not_in?: Maybe<Array<Scalars['Bytes']>>,
  spender_contains?: Maybe<Scalars['Bytes']>,
  spender_not_contains?: Maybe<Scalars['Bytes']>,
  value?: Maybe<Scalars['BigInt']>,
  value_not?: Maybe<Scalars['BigInt']>,
  value_gt?: Maybe<Scalars['BigInt']>,
  value_lt?: Maybe<Scalars['BigInt']>,
  value_gte?: Maybe<Scalars['BigInt']>,
  value_lte?: Maybe<Scalars['BigInt']>,
  value_in?: Maybe<Array<Scalars['BigInt']>>,
  value_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum TokenApproval_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  Owner = 'owner',
  Spender = 'spender',
  Value = 'value'
}

export type TokenContract = {
   __typename?: 'TokenContract',
  id: Scalars['ID'],
  address: Scalars['Bytes'],
  totalSupply: Scalars['BigInt'],
  owner: Scalars['Bytes'],
  tokenHolders?: Maybe<Array<Scalars['String']>>,
};

export type TokenContract_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  totalSupply?: Maybe<Scalars['BigInt']>,
  totalSupply_not?: Maybe<Scalars['BigInt']>,
  totalSupply_gt?: Maybe<Scalars['BigInt']>,
  totalSupply_lt?: Maybe<Scalars['BigInt']>,
  totalSupply_gte?: Maybe<Scalars['BigInt']>,
  totalSupply_lte?: Maybe<Scalars['BigInt']>,
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>,
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>,
  owner?: Maybe<Scalars['Bytes']>,
  owner_not?: Maybe<Scalars['Bytes']>,
  owner_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>,
  owner_contains?: Maybe<Scalars['Bytes']>,
  owner_not_contains?: Maybe<Scalars['Bytes']>,
  tokenHolders?: Maybe<Array<Scalars['String']>>,
  tokenHolders_not?: Maybe<Array<Scalars['String']>>,
  tokenHolders_contains?: Maybe<Array<Scalars['String']>>,
  tokenHolders_not_contains?: Maybe<Array<Scalars['String']>>,
};

export enum TokenContract_OrderBy {
  Id = 'id',
  Address = 'address',
  TotalSupply = 'totalSupply',
  Owner = 'owner',
  TokenHolders = 'tokenHolders'
}

export type TokenHolder = {
   __typename?: 'TokenHolder',
  id: Scalars['ID'],
  contract: Scalars['Bytes'],
  address: Scalars['Bytes'],
  balance: Scalars['BigInt'],
};

export type TokenHolder_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  balance?: Maybe<Scalars['BigInt']>,
  balance_not?: Maybe<Scalars['BigInt']>,
  balance_gt?: Maybe<Scalars['BigInt']>,
  balance_lt?: Maybe<Scalars['BigInt']>,
  balance_gte?: Maybe<Scalars['BigInt']>,
  balance_lte?: Maybe<Scalars['BigInt']>,
  balance_in?: Maybe<Array<Scalars['BigInt']>>,
  balance_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum TokenHolder_OrderBy {
  Id = 'id',
  Contract = 'contract',
  Address = 'address',
  Balance = 'balance'
}

export type TokenTransfer = {
   __typename?: 'TokenTransfer',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  from: Scalars['Bytes'],
  to: Scalars['Bytes'],
  value: Scalars['BigInt'],
};

export type TokenTransfer_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  from?: Maybe<Scalars['Bytes']>,
  from_not?: Maybe<Scalars['Bytes']>,
  from_in?: Maybe<Array<Scalars['Bytes']>>,
  from_not_in?: Maybe<Array<Scalars['Bytes']>>,
  from_contains?: Maybe<Scalars['Bytes']>,
  from_not_contains?: Maybe<Scalars['Bytes']>,
  to?: Maybe<Scalars['Bytes']>,
  to_not?: Maybe<Scalars['Bytes']>,
  to_in?: Maybe<Array<Scalars['Bytes']>>,
  to_not_in?: Maybe<Array<Scalars['Bytes']>>,
  to_contains?: Maybe<Scalars['Bytes']>,
  to_not_contains?: Maybe<Scalars['Bytes']>,
  value?: Maybe<Scalars['BigInt']>,
  value_not?: Maybe<Scalars['BigInt']>,
  value_gt?: Maybe<Scalars['BigInt']>,
  value_lt?: Maybe<Scalars['BigInt']>,
  value_gte?: Maybe<Scalars['BigInt']>,
  value_lte?: Maybe<Scalars['BigInt']>,
  value_in?: Maybe<Array<Scalars['BigInt']>>,
  value_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum TokenTransfer_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Contract = 'contract',
  From = 'from',
  To = 'to',
  Value = 'value'
}

export type UControllerAddGlobalConstraint = {
   __typename?: 'UControllerAddGlobalConstraint',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  avatarAddress: Scalars['Bytes'],
  globalConstraint: Scalars['Bytes'],
  paramsHash: Scalars['Bytes'],
  type: Scalars['String'],
};

export type UControllerAddGlobalConstraint_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  globalConstraint?: Maybe<Scalars['Bytes']>,
  globalConstraint_not?: Maybe<Scalars['Bytes']>,
  globalConstraint_in?: Maybe<Array<Scalars['Bytes']>>,
  globalConstraint_not_in?: Maybe<Array<Scalars['Bytes']>>,
  globalConstraint_contains?: Maybe<Scalars['Bytes']>,
  globalConstraint_not_contains?: Maybe<Scalars['Bytes']>,
  paramsHash?: Maybe<Scalars['Bytes']>,
  paramsHash_not?: Maybe<Scalars['Bytes']>,
  paramsHash_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_contains?: Maybe<Scalars['Bytes']>,
  paramsHash_not_contains?: Maybe<Scalars['Bytes']>,
  type?: Maybe<Scalars['String']>,
  type_not?: Maybe<Scalars['String']>,
  type_gt?: Maybe<Scalars['String']>,
  type_lt?: Maybe<Scalars['String']>,
  type_gte?: Maybe<Scalars['String']>,
  type_lte?: Maybe<Scalars['String']>,
  type_in?: Maybe<Array<Scalars['String']>>,
  type_not_in?: Maybe<Array<Scalars['String']>>,
  type_contains?: Maybe<Scalars['String']>,
  type_not_contains?: Maybe<Scalars['String']>,
  type_starts_with?: Maybe<Scalars['String']>,
  type_not_starts_with?: Maybe<Scalars['String']>,
  type_ends_with?: Maybe<Scalars['String']>,
  type_not_ends_with?: Maybe<Scalars['String']>,
};

export enum UControllerAddGlobalConstraint_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  AvatarAddress = 'avatarAddress',
  GlobalConstraint = 'globalConstraint',
  ParamsHash = 'paramsHash',
  Type = 'type'
}

export type UControllerGlobalConstraint = {
   __typename?: 'UControllerGlobalConstraint',
  id: Scalars['ID'],
  avatarAddress: Scalars['Bytes'],
  address: Scalars['Bytes'],
  paramsHash: Scalars['Bytes'],
  type: Scalars['String'],
};

export type UControllerGlobalConstraint_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  paramsHash?: Maybe<Scalars['Bytes']>,
  paramsHash_not?: Maybe<Scalars['Bytes']>,
  paramsHash_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  paramsHash_contains?: Maybe<Scalars['Bytes']>,
  paramsHash_not_contains?: Maybe<Scalars['Bytes']>,
  type?: Maybe<Scalars['String']>,
  type_not?: Maybe<Scalars['String']>,
  type_gt?: Maybe<Scalars['String']>,
  type_lt?: Maybe<Scalars['String']>,
  type_gte?: Maybe<Scalars['String']>,
  type_lte?: Maybe<Scalars['String']>,
  type_in?: Maybe<Array<Scalars['String']>>,
  type_not_in?: Maybe<Array<Scalars['String']>>,
  type_contains?: Maybe<Scalars['String']>,
  type_not_contains?: Maybe<Scalars['String']>,
  type_starts_with?: Maybe<Scalars['String']>,
  type_not_starts_with?: Maybe<Scalars['String']>,
  type_ends_with?: Maybe<Scalars['String']>,
  type_not_ends_with?: Maybe<Scalars['String']>,
};

export enum UControllerGlobalConstraint_OrderBy {
  Id = 'id',
  AvatarAddress = 'avatarAddress',
  Address = 'address',
  ParamsHash = 'paramsHash',
  Type = 'type'
}

export type UControllerOrganization = {
   __typename?: 'UControllerOrganization',
  id: Scalars['ID'],
  avatarAddress: Scalars['Bytes'],
  nativeToken: TokenContract,
  nativeReputation: ReputationContract,
  controller: Scalars['Bytes'],
};

export type UControllerOrganization_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  nativeToken?: Maybe<Scalars['String']>,
  nativeToken_not?: Maybe<Scalars['String']>,
  nativeToken_gt?: Maybe<Scalars['String']>,
  nativeToken_lt?: Maybe<Scalars['String']>,
  nativeToken_gte?: Maybe<Scalars['String']>,
  nativeToken_lte?: Maybe<Scalars['String']>,
  nativeToken_in?: Maybe<Array<Scalars['String']>>,
  nativeToken_not_in?: Maybe<Array<Scalars['String']>>,
  nativeToken_contains?: Maybe<Scalars['String']>,
  nativeToken_not_contains?: Maybe<Scalars['String']>,
  nativeToken_starts_with?: Maybe<Scalars['String']>,
  nativeToken_not_starts_with?: Maybe<Scalars['String']>,
  nativeToken_ends_with?: Maybe<Scalars['String']>,
  nativeToken_not_ends_with?: Maybe<Scalars['String']>,
  nativeReputation?: Maybe<Scalars['String']>,
  nativeReputation_not?: Maybe<Scalars['String']>,
  nativeReputation_gt?: Maybe<Scalars['String']>,
  nativeReputation_lt?: Maybe<Scalars['String']>,
  nativeReputation_gte?: Maybe<Scalars['String']>,
  nativeReputation_lte?: Maybe<Scalars['String']>,
  nativeReputation_in?: Maybe<Array<Scalars['String']>>,
  nativeReputation_not_in?: Maybe<Array<Scalars['String']>>,
  nativeReputation_contains?: Maybe<Scalars['String']>,
  nativeReputation_not_contains?: Maybe<Scalars['String']>,
  nativeReputation_starts_with?: Maybe<Scalars['String']>,
  nativeReputation_not_starts_with?: Maybe<Scalars['String']>,
  nativeReputation_ends_with?: Maybe<Scalars['String']>,
  nativeReputation_not_ends_with?: Maybe<Scalars['String']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum UControllerOrganization_OrderBy {
  Id = 'id',
  AvatarAddress = 'avatarAddress',
  NativeToken = 'nativeToken',
  NativeReputation = 'nativeReputation',
  Controller = 'controller'
}

export type UControllerRegisterScheme = {
   __typename?: 'UControllerRegisterScheme',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatarAddress: Scalars['Bytes'],
  scheme: Scalars['Bytes'],
};

export type UControllerRegisterScheme_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  scheme?: Maybe<Scalars['Bytes']>,
  scheme_not?: Maybe<Scalars['Bytes']>,
  scheme_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_not_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_contains?: Maybe<Scalars['Bytes']>,
  scheme_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum UControllerRegisterScheme_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  Contract = 'contract',
  AvatarAddress = 'avatarAddress',
  Scheme = 'scheme'
}

export type UControllerRemoveGlobalConstraint = {
   __typename?: 'UControllerRemoveGlobalConstraint',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  avatarAddress: Scalars['Bytes'],
  globalConstraint: Scalars['Bytes'],
  isPre?: Maybe<Scalars['Boolean']>,
};

export type UControllerRemoveGlobalConstraint_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  globalConstraint?: Maybe<Scalars['Bytes']>,
  globalConstraint_not?: Maybe<Scalars['Bytes']>,
  globalConstraint_in?: Maybe<Array<Scalars['Bytes']>>,
  globalConstraint_not_in?: Maybe<Array<Scalars['Bytes']>>,
  globalConstraint_contains?: Maybe<Scalars['Bytes']>,
  globalConstraint_not_contains?: Maybe<Scalars['Bytes']>,
  isPre?: Maybe<Scalars['Boolean']>,
  isPre_not?: Maybe<Scalars['Boolean']>,
  isPre_in?: Maybe<Array<Scalars['Boolean']>>,
  isPre_not_in?: Maybe<Array<Scalars['Boolean']>>,
};

export enum UControllerRemoveGlobalConstraint_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  AvatarAddress = 'avatarAddress',
  GlobalConstraint = 'globalConstraint',
  IsPre = 'isPre'
}

export type UControllerUnregisterScheme = {
   __typename?: 'UControllerUnregisterScheme',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  contract: Scalars['Bytes'],
  avatarAddress: Scalars['Bytes'],
  scheme: Scalars['Bytes'],
};

export type UControllerUnregisterScheme_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  contract?: Maybe<Scalars['Bytes']>,
  contract_not?: Maybe<Scalars['Bytes']>,
  contract_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_not_in?: Maybe<Array<Scalars['Bytes']>>,
  contract_contains?: Maybe<Scalars['Bytes']>,
  contract_not_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  scheme?: Maybe<Scalars['Bytes']>,
  scheme_not?: Maybe<Scalars['Bytes']>,
  scheme_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_not_in?: Maybe<Array<Scalars['Bytes']>>,
  scheme_contains?: Maybe<Scalars['Bytes']>,
  scheme_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum UControllerUnregisterScheme_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  Contract = 'contract',
  AvatarAddress = 'avatarAddress',
  Scheme = 'scheme'
}

export type UControllerUpgradeController = {
   __typename?: 'UControllerUpgradeController',
  id: Scalars['ID'],
  txHash: Scalars['Bytes'],
  controller: Scalars['Bytes'],
  avatarAddress: Scalars['Bytes'],
  newController: Scalars['Bytes'],
};

export type UControllerUpgradeController_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  txHash?: Maybe<Scalars['Bytes']>,
  txHash_not?: Maybe<Scalars['Bytes']>,
  txHash_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>,
  txHash_contains?: Maybe<Scalars['Bytes']>,
  txHash_not_contains?: Maybe<Scalars['Bytes']>,
  controller?: Maybe<Scalars['Bytes']>,
  controller_not?: Maybe<Scalars['Bytes']>,
  controller_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>,
  controller_contains?: Maybe<Scalars['Bytes']>,
  controller_not_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress?: Maybe<Scalars['Bytes']>,
  avatarAddress_not?: Maybe<Scalars['Bytes']>,
  avatarAddress_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_not_in?: Maybe<Array<Scalars['Bytes']>>,
  avatarAddress_contains?: Maybe<Scalars['Bytes']>,
  avatarAddress_not_contains?: Maybe<Scalars['Bytes']>,
  newController?: Maybe<Scalars['Bytes']>,
  newController_not?: Maybe<Scalars['Bytes']>,
  newController_in?: Maybe<Array<Scalars['Bytes']>>,
  newController_not_in?: Maybe<Array<Scalars['Bytes']>>,
  newController_contains?: Maybe<Scalars['Bytes']>,
  newController_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum UControllerUpgradeController_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Controller = 'controller',
  AvatarAddress = 'avatarAddress',
  NewController = 'newController'
}
