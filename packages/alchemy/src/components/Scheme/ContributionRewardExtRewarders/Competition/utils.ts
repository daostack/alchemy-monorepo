import { ICompetitionProposalState,
  Competition,
  CompetitionSuggestion,
  ICompetitionSuggestionState,
  CompetitionVote,
  Address,
  Arc } from "@daostack/arc.js";
import * as Redux from "redux";
import { ThunkAction } from "redux-thunk";

import * as moment from "moment";
import { getArc } from "arc";
import { operationNotifierObserver } from "@store/arc/arcActions";
import { IRootState } from "@store";
import { Observable, of } from "rxjs";
import { map, mergeMap, toArray, first } from "rxjs/operators";
import { GRAPH_POLL_INTERVAL } from "../../../../settings";
import { getNetworkByDAOAddress } from "lib/util";

/**
 * Defined in the order that Competition cards should be sorted in the List component.
 * The string values are how the stati should appear in the GUI.
 */
export enum CompetitionStatusEnum {
  Voting = "Voting started!",
  Paused = "Paused",
  OpenForSubmissions = "Open for submissions",
  NotOpenYet = "Not open yet",
  EndingNoSubmissions = "Ending, no submissions",
  Ended = "Ended with winners",
  EndedNoWinners = "Ended, no winners",
  EndedNoSubmissions = "Ended, no submissions",
}

export class CompetitionStatus {
  constructor(
    public status: CompetitionStatusEnum,
    public now: moment.Moment,
    public competition: ICompetitionProposalState,
    public hasWinners: boolean) {
  }
  public get notStarted() { return this.status === CompetitionStatusEnum.NotOpenYet; }
  /**
   * open for submissions
   */
  public get open() { return this.status === CompetitionStatusEnum.OpenForSubmissions; }
  /**
   * In between submissions and voting period, and there exist submissions.
   */
  public get paused() { return this.status === CompetitionStatusEnum.Paused; }
  /**
   * in voting period, but not implying there are any submissions
   */
  public get inVotingPeriod() {
    return this.now.isSameOrAfter(this.competition.votingStartTime) && (this.status !== CompetitionStatusEnum.Ended);
  }
  /**
   * in voting period and there are submissions
   */
  public get voting() { return this.status === CompetitionStatusEnum.Voting; }
  /**
   * Voting can no longer occur. Implies neither thatn any voting has occurred,
   * nor the actual current stage (entire competition may or may not be over).
   */
  public get votingIsOver() {
    return ((this.status === CompetitionStatusEnum.Ended) ||
      (this.status === CompetitionStatusEnum.EndedNoWinners) ||
      (this.status === CompetitionStatusEnum.EndedNoSubmissions));
  }
  /**
   * competition is over, with or without submissions or winners
   */
  public get over() { return this.now.isSameOrAfter(this.competition.endTime); }
  /**
   * Competition is over with winners
   */
  public get overWithWinners() { return this.status === CompetitionStatusEnum.Ended; }
  public get text(): string { return this.status; }
}

export const competitionStatus = (competition: ICompetitionProposalState): CompetitionStatus => {
  const now = moment();
  const startTime = moment(competition.startTime);
  const submissionsEndTime = moment(competition.suggestionsEndTime);
  const votingStartTime = moment(competition.votingStartTime);
  const endTime = moment(competition.endTime);
  const hasSubmissions = !!competition.totalSuggestions;
  const hasWinners = !!competition.numberOfWinningSuggestions;
  let status: CompetitionStatusEnum;

  if (now.isBefore(startTime)) {
    status = CompetitionStatusEnum.NotOpenYet;
  } else if (now.isBefore(votingStartTime)) {
    if (now.isSameOrAfter(submissionsEndTime)) {
      status = hasSubmissions ? CompetitionStatusEnum.Paused : CompetitionStatusEnum.EndingNoSubmissions;
    } else {
      status = CompetitionStatusEnum.OpenForSubmissions;
    }
  } else if (now.isBefore(endTime)) {
    status = hasSubmissions ? CompetitionStatusEnum.Voting : CompetitionStatusEnum.EndingNoSubmissions;
  } else {
    status = hasSubmissions ? (hasWinners ? CompetitionStatusEnum.Ended : CompetitionStatusEnum.EndedNoWinners) : CompetitionStatusEnum.EndedNoSubmissions;
  }

  return new CompetitionStatus(status, now, competition, hasWinners);
};

