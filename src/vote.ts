import { ProposalOutcome } from './proposal'
import { Address } from './types'
export interface IVote {
    id: string
    proposer: string
    createdAt: Date
    outcome: ProposalOutcome
    amount: number // amount of reputation that was voted with
    proposalId: string
    dao: Address
}

export class Vote implements IVote {
constructor(
    public id: string,
    public proposer: string,
    public createdAt: Date,
    public outcome: ProposalOutcome,
    public amount: number,
    public proposalId: string,
    public dao: Address
) {}
}
