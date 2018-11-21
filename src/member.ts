import { Stateful } from './types'
import { of, Observable } from 'rxjs'
import { Reward } from './reward'
import { Proposal, Stake, Vote } from './proposal'
import { DAO } from './dao'

interface MemberState {
  address: string
  dao: string
  eth: number
  reputation: number
  tokens: number
  gen: number
  approvedGen: number
}

/**
 * Represents a user of a DAO
 */

export class Member implements Stateful<MemberState> {
  state: Observable<MemberState> = of()

  /**
   * [constructor description]
   * @param address address of the user
   * @param dao     address of the DAO
   */
  constructor(private address: string, private dao: string) {}

  rewards(): Observable<Reward[]> {
    throw new Error('not implemented')
  }

  proposals(): Observable<Proposal[]> {
    const dao = new DAO(this.dao)
    return dao.proposals()
  }

  stakes(): Observable<Stake[]> {
    const dao = new DAO(this.dao)
    return dao.stakes()
  }

  votes(): Observable<Vote[]> {
    const dao = new DAO(this.dao)
    return dao.votes()
  }
}
