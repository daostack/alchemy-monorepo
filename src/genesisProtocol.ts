import { BN, realMathToNumber } from './utils'

export interface IGenesisProtocolParams {
  activationTime: number
  boostedVotePeriodLimit: number
  daoBountyConst: number // ?
  limitExponentValue: number
  minimumDaoBounty: typeof BN // in GEN
  preBoostedVotePeriodLimit: number
  proposingRepReward: typeof BN // in REP
  queuedVoteRequiredPercentage: number
  queuedVotePeriodLimit: number // in seconds (?)
  quietEndingPeriod: number
  thresholdConst: number
  votersReputationLossRatio: number // in 1000's
}

export function mapGenesisProtocolParams(params: IGenesisProtocolParams) {
  return {
    activationTime: Number(params.activationTime),
    boostedVotePeriodLimit: Number(params.boostedVotePeriodLimit),
    daoBountyConst: Number(params.daoBountyConst),
    limitExponentValue: Number(params.limitExponentValue),
    minimumDaoBounty: new BN(params.minimumDaoBounty),
    preBoostedVotePeriodLimit: Number(params.preBoostedVotePeriodLimit),
    proposingRepReward: new BN(params.proposingRepReward),
    queuedVotePeriodLimit: Number(params.queuedVotePeriodLimit),
    queuedVoteRequiredPercentage: Number(params.queuedVoteRequiredPercentage),
    quietEndingPeriod: Number(params.quietEndingPeriod),
    thresholdConst: realMathToNumber(new BN(params.thresholdConst)),
    votersReputationLossRatio: Number(params.votersReputationLossRatio)
  }
}
