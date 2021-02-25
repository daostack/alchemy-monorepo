import * as React from "react";
import { ISchemeState, IDAOState, IProposalState, CompetitionSuggestion, CompetitionVote } from "@daostack/arc.js";
import { SortService } from "lib/sortService";
import withSubscription, { ISubscriptionProps } from "components/Shared/withSubscription";
import { combineLatest, of } from "rxjs";
import gql from "graphql-tag";
import { getArc } from "arc";
import { CompetitionStatusEnum, CompetitionStatus } from "./utils";
import Card from "./Card";
import * as css from "./Competitions.scss";
import { getNetworkByDAOAddress } from "lib/util";

interface IExternalProps {
  daoState: IDAOState;
  scheme: ISchemeState;
  proposals: Array<IProposalState>;
}

interface IStateProps {
  statusMap: Map<string, CompetitionStatus>;
}

type IProps = IExternalProps & ISubscriptionProps<any>;

class CompetitionsList extends React.Component<IProps, IStateProps> {

  constructor(props: IProps) {
    super(props);
    this.state = { statusMap: new Map() };
  }

  private handleStatusChange = (proposalState: IProposalState, status: CompetitionStatus) => {
    /**
     * the Cards maintain, through countdowns, the Copetition status, and provide it here
     * where we save the status and force a rerender
     */
    this.state.statusMap.set(proposalState.id, status);
    // force render
    this.setState({ statusMap: this.state.statusMap });
  }

  private compareCompetitions = (a: IProposalState, b: IProposalState): number => {

    const statusA = this.state.statusMap.get(a.id);
    const statusB = this.state.statusMap.get(b.id);

    if (!(statusA && statusB)) {
      return 0;
    }

    const statusIndexA = Object.values(CompetitionStatusEnum).indexOf(statusA.status);
    const statusIndexB = Object.values(CompetitionStatusEnum).indexOf(statusB.status);
    /**
     * sort by the ordinal position of the CompetitionStatusEnum values
     */
    const retval = SortService.evaluateNumber(statusIndexA, statusIndexB);
    if (retval) {
      return retval;
    }
    else {
      const competitionA = a.competition;
      const competitionB = b.competition;
      /**
       * There is a tie in status.  Compare the dates of the next stage
       */
      switch (statusA.status) {
        case CompetitionStatusEnum.Voting:
        case CompetitionStatusEnum.EndingNoSubmissions:
        case CompetitionStatusEnum.Ended:
        case CompetitionStatusEnum.EndedNoWinners:
        case CompetitionStatusEnum.EndedNoSubmissions:
          return SortService.evaluateDateTime(competitionA.endTime, competitionB.endTime);
        case CompetitionStatusEnum.Paused:
          return SortService.evaluateDateTime(competitionA.votingStartTime, competitionB.votingStartTime);
        case CompetitionStatusEnum.OpenForSubmissions:
          return SortService.evaluateDateTime(competitionA.suggestionsEndTime, competitionB.suggestionsEndTime);
        case CompetitionStatusEnum.NotOpenYet:
          return SortService.evaluateDateTime(competitionA.startTime, competitionB.startTime);
      }
    }
  }


  public render(): RenderOutput {
    const { daoState, proposals } = this.props;
    return <React.Fragment>
      <div className={css.competitionCards}>
        {
          proposals
            .sort(this.compareCompetitions)
            .map((proposal: IProposalState) => {
              return <Card key={proposal.id} proposalState={proposal} daoState={daoState} handleStatusChange={this.handleStatusChange}></Card>;
            })
        }
      </div>

    </React.Fragment>;
  }
}

export default withSubscription({
  wrappedComponent: CompetitionsList,
  loadingComponent: null,
  errorComponent: (props) => <div>{props.error.message}</div>,
  checkForUpdate: [],
  createObservable: async (props: IExternalProps) => {
    // prime the cache before creating the observable...
    const cacheQuery = gql`query cacheSuggestions {
      proposals (where: {scheme: "${props.scheme.id}"}) {
        id
        competition {
          id
          endTime
          contract
          suggestionsEndTime
          createdAt
          numberOfVotesPerVoters
          numberOfWinners
          rewardSplit
          snapshotBlock
          startTime
          suggestions {
            ...CompetitionSuggestionFields
          }
          votes {
            ...CompetitionVoteFields
          }
        }
      }
    }
    ${CompetitionSuggestion.fragments.CompetitionSuggestionFields}
    ${CompetitionVote.fragments.CompetitionVoteFields}
    `;

    const arc = await getArc(getNetworkByDAOAddress(props.daoState.dao.id));
    await arc.sendQuery(cacheQuery);
    // end cache priming

    // TODO: next lines can use some cleanup up
    return combineLatest(
      of([]),
      of([])
    );
  },
});
