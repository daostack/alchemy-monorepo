import * as uiActions from "@store/ui/uiActions";
import { threeBoxLogout } from "@store/profiles/profilesActions";
import { enableWalletProvider, getAccountIsEnabled, logout, getWeb3ProviderInfo, getWeb3Provider, providerHasConfigUi, getArcs } from "arc";
import AccountImage from "components/Account/AccountImage";
import AccountProfileName from "components/Account/AccountProfileName";
import RedemptionsButton from "components/Redemptions/RedemptionsButton";
import withSubscription, { ISubscriptionProps } from "components/Shared/withSubscription";
import CopyToClipboard from "components/Shared/CopyToClipboard";
import { IRootState } from "@store";
import { showNotification } from "@store/notifications/notifications.reducer";
import { IProfileState } from "@store/profiles/profilesReducer";
import TrainingTooltip from "components/Shared/TrainingTooltip";
import { parse } from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { Link, matchPath, NavLink, RouteComponentProps } from "react-router-dom";
import { Breadcrumbs } from "react-breadcrumbs-dynamic";
import { of } from "rxjs";
import Toggle from "react-toggle";
import { RefObject } from "react";
import classNames from "classnames";
import { Address, IDAOState } from "@daostack/arc.js";
import { ETHDENVER_OPTIMIZATION } from "../settings";
import * as css from "./App.scss";
import ProviderConfigButton from "layouts/ProviderConfigButton";
import Tooltip from "rc-tooltip";
import { standardPolling, getArcByDAOAddress, Networks } from "lib/util";
import AccountBalances from "components/Account/AccountBalances";

interface IExternalProps extends RouteComponentProps<any> {
}

interface IStateProps {
  showRedemptionsButton: boolean;
  currentAccountProfile: IProfileState;
  currentAccountAddress: string | null;
  daoAvatarAddress: Address;
  menuOpen: boolean;
  threeBox: any;
  network: Networks;
}

const mapStateToProps = (state: IRootState & IStateProps, ownProps: IExternalProps): IExternalProps & IStateProps => {
  const match = matchPath(ownProps.location.pathname, {
    path: "/dao/:daoAvatarAddress",
    strict: false,
  });
  const queryValues = parse(ownProps.location.search);

  // TODO: this is a temporary hack to send less requests during the ethDenver conference:
  // we hide the demptionsbutton when the URL contains "crx". Should probably be disabled at later date..
  let showRedemptionsButton;
  if (ETHDENVER_OPTIMIZATION) {
    showRedemptionsButton = (ownProps.location.pathname.indexOf("crx") === -1);
  } else {
    showRedemptionsButton = true;
  }

  return {
    ...ownProps,
    showRedemptionsButton,
    currentAccountProfile: state.profiles[state.web3.currentAccountAddress],
    currentAccountAddress: state.web3.currentAccountAddress,
    daoAvatarAddress: match && match.params ? (match.params as any).daoAvatarAddress : queryValues.daoAvatarAddress,
    menuOpen: state.ui.menuOpen,
    threeBox: state.profiles.threeBox,
    network: state.web3.networkName as Networks,
  };
};

interface IDispatchProps {
  showNotification: typeof showNotification;
  toggleMenu: typeof uiActions.toggleMenu;
  toggleTrainingTooltipsOnHover: typeof uiActions.toggleTrainingTooltipsOnHover;
  enableTrainingTooltipsOnHover: typeof uiActions.enableTrainingTooltipsOnHover;
  disableTrainingTooltipsOnHover: typeof uiActions.disableTrainingTooltipsOnHover;
  enableTrainingTooltipsShowAll: typeof uiActions.enableTrainingTooltipsShowAll;
  disableTrainingTooltipsShowAll: typeof uiActions.disableTrainingTooltipsShowAll;
  threeBoxLogout: typeof threeBoxLogout;
}

const mapDispatchToProps = {
  showNotification,
  toggleMenu: uiActions.toggleMenu,
  toggleTrainingTooltipsOnHover: uiActions.toggleTrainingTooltipsOnHover,
  enableTrainingTooltipsOnHover: uiActions.enableTrainingTooltipsOnHover,
  disableTrainingTooltipsOnHover: uiActions.disableTrainingTooltipsOnHover,
  enableTrainingTooltipsShowAll: uiActions.enableTrainingTooltipsShowAll,
  disableTrainingTooltipsShowAll: uiActions.disableTrainingTooltipsShowAll,
  threeBoxLogout,
};

type IProps = IExternalProps & IStateProps & IDispatchProps & ISubscriptionProps<IDAOState>;

