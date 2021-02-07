import { IProposalOutcome, IProposalStage, IProposalState } from "@daostack/arc.js";
import * as classNames from "classnames";
import * as React from "react";
import { closingTime } from "lib/proposalHelpers";

import * as css from "./Countdown.scss";
import { ICountdown, calculateCountdown } from "lib/util";

interface IProps {
  detailView?: boolean;
  proposal: IProposalState;
  schemeView?: boolean;
  proposalsPage?: boolean;
  onEnd?(): any;
}

interface IState extends ICountdown {
}

export default class ProposalCountdown extends React.Component<IProps, IState> {
  public interval: any;

  constructor(props: IProps) {
    super(props);

    this.state = calculateCountdown(closingTime(this.props.proposal));
  }

  public componentDidMount() {
    // update every five seconds
    this.interval = setInterval(() => {
      const countdownState = calculateCountdown(closingTime(this.props.proposal, this.props.proposalsPage));
      this.setState(countdownState);

      if (countdownState.complete) {
        this.stop();
        if (this.props.onEnd) {
          this.props.onEnd();
        }
      }
    }, 1000);
  }

  public componentWillUnmount() {
    this.stop();
  }

  public stop() {
    clearInterval(this.interval);
  }

  public addLeadingZeros(value: string | number) {
    value = String(value);
    while (value.length < 2) {
      value = "0" + value;
    }
    return value;
  }

  public render(): RenderOutput {
    const countDown = this.state;
    const { proposal } = this.props;

    const percentageComplete = 0;
    // TODO: do we want to show the percentage complete bar? We have not been so far
    // if (this.props.fromDate) {
    //   const endDateMoment = moment(this.props.toDate);
    //   const timeLeft = endDateMoment.diff(new Date());
    //   if (timeLeft <= 0) {
    //     percentageComplete = 100;
    //   } else {
    //     percentageComplete = (1 - timeLeft / endDateMoment.diff(this.props.fromDate)) * 100;
    //   }

    //   if (percentageComplete < 1) {
    //     percentageComplete = 2;
    //   }
    // }

    const containerClass = classNames({
      [css.detailView]: this.props.detailView,
      [css.container]: true,
      [css.schemeView]: this.props.schemeView,
    });

    return (
      <div className={containerClass}>
        <div className={css.percentageContainer}>
          <div style={{ backgroundColor: "blue", height: "2px", width: percentageComplete + "%" }}></div>
        </div>
        {this.props.detailView ?
          <span className={css.label}>
            { proposal.stage === IProposalStage.Queued ? "Proposal will expire in" :
              proposal.stage === IProposalStage.PreBoosted && proposal.downStakeNeededToQueue.lten(0) ? "Proposal will un-boost in" :
                proposal.stage === IProposalStage.PreBoosted ? "Proposal will boost in" :
                  (proposal.stage === IProposalStage.Boosted || proposal.stage === IProposalStage.QuietEndingPeriod) && proposal.winningOutcome === IProposalOutcome.Pass ? "Proposal will pass in" :
                    (proposal.stage === IProposalStage.Boosted || proposal.stage === IProposalStage.QuietEndingPeriod) ? "Proposal will fail in" :
                      ""
            }
          </span>
          : " "
        }
        {
          countDown.days ? <span className={css.timeSection}><strong>{this.addLeadingZeros(countDown.days)}d</strong><span className={css.colon}>:</span></span> : ""
        }
        <span className={css.timeSection}><strong>{this.addLeadingZeros(countDown.hours)}h</strong><span className={css.colon}>:</span></span>
        <span className={css.timeSection}><strong>{this.addLeadingZeros(countDown.min)}m</strong></span>
        {
          countDown.days ? "" : <span className={css.timeSection}><span className={css.colon}>:</span><strong>{this.addLeadingZeros(countDown.seconds)}s</strong></span>
        }
        {proposal.stage === IProposalStage.QuietEndingPeriod && !countDown.complete ?
          <strong className={css.overTime}>
            <img src="/assets/images/Icon/Overtime.svg" /> OVERTIME
          </strong>
          : " "
        }
      </div>
    );
  }
}