export interface ICreateSubmissionOptions {
  beneficiary?: Address;
  description: string;
  title: string;
  url: string;
  tags: Array<string>;
}

const standardPolling = (poll: boolean, fetchAllData = false) => { return { polling: poll, pollInterval: GRAPH_POLL_INTERVAL, fetchAllData }; };

export const createCompetitionSubmission = (proposalId: string, options: ICreateSubmissionOptions, daoAddress: any): ThunkAction<any, IRootState, null> => {
  return async (dispatch: Redux.Dispatch<any, any>, _getState: () => IRootState) => {
    try {
      const observer = operationNotifierObserver(dispatch, "Create Submission");
      const competition = new Competition(proposalId, getArc(getNetworkByDAOAddress(daoAddress)));
      await competition.createSuggestion(options).subscribe(...observer);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    }
  };
};

export interface IVoteSubmissionOptions {
  id: string; // actual id, not the counter
  arc: Arc;
}

export const voteForSubmission = (options: IVoteSubmissionOptions): ThunkAction<any, IRootState, null> => {
  return async (dispatch: Redux.Dispatch<any, any>, _getState: () => IRootState) => {
    try {
      const observer = operationNotifierObserver(dispatch, "Vote Submission");
      const submission = new CompetitionSuggestion(options.id, options.arc);

      await submission.vote().subscribe(...observer);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    }
  };
};

export interface IVoteSubmissionOptions {
  id: string; // actual id, not the counter
}

export const redeemForSubmission = (options: IVoteSubmissionOptions): ThunkAction<any, IRootState, null> => {
  return async (dispatch: Redux.Dispatch<any, any>, _getState: () => IRootState) => {
    try {
      const observer = operationNotifierObserver(dispatch, "Redeem Submission");
      const submission = new CompetitionSuggestion(options.id, options.arc);

      await submission.redeem().subscribe(...observer);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    }
  };
};

export const getProposalSubmissions = (proposalId: string, subscribe = false, arc: Arc): Observable<Array<ICompetitionSuggestionState>> => {
  // fetchAllData so .state() comes from cache
  const competition = new Competition(proposalId, arc);
  return competition.suggestions({}, standardPolling(subscribe, true))
    .pipe(
      mergeMap(submissions => of(submissions).pipe(
        mergeMap(submissions => submissions),
        mergeMap((submission: CompetitionSuggestion) => submission.state().pipe(first())),
        toArray()
      )));
};

export const getSubmission = (id: string, subscribe = false, arc: Arc): Observable<ICompetitionSuggestionState> => {
  const submission = new CompetitionSuggestion(id, arc);
  return submission.state(standardPolling(subscribe));
};

export const getCompetitionVotes = (competitionId: string, voterAddress: Address, subscribe = false, arc: Arc): Observable<Array<CompetitionVote>> => {
  const competition = new Competition(competitionId, arc);
  /**
   * none of the current uses require the vote state
   */
  return competition.votes({ where: { voter: voterAddress } }, standardPolling(subscribe, true));
};

const getSubmissionVotes = (submissionId: string, arc: Arc, voterAddress?: Address, subscribe = false): Observable<Array<CompetitionVote>> => {
  // submissionId is the actual id, not the count
  const submission = new CompetitionSuggestion(submissionId, arc);
  return submission.votes(voterAddress ? { where: { voter: voterAddress } } : {}, standardPolling(subscribe, true));
};

export const getSubmissionVoterHasVoted = (submissionId: string, voterAddress: string, subscribe = false, arc: Arc): Observable<boolean> => {
  if (!voterAddress) {
    return of(false);
  }
  // submissionId is the actual id, not the count
  return getSubmissionVotes(submissionId, arc, voterAddress, subscribe)
    .pipe(map((votes: Array<CompetitionVote>) => !!votes.length));
};

// export const primeCacheForSubmissionsAndVotes = (): Observable<any> => {
//   return combineLatest(
//     CompetitionSuggestion.search(getArc(), {}, standardPolling(true)),
//     CompetitionVote.search(getArc(), {}, standardPolling(true))
//   );
// };