class Header extends React.Component<IProps, null> {

  constructor (props: IProps) {
    super(props);
    this.toggleDiv = React.createRef();
    this.initializeTrainingTooltipsToggle();
  }

  private static trainingTooltipsEnabledKey = "trainingTooltipsEnabled";
  private toggleDiv: RefObject<HTMLDivElement>;

  public componentDidMount() {
    if (this.toggleDiv.current) {
      this.toggleDiv.current.onmouseenter = (_ev: MouseEvent) => {
        this.props.enableTrainingTooltipsShowAll();
      };
      this.toggleDiv.current.onmouseleave = (_ev: MouseEvent) => {
        this.props.disableTrainingTooltipsShowAll();
      };
    }

    this.setState({ alchemyVersion: PACKAGE_VERSION ?? "Not found" });
  }

  public handleClickLogin = async (_event: any): Promise<void> => {
    enableWalletProvider({
      suppressNotifyOnSuccess: true,
      showNotification: this.props.showNotification,
    }, undefined);
  }

  public handleConnect = async (_event: any): Promise<void> => {
    enableWalletProvider({
      suppressNotifyOnSuccess: true,
      showNotification: this.props.showNotification,
    }, undefined);
  }

  public handleClickLogout = async (_event: any): Promise<void> => {
    await logout(this.props.showNotification);
    await this.props.threeBoxLogout();
  }

  private handleToggleMenu = (_event: any): void => {
    this.props.toggleMenu();
  }

  private handleTrainingTooltipsEnabled = (event: any): void => {
    /**
     * maybe making this asynchronous can address reports of the button responding very slowly
     */
    const checked = event.target.checked;
    setTimeout(() => {
      localStorage.setItem(Header.trainingTooltipsEnabledKey, checked);
      this.props.toggleTrainingTooltipsOnHover();
    }, 0);
  }

  private getTrainingTooltipsEnabled(): boolean {
    const trainingTooltipsOnSetting = localStorage.getItem(Header.trainingTooltipsEnabledKey);
    return (trainingTooltipsOnSetting === null) || trainingTooltipsOnSetting === "true";
  }

  private initializeTrainingTooltipsToggle() {
    const trainingTooltipsOn = this.getTrainingTooltipsEnabled();
    if (trainingTooltipsOn) {
      this.props.enableTrainingTooltipsOnHover();
    } else {
      this.props.disableTrainingTooltipsOnHover();
    }
  }

  private breadCrumbCompare = (a: any, b: any): number => a.weight ? a.weight - b.weight : a.to.length - b.to.length;

