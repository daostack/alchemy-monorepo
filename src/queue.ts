import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { DAO } from './dao'
import { Address } from './types'
import { realMathToNumber } from './utils'

export interface IQueue {
  id: string
  dao: DAO
  name?: string
}

export interface IQueueState {
  id: string
  // scheme: IScheme
  paramsHash: string
  threshold: BN
  thresholdConst: BN
  dao: DAO
  votingMachine: Address
  queuedVoteRequiredPercentage: number
  queuedVotePeriodLimit: number // in seconds (?)
  boostedVotePeriodLimit: number
  preBoostedVotePeriodLimit: number
  limitExponentValue: number
  quietEndingPeriod: number // in seconds (?)
  proposingRepReward: BN // in REP
  votersReputationLossRatio: number // in 1000's
  minimumDaoBounty: BN // in GEN
  daoBountyConst: number // ?
  activationTime: number
  voteOnBehalf: Address
}

export class Queue {
  public static search(
    options: {
      dao?: Address,
      name?: string
    },
    context: Arc,
    apolloQueryOptions: IApolloQueryOptions = {}
): Observable<Queue[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      const value = (options as any)[key]
      if (value !== undefined) {
        where += `${key}: "${value}"\n`
      }
    }

    const query = gql` {
     gpqueues (where: {${where}}) {
       id
       dao { id }
       scheme {
         id
         name
       }
     }
   }`
    const itemMap = (item: any): Queue => {
      return new Queue(
        item.id,
        item.dao.id,
        item.scheme.name,
        context
      )
    }

    return context._getObservableList(query, itemMap, apolloQueryOptions) as Observable<Queue[]>
  }
  public id: Address
  public dao: Address
  public name: string

  constructor(id: Address, dao: Address, name: string, public context: Arc) {
    this.context = context
    this.id = id
    this.dao = dao
    this.name = name
  }

  public state(): Observable<IQueueState> {
    const query = gql`
      {
        gpqueue (id: "${this.id}") {
          id
          activationTime
          dao {
            id
          }
          daoBountyConst
          scheme {
            id
            address
            name
            dao { id }
            canDelegateCall
            canRegisterSchemes
            canUpgradeController
            canManageGlobalConstraints
            paramsHash
          }
          minimumDaoBounty
          proposingRepReward
          queuedVotePeriodLimit
          queuedVoteRequiredPercentage
          threshold
          thresholdConst
          votersReputationLossRatio
          votingMachine
        }
      }
    `

    const itemMap = (item: any): IQueueState|null => {
      if (item === null) {
        // no gpqueue was found - we return null
        return null
      }

      const threshold: BN = realMathToNumber(new BN(item.threshold))
      const thresholdConst = realMathToNumber(new BN(item.thresholdConst))

      return {
        activationTime: Number(item.activationTime),
        boostedVotePeriodLimit: Number(item.boostedVotePeriodLimit),
        dao: new DAO(item.dao.id, this.context),
        daoBountyConst: item.daoBountyConst,
        id: item.id,
        limitExponentValue: item.limitExponentValue,
        minimumDaoBounty: item.minimumDaoBounty,
        paramsHash: item.scheme.paramsHash,
        preBoostedVotePeriodLimit: Number(item.preBoostedVotePeriodLimit),
        proposingRepReward: new BN(item.proposingRepReward),
        queuedVotePeriodLimit: Number(item.queuedVotePeriodLimit),
        queuedVoteRequiredPercentage: Number(item.queuedVoteRequiredPercentage),
        quietEndingPeriod: Number(item.quietEndingPeriod),
        threshold,
        thresholdConst,
        voteOnBehalf: item.voteOnBehalf,
        votersReputationLossRatio: item.votersReputationLossRatio,
        votingMachine: item.votingMachine
      }
    }
    return this.context._getObservableObject(query, itemMap) as Observable<IQueueState>
  }
}
