import { IDAOState, IProposalState, Address, ICompetitionSuggestionState, CompetitionVote } from "@daostack/arc.js";
import * as React from "react";

import withSubscription, { ISubscriptionProps } from "components/Shared/withSubscription";

import { ensureHttps, formatFriendlyDateForLocalTimezone, formatTokens, getArcByDAOAddress } from "lib/util";
import { IRootState } from "@store";
import { connect } from "react-redux";
import classNames from "classnames";
import AccountPopup from "components/Account/AccountPopup";
import AccountProfileName from "components/Account/AccountProfileName";
import { IProfilesState } from "@store/profiles/profilesReducer";
import { combineLatest, of } from "rxjs";
import Tooltip from "rc-tooltip";
import TagsSelector from "components/Proposal/Create/SchemeForms/TagsSelector";
import { DiscussionEmbed } from "disqus-react";
import { RouteComponentProps } from "react-router-dom";
import { getSubmission, getSubmissionVoterHasVoted, getCompetitionVotes, CompetitionStatus } from "./utils";
import * as css from "./Competitions.scss";
import ProposalDescription from "components/Shared/ProposalDescription";

type ISubscriptionState = [ICompetitionSuggestionState, boolean, Array<CompetitionVote>];

interface IExternalStateProps {
  profiles: IProfilesState;
}

interface IExternalProps extends RouteComponentProps<any> {
  currentAccountAddress: Address;
  daoState: IDAOState;
  proposalState: IProposalState;
  status: CompetitionStatus;
  suggestionId: string; // this is the real id (not the counter)
  handleClose: () => any;
  handleVote: () => any;
  handleRedeem: () => any;
}

type IProps = IExternalProps & IExternalStateProps & ISubscriptionProps<ISubscriptionState>;

const mapStateToProps = (state: IRootState, ownProps: IExternalProps): IExternalProps & IExternalStateProps => {
  return {
    ...ownProps,
    profiles: state.profiles,
  };
};

class SubmissionDetails extends React.Component<IProps, null> {

  private handleVote = (): void => {
    this.props.handleVote();
  }

  private handleRedeem = (): void => {
    this.props.handleRedeem();
  }

  private disqusConfig = { url: "", identifier: "", title: "" };

  public render(): RenderOutput {

    const competition = this.props.proposalState.competition;
    const submission = this.props.data[0];
    const currentAccountVotedForIt = this.props.data[1];
    const currentAccountVotes = this.props.data[2];
    const hasRedeemedProposal = true; // FAKE -- until we can figure out a way to know
    const status = this.props.status;
    const maxNumVotesReached = currentAccountVotes.length === competition.numberOfVotesPerVoter;
    const canVote = status.voting && !currentAccountVotedForIt && !maxNumVotesReached;
    const isWinner = submission.isWinner;
    const isRedeemed = !!submission.redeemedAt;
    const competitionIsOver = status.over;
    const inVotingPeriod = status.inVotingPeriod;
    const canRedeem = isWinner && competitionIsOver && !isRedeemed && (submission.beneficiary === this.props.currentAccountAddress);
    const tags = submission.tags;

    this.disqusConfig.title = submission.title;
    this.disqusConfig.url = process.env.BASE_URL + this.props.history.location.pathname;
    this.disqusConfig.identifier = submission.id;

    return (
      <div className={css.submissionDetails}>
        <div className={css.header}>
          <div className={css.closeButton}><img onClick={this.props.handleClose} src="/assets/images/Icon/x-grey.svg"/></div>
          <div className={css.reputationVoted}>
            <img src="/assets/images/Icon/vote/for-gray.svg"/>
            { formatTokens(submission.totalVotes) } Rep { /* <Reputation daoName={daoState.name} totalReputation={daoState.reputationTotalSupply} reputation={submission.totalVotes} hideSymbol /> */}
          </div>
          { (canRedeem || !competitionIsOver) ?
            <div className={css.actions}>
              {
                canRedeem ?
                  <Tooltip overlay={!hasRedeemedProposal ? "Proposal has not yet been redeemed" : "Redeem for your winning submission"}>
                    <a className={classNames({[css.blueButton]: true, [css.redeemButton]: true, [css.disabled]: !hasRedeemedProposal})}
                      href="#!"
                      onClick={hasRedeemedProposal ? this.handleRedeem : undefined}
                      data-test-id="redeemSuggestion"
                    ><img src="/assets/images/Icon/redeem.svg"/>Redeem</a>
                  </Tooltip> :
                  !competitionIsOver ?
                    <Tooltip overlay={!inVotingPeriod ? "Voting has not yet begun" :
                      currentAccountVotedForIt ? "You have already voted" :
                        maxNumVotesReached ? "You have already voted the maximum number of times" : "Vote for this submission"}>
                      <a className={classNames({[css.blueButton]: true, [css.voteButton]: true, [css.disabled]: !canVote})}
                        href="#!"
                        onClick={canVote ? this.handleVote : undefined}
                        data-test-id="voteSuggestion"
                      >Vote<img src="/assets/images/Icon/vote/for-btn-selected-w.svg"/></a>
                    </Tooltip> : ""
              }
            </div> : ""
          }

          {(competitionIsOver && isWinner) ? <div className={css.winnerIcon} ><img src="/assets/images/Icon/winner.svg"></img></div> : ""}
        </div>

        <div className={css.title}>{submission.title}</div>

        <div className={css.proposer}>
          <AccountPopup accountAddress={submission.beneficiary} daoState={this.props.daoState}/>
          <AccountProfileName accountAddress={submission.beneficiary} accountProfile={this.props.profiles[submission.beneficiary]} daoAvatarAddress={this.props.daoState.address} detailView={false} />
        </div>

        { tags && tags.length ?
          <div className={css.tagsContainer}>
            <TagsSelector readOnly tags={tags} arc={getArcByDAOAddress(this.props.daoState.address)}></TagsSelector>
          </div> : "" }

        { submission.description ?
          <div className={css.description}>
            <ProposalDescription description={submission.description} />
          </div>
          : "" }

        {submission.url ?
          <a href={ensureHttps(submission.url)} className={css.attachmentLink} target="_blank" rel="noopener noreferrer">
            <img src="/assets/images/Icon/Attachment.svg" />
            Attachment&nbsp;&gt;
          </a>
          : ""
        }

        <div className={css.createdOn}>Created: <div className={css.datetime}>{formatFriendlyDateForLocalTimezone(competition.createdAt)}</div></div>

        {
        // eslint-disable-next-line no-constant-condition
          (false) ? <div className={css.discussionContainer}>
            <div className={css.title}>Discussion</div>
            <div className={css.disqus}>
              <DiscussionEmbed shortname={process.env.DISQUS_SITE} config={this.disqusConfig}/>
            </div>
          </div>
            : ""
        }

      </div>
    );
  }
}

const SubmissionDetailsSubscription = withSubscription({
  wrappedComponent: SubmissionDetails,
  loadingComponent: null,
  errorComponent: (props) => <div>{ props.error.message }</div>,
  checkForUpdate: ["currentAccountAddress"],
  createObservable: (props: IExternalProps) => {
    /**
     * data comes from the cache created in Details
     */
    const arc = getArcByDAOAddress(props.daoState.address);
    return combineLatest(
      getSubmission(props.suggestionId, true, arc),
      getSubmissionVoterHasVoted(props.suggestionId, props.currentAccountAddress, true, arc),
      props.currentAccountAddress ? getCompetitionVotes(props.proposalState.id, props.currentAccountAddress, true, arc) : of([])
    );
  },
});

export default connect(mapStateToProps)(SubmissionDetailsSubscription);