  public render(): RenderOutput {
    const {
      currentAccountProfile,
      currentAccountAddress,
      network,
    } = this.props;
    const dao = this.props.data;

    const daoAvatarAddress = dao ? dao.address : null;
    const accountIsEnabled = getAccountIsEnabled();
    const web3ProviderInfo = getWeb3ProviderInfo();
    const web3Provider = getWeb3Provider();
    const trainingTooltipsOn = this.getTrainingTooltipsEnabled();

    return (
      <div className={css.headerContainer}>
        <nav className={css.header}>
          <div className={css.menuToggle} onClick={this.handleToggleMenu}>
            {this.props.menuOpen ?
              <img src="/assets/images/Icon/Close.svg" /> :
              <img src="/assets/images/Icon/Menu.svg" />}
          </div>
          <Tooltip overlay={`DAOstack Alchemy version: ${PACKAGE_VERSION ?? "Not found"}`} placement="bottomRight">
            <div className={css.menu}>
              <Link to="/">
                <img src="/assets/images/alchemy-logo-white.svg" />
              </Link>
            </div>
          </Tooltip>
          <div className={css.topInfo}>
            <Breadcrumbs
              separator={<b> &gt;   </b>}
              item={NavLink}
              finalItem={"b"}
              compare={this.breadCrumbCompare}
            />
          </div>
          <TrainingTooltip placement="left" overlay={"Show / hide tooltips on hover"} alwaysAvailable>
            <div className={css.toggleButton} ref={this.toggleDiv}>
              <Toggle
                defaultChecked={trainingTooltipsOn}
                onChange={this.handleTrainingTooltipsEnabled}
                icons={{ checked: <img src='/assets/images/Icon/checked.svg' />, unchecked: <img src='/assets/images/Icon/unchecked.svg' /> }} />
            </div>
          </TrainingTooltip>
          {
            this.props.showRedemptionsButton ? <div className={css.redemptionsButton}>
              <RedemptionsButton currentAccountAddress={currentAccountAddress} />
            </div> : ""
          }
          <div className={css.accountInfo}>
            {currentAccountAddress ?
              <span>
                <div className={css.accountInfoContainer}>
                  <div className={css.accountImage}>
                    <div className={classNames({ [css.profileLink]: true, [css.noAccount]: !accountIsEnabled })}>
                      <AccountProfileName accountAddress={currentAccountAddress}
                        accountProfile={currentAccountProfile} daoAvatarAddress={daoAvatarAddress} />
                      <span className={classNames({ [css.walletImage]: true, [css.greyscale]: !accountIsEnabled })}>
                        <AccountImage accountAddress={currentAccountAddress} profile={currentAccountProfile} width={50} />
                      </span>
                    </div>
                  </div>
                </div>
                <div className={css.wallet}>
                  <div className={css.pointer}></div>
                  <div className={css.walletDetails}>
                    <div className={classNames({ [css.walletImage]: true, [css.greyscale]: !accountIsEnabled })}>
                      <AccountImage accountAddress={currentAccountAddress} profile={currentAccountProfile} width={50} />
                    </div>
                    <div className={css.profileName}>
                      <AccountProfileName accountAddress={currentAccountAddress}
                        accountProfile={currentAccountProfile} daoAvatarAddress={daoAvatarAddress} />
                    </div>
                    <div className={css.copyAddress}>
                      <div className={css.accountAddress}>{currentAccountAddress ? currentAccountAddress.slice(0, 40) : "No account known"}</div>
                      <CopyToClipboard value={currentAccountAddress} tooltipPlacement="left" />
                    </div>
                    <div className={css.fullProfile}>
                      <Link className={css.profileLink} to={"/profile/" + currentAccountAddress + (daoAvatarAddress ? "?daoAvatarAddress=" + daoAvatarAddress : "")}>
                        Full Profile
                      </Link>
                    </div>
                  </div>
                  {network &&
                  <React.Fragment>
                    <AccountBalances dao={dao ? dao : null} address={currentAccountAddress} network={network} arc={getArcs()[network]} />
                    <div className={css.currentNetwork}>
                      <div className={css.title}>Network</div>
                      {network}
                    </div>
                  </React.Fragment>
                  }
                  <div className={css.logoutButtonContainer}>
                    {accountIsEnabled ?
                      <div className={css.web3ProviderLogoutSection}>
                        <div className={css.provider}>
                          <div className={css.title}>Provider</div>
                          <div className={css.name}>{web3ProviderInfo.name}</div>
                        </div>
                        {providerHasConfigUi(web3Provider) ?
                          <div className={css.providerconfig}><ProviderConfigButton provider={web3Provider} providerName={web3ProviderInfo.name}></ProviderConfigButton></div>
                          : ""
                        }
                        <div className={css.web3ProviderLogInOut} onClick={this.handleClickLogout}><div className={css.text}>Log out</div> <img src="/assets/images/Icon/logout.svg" /></div>
                      </div> :
                      <div className={css.web3ProviderLogInOut} onClick={this.handleConnect}><div className={css.text}>Connect</div> <img src="/assets/images/Icon/login.svg" /></div>}
                  </div>
                </div>
              </span> : <span></span>
            }
            {!currentAccountAddress ?
              <div className={css.web3ProviderLogin}>
                <TrainingTooltip placement="bottomLeft" overlay={"Click here to connect your wallet provider"}>
                  <button onClick={this.handleClickLogin} data-test-id="loginButton">
                    Log in <img src="/assets/images/Icon/login-white.svg" />
                  </button>
                </TrainingTooltip>
              </div>
              : (!accountIsEnabled) ?
                <div className={css.web3ProviderLogin}>
                  <TrainingTooltip placement="bottomLeft" overlay={"Click here to connect your wallet provider"}>
                    <button onClick={this.handleConnect} data-test-id="connectButton">
                      <span className={css.connectButtonText}>Connect</span><img src="/assets/images/Icon/login-white.svg" />
                    </button>
                  </TrainingTooltip>
                </div>
                : ""
            }
          </div>
        </nav>
      </div >
    );
  }
}

const SubscribedHeader = withSubscription({
  wrappedComponent: Header,
  loadingComponent: null,
  errorComponent: (props) => <div>{props.error.message}</div>,
  checkForUpdate: ["daoAvatarAddress"],
  createObservable: (props: IProps) => {
    if (props.daoAvatarAddress) {
      const arc = getArcByDAOAddress(props.daoAvatarAddress);
      // subscribe if only to get DAO reputation supply updates
      return arc.dao(props.daoAvatarAddress).state(standardPolling());
    } else {
      return of(null);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscribedHeader);
