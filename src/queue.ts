import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { Arc, IApolloQueryOptions } from './arc'
import { Address } from './types'
import { realMathToNumber } from './utils'

export interface IQueueState {
  id: string
  threshold: BN
  dao: Address
  votingMachine: Address

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
          dao {
            id
          }
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
          votingMachine
          threshold
        }
      }
    `

    const itemMap = (item: any): IQueueState|null => {
      if (item === null) {
        // no gpqueue was found - we return null
        return null
      }

      const threshold: BN = realMathToNumber(new BN(item.threshold))

      return {
        // activationTime: Number(item.activationTime),
          // dao: new DAO(item.dao.id, this.context),
        dao: item.dao.id,
        // daoBountyConst: Number(item.daoBountyConst),
        id: item.id,
        // limitExponentValue: Number(item.limitExponentValue),
        // minimumDaoBounty:  new BN(item.minimumDaoBounty),
        // paramsHash: item.scheme.paramsHash,
        // preBoostedVotePeriodLimit: Number(item.preBoostedVotePeriodLimit),
        // proposingRepReward: new BN(item.proposingRepReward),
        // queuedVotePeriodLimit: Number(item.queuedVotePeriodLimit),
        // queuedVoteRequiredPercentage: Number(item.queuedVoteRequiredPercentage),
        // quietEndingPeriod: Number(item.quietEndingPeriod),
        threshold,
        // thresholdConst,
        // voteOnBehalf: item.voteOnBehalf,
        // votersReputationLossRatio: Number(item.votersReputationLossRatio),
        votingMachine: item.votingMachine
      }
    }
    return this.context._getObservableObject(query, itemMap) as Observable<IQueueState>
  }
}
