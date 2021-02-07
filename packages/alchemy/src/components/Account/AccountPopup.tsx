import { Address, IDAOState, IMemberState } from "@daostack/arc.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProfile } from "@store/profiles/profilesActions";
import AccountImage from "components/Account/AccountImage";
import AccountProfileName from "components/Account/AccountProfileName";
import Reputation from "components/Account/Reputation";
import FollowButton from "components/Shared/FollowButton";
import withSubscription, { ISubscriptionProps } from "components/Shared/withSubscription";
import CopyToClipboard, { IconColor } from "components/Shared/CopyToClipboard";
import * as React from "react";
import { connect } from "react-redux";
import { IRootState } from "@store";
import { IProfileState } from "@store/profiles/profilesReducer";

import * as BN from "bn.js";

import * as css from "./Account.scss";
import { getNetworkByDAOAddress } from "lib/util";



interface IExternalProps {
  accountAddress: Address;
  daoState: IDAOState;
  width?: number;
}

interface IStateProps {
  currentAccountProfile: IProfileState;
  profile: IProfileState;
}

const mapStateToProps = (state: IRootState, ownProps: IExternalProps & ISubscriptionProps<IMemberState>): IExternalProps & IStateProps & ISubscriptionProps<IMemberState> => {
  const account = ownProps.data;

  return {
    ...ownProps,
    currentAccountProfile: state.profiles[state.web3.currentAccountAddress],
    profile: account ? state.profiles[account.address] : null,
  };
};

interface IDispatchProps {
  getProfile: typeof getProfile;
}

const mapDispatchToProps = {
  getProfile,
};

type IProps = IExternalProps & IStateProps & IDispatchProps & ISubscriptionProps<IMemberState>;

class AccountPopup extends React.Component<IProps, null> {

  public componentDidMount() {
    if (!this.props.profile) {
      this.props.getProfile(this.props.accountAddress);
    }
  }

  public render(): RenderOutput {
    const accountInfo = this.props.data;
    const { accountAddress, daoState, profile, width } = this.props;
    const reputation = accountInfo ? accountInfo.reputation : new BN(0);

    const _width = width || 12;

    return (
      <div className={css.targetAccount} style={{ width: _width }}>
        <div className={css.avatar}>
          <AccountImage accountAddress={accountAddress} profile={profile} width={_width} />
        </div>
        <div className={css.accountInfo}>
          <div className={css.name}><AccountProfileName accountAddress={accountAddress} accountProfile={profile} daoAvatarAddress={daoState.address} /></div>
          <div>
            {!profile || Object.keys(profile.socialURLs).length === 0 ? "No social profiles" :
              <span>
                {profile.socialURLs.twitter ?
                  <a href={"https://twitter.com/" + profile.socialURLs.twitter.username} className={css.socialButton} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={["fab", "twitter"]} className={css.icon} />
                  </a> : ""}
                {profile.socialURLs.github ?
                  <a href={"https://github.com/" + profile.socialURLs.github.username} className={css.socialButton} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={["fab", "github"]} className={css.icon} />
                  </a> : ""}
              </span>
            }
          </div>
          <div className={css.beneficiaryAddress}>
            <div className={css.accountAddress}>{accountAddress}</div>
            <CopyToClipboard value={accountAddress} color={IconColor.Black}/>
          </div>

          <div>
            <FollowButton type="users" id={this.props.accountAddress} network={getNetworkByDAOAddress(daoState.address)} />
          </div>

          <div className={css.holdings}>
            <span>HOLDINGS</span>
            <div><Reputation daoName={daoState.name} totalReputation={daoState.reputationTotalSupply} reputation={reputation} /></div>
          </div>
        </div>
      </div>
    );
  }
}

const ConnectedAccountPopup = connect(mapStateToProps, mapDispatchToProps)(AccountPopup);

// TODO: move this subscription to ProposalData.
//  Can't do that right now because need to get the proposal state first to get the proposer and beneficiary
//  before we can load the member data for those addresses
const SubscribedAccountPopup = withSubscription({
  wrappedComponent: ConnectedAccountPopup,
  loadingComponent: <div>Loading...</div>,
  errorComponent: (props) => <div>{props.error.message}</div>,

  checkForUpdate: (oldProps, newProps) => { return oldProps.accountAddress !== newProps.accountAddress || oldProps.daoState.address !== newProps.daoState.address; },

  createObservable: (props: IProps) => {
    // we set 'fetchPolicy'= 'cache-only' so as to not send queries for addresses that are not members. The cache is filled higher up.
    return props.daoState.dao.member(props.accountAddress).state({ fetchPolicy: "cache-only" });
  },
});

export default SubscribedAccountPopup;
