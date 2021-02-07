import { Address, IDAOState, IProposalState, IProposalOutcome } from "@daostack/arc.js";
import Reputation from "components/Account/Reputation";
import { baseTokenName, formatTokens, fromWei, genName, tokenDecimals, tokenSymbol, AccountClaimableRewardsType, getNetworkByDAOAddress } from "lib/util";
import * as React from "react";
import * as css from "./RedemptionsTip.scss";

interface IProps {
  canRewardNone: boolean;
  canRewardOnlySome: boolean;
  contributionRewards: AccountClaimableRewardsType;
  currentAccountAddress: Address;
  dao: IDAOState;
  // non-zero GP rewards of current user, payable or not
  gpRewards: AccountClaimableRewardsType;
  id: string;
  proposal: IProposalState;
}

export default (props: IProps) => {
  const { canRewardNone, canRewardOnlySome, currentAccountAddress, contributionRewards, dao, gpRewards, id, proposal } = props;
  const network = getNetworkByDAOAddress(dao.id);

  const messageDiv = (canRewardNone || canRewardOnlySome) ? <div className={css.message}>
    <img className={css.icon} src="/assets/images/Icon/Alert-yellow-b.svg" />
    {canRewardNone ? <div className={css.text}>At this time, none of these rewards can be redeemed -- {dao.name} does not hold all the necessary assets.</div> : ""}
    {canRewardOnlySome ? <div className={css.text}>At this time, only some of these rewards can be redeemed -- {dao.name} does not hold all the necessary assets.</div> : ""}
  </div> : <span></span>;

  const rewardComponents = [];
  let c = null;
  if (gpRewards.reputationForProposer) {
    c = <div key={id + "_proposer"}>
      <strong>For creating the proposal you are due to receive:</strong>
      <ul>
        <li><Reputation reputation={gpRewards.reputationForProposer} totalReputation={dao.reputationTotalSupply} daoName={dao.name} /></li>
      </ul>
    </div>;
    rewardComponents.push(c);
  }
  if (gpRewards.reputationForVoter) {
    c = <div key={id + "_voter"}>
      <strong>For voting on the proposal you are due to receive:</strong>
      <ul>
        <li><Reputation reputation={gpRewards.reputationForVoter} totalReputation={dao.reputationTotalSupply} daoName={dao.name} /></li>
      </ul>
    </div>;
    rewardComponents.push(c);
  }
  if (gpRewards.tokensForStaker) {
    c = <div key={id + "_staker_tokens"}>
      <strong>For staking on the proposal you are due to receive:</strong>
      <ul>
        <li>{fromWei(gpRewards.tokensForStaker)} {genName(network)}</li>
      </ul>
    </div>;
    rewardComponents.push(c);
  }
  if (gpRewards.daoBountyForStaker) {
    c = <div key={id + "_staker_bounty"}>
      <strong>For staking on the proposal you are due to receive:</strong>
      <ul>
        <li>{fromWei(gpRewards.daoBountyForStaker)} {genName(network)} as bounty from {dao.name}
        </li>
      </ul>
    </div >;
    rewardComponents.push(c);
  }

  let ContributionRewardDiv = <div />;
  if (contributionRewards) {
    const contributionReward = proposal.contributionReward;
    if (proposal.winningOutcome === IProposalOutcome.Pass && proposal.contributionReward) {
      if (Object.keys(contributionRewards).length > 0) {
        ContributionRewardDiv = <div>
          <strong>
            {(currentAccountAddress && currentAccountAddress === contributionReward.beneficiary.toLowerCase()) ?
              "As the beneficiary of the proposal you are due to receive:" :
              "The beneficiary of the proposal is due to receive:"}
          </strong>
          <ul>
            {contributionRewards["eth"] ?
              <li>
                {formatTokens(contributionReward.ethReward, baseTokenName(network))}
              </li> : ""
            }
            {contributionRewards["externalToken"] ?
              <li>
                {formatTokens(contributionRewards["externalToken"], tokenSymbol(contributionReward.externalToken, network), tokenDecimals(contributionReward.externalToken, network))}
              </li> : ""
            }
            {contributionRewards["rep"] ? <li><Reputation reputation={contributionRewards["rep"]} totalReputation={dao.reputationTotalSupply} daoName={dao.name} /></li> : ""}

            {contributionRewards["nativeToken"] ?
              <li>
                {formatTokens(contributionRewards["nativeToken"], dao.tokenSymbol)}
              </li> : ""
            }

          </ul>
        </div>;
      }
    }
  }

  return <div className={css.tipContainer}>
    { messageDiv }
    <React.Fragment>
      { rewardComponents }
    </React.Fragment>
    { ContributionRewardDiv }
  </div>;
};
