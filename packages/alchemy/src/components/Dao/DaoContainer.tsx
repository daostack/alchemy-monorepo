import { IDAOState, Member, Scheme } from "@daostack/arc.js";
import { getProfilesForAddresses } from "@store/profiles/profilesActions";
import CreateProposalPage from "components/Proposal/Create";
import ProposalDetailsPage from "components/Proposal/ProposalDetailsPage";
import SchemeContainer from "components/Scheme/SchemeContainer";
import Loading from "components/Shared/Loading";
import withSubscription, { ISubscriptionProps } from "components/Shared/withSubscription";
import * as React from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { ModalRoute } from "react-router-modal";
import { IRootState } from "@store";
import { showNotification } from "@store/notifications/notifications.reducer";
import { IProfileState } from "@store/profiles/profilesReducer";
import DetailsPageRouter from "components/Scheme/ContributionRewardExtRewarders/DetailsPageRouter";
import { combineLatest, Subscription } from "rxjs";
import DaoSchemesPage from "./DaoSchemesPage";
import DaoMembersPage from "./DaoMembersPage";
import * as css from "./Dao.scss";
import DaoProposalsPage from "components/Dao/DaoProposalsPage";
import { standardPolling, getArcByDAOAddress, getDAONameByID, getNetworkByDAOAddress } from "lib/util";
import gql from "graphql-tag";
import { enableWalletProvider, getArcs } from "arc";
import { getKnownSchemes } from "lib/schemeUtils";

type IExternalProps = RouteComponentProps<any>;

interface IStateProps {
  currentAccountAddress: string;
  currentAccountProfile: IProfileState;
  daoAvatarAddress: string;
  followingDaosAddresses: Array<any>;
}

enum PROPOSAL_WINDOW_TYPE {
  PROPOSAL_LIST = "PROPOSAL_LIST",
  SPECIFIC_PLUGIN = "SPECIFIC_PLUGIN",
}

interface IState {
  memberDaos: Array<any>;
  modalParentPath: string;
  schemeId: string|null;
  proposalWindowType: PROPOSAL_WINDOW_TYPE|null;
  loading: boolean;
}

interface IDispatchProps {
  getProfilesForAddresses: typeof getProfilesForAddresses;
  showNotification: typeof showNotification;
}

type IProps = IExternalProps & IStateProps & IDispatchProps & ISubscriptionProps<[IDAOState, Member[], Scheme[]]>;

const mapStateToProps = (state: IRootState, ownProps: IExternalProps): IExternalProps & IStateProps => {
  return {
    ...ownProps,
    currentAccountAddress: state.web3.currentAccountAddress,
    currentAccountProfile: state.profiles[state.web3.currentAccountAddress],
    daoAvatarAddress: ownProps.match.params.daoAvatarAddress,
    followingDaosAddresses: state.profiles[state.web3.currentAccountAddress]?.follows.daos,
  };
};

const mapDispatchToProps = {
  getProfilesForAddresses,
  showNotification,
};

class DaoContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      memberDaos: [],
      modalParentPath: "/dao/:daoAvatarAddress",
      schemeId: "",
      proposalWindowType: null,
      loading: false,
    };
  }
  public daoSubscription: any;
  public subscription: Subscription;

  public async componentDidMount() {
    // TODO: use this once 3box fixes Box.getProfiles
    //this.props.getProfilesForAddresses(this.props.data[1].map((member) => member.staticState.address));
    const { followingDaosAddresses } = this.props;
    const memberQuery = gql` query memberDaos {
      reputationHolders (where: {
        address: "${this.props.currentAccountAddress}"
        ${(followingDaosAddresses && followingDaosAddresses.length) ? "dao_not_in: [" + followingDaosAddresses.map(dao => "\"" + dao + "\"").join(",") + "]" : ""}
      }) {
        dao {
          id
          name
        }
      }
    }`;

    const arcs = getArcs();
    const memberDaosData = [];
    for (const network in arcs) {
      const arc = arcs[network];
      const daos = await arc.sendQuery(memberQuery);
      memberDaosData.push(daos.data.reputationHolders);
    }
    const memberDaos = [].concat(...memberDaosData).map(dao => {
      return { id: dao.dao.id, name: dao.dao.name };
    });
    this.setState({ memberDaos: memberDaos });
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.data[0] !== prevProps.data[0]){
      this.setState({ loading: false });
    }
  }

  public handleNewProposal = async (schemeId?: string): Promise<void> => {
    const { showNotification, daoAvatarAddress } = this.props;

    if (!await enableWalletProvider({ showNotification }, getNetworkByDAOAddress(daoAvatarAddress))) { return; }

    if (typeof schemeId === "string") {
      this.setState(() => ({
        modalParentPath: "/dao/:daoAvatarAddress/scheme/:schemeId",
        schemeId,
        proposalWindowType: PROPOSAL_WINDOW_TYPE.SPECIFIC_PLUGIN,
      }), () => {
        this.props.history.push(`/dao/${daoAvatarAddress}/scheme/${schemeId}/proposals/create/`);
      });
    } else {
      this.setState(() => ({
        modalParentPath: "/dao/:daoAvatarAddress",
        schemeId: "",
        proposalWindowType: PROPOSAL_WINDOW_TYPE.PROPOSAL_LIST,
      }), () => {
        this.props.history.push(`/dao/${daoAvatarAddress}/proposals/create`);
      });
    }
  };

  public handleProposalWindowClose = (parentPath: string) => {
    const { history } = this.props;
    history.push(parentPath);
    this.setState({
      schemeId: "",
      proposalWindowType: null,
    });
  }

  private daoMembersRoute = (routeProps: any) => <DaoMembersPage {...routeProps} daoState={this.props.data[0]} />;
  private daoProposalRoute = (routeProps: any) =>
    <ProposalDetailsPage {...routeProps}
      currentAccountAddress={this.props.currentAccountAddress}
      daoState={this.props.data[0]}
      proposalId={routeProps.match.params.proposalId}
    />;
  private daoCrxProposalRoute = (routeProps: any) =>
    <DetailsPageRouter {...routeProps}
      currentAccountAddress={this.props.currentAccountAddress}
      daoState={this.props.data[0]}
      proposalId={routeProps.match.params.proposalId}
    />;

  private schemeRoute = (routeProps: any) => (
    <SchemeContainer
      {...routeProps}
      daoState={this.props.data[0]}
      currentAccountAddress={this.props.currentAccountAddress}
      onCreateProposal={this.handleNewProposal}
    />
  );
  private daoSchemesRoute = (routeProps: any) => <DaoSchemesPage {...routeProps} daoState={this.props.data[0]} />;
  private daoProposalsRoute = (routeProps: any) => (
    <DaoProposalsPage
      {...routeProps}
      daoState={this.props.data[0]}
      schemesLength={getKnownSchemes(this.props.data[2]).length}
      currentAccountAddress={this.props.currentAccountAddress}
      onCreateProposal={this.handleNewProposal}
    />
  );
  private createProposalRoute = (routeProps: any) => (
    <CreateProposalPage
      {...routeProps}
      onBackToParent={this.handleProposalWindowClose}
      dao={this.props.data[0].dao}
      currentAccountAddress={this.props.currentAccountAddress}
    />
  );
  private modalRouteCreateProposal = (route: any) => {
    return this.state.modalParentPath
      .replace(":daoAvatarAddress", route.params.daoAvatarAddress)
      .replace(":schemeId", this.state.schemeId);
  };
  private onFollwingDaosListChange = (daoAddress: string, history: any) => {
    this.setState({ loading: true });
    history.push(`/dao/${daoAddress}`);
  };

  public render(): RenderOutput {
    const daoState = this.props.data[0];
    const { followingDaosAddresses } = this.props;
    const { memberDaos, loading } = this.state;

    const followingDaos = followingDaosAddresses?.filter(address => getDAONameByID(address) !== undefined)
    .map(daoAddress => {
      return { id: daoAddress, name: getDAONameByID(daoAddress) };
    });

    const myDaos = followingDaos?.concat(memberDaos);
    const currentDaoAddress = window.location.pathname.split("/")[2];
    const myDaosAddresses = [] as any;
    const myDaosOptions = myDaos?.map(dao => {
      myDaosAddresses.push(dao.id);
      return <option key={dao.id} selected={dao.id === currentDaoAddress ? true : false} value={dao.id}>{dao.name}</option>;
    });

    if (!myDaosAddresses.includes(daoState.id)){
      myDaosOptions?.push(<option key={daoState.id} selected value={daoState.id}>{daoState.name}</option>);
    }

    return (
      <div className={css.outer}>
        <BreadcrumbsItem to="/daos/">All DAOs</BreadcrumbsItem>
        {/* A BreadcrumbsItem position is determined according the path depth, so it has to be at least /daos/. In order to prevent redirection we use preventDefault */}
        <BreadcrumbsItem onClick={(e: any) => { e.preventDefault(); }} to="/daos/"><select className={css.follwingDaosList} onChange={(e) => this.onFollwingDaosListChange(e.target.value, this.props.history)}>{myDaosOptions}</select></BreadcrumbsItem>
        <Helmet>
          <meta name="description" content={daoState.name + " | Managed on Alchemy by DAOstack"} />
          <meta name="og:description" content={daoState.name + " | Managed on Alchemy by DAOstack"} />
          <meta name="twitter:description" content={daoState.name + " | Managed on Alchemy by DAOstack"} />
        </Helmet>

        {!loading ? <div className={css.wrapper}>
          <Switch>
            <Route exact path="/dao/:daoAvatarAddress/members"
              render={this.daoMembersRoute} />

            <Route exact path="/dao/:daoAvatarAddress/proposal/:proposalId"
              render={this.daoProposalRoute} />

            <Route path="/dao/:daoAvatarAddress/crx/proposal/:proposalId"
              render={this.daoCrxProposalRoute} />

            <Route exact={this.state.proposalWindowType === PROPOSAL_WINDOW_TYPE.PROPOSAL_LIST} path="/dao/:daoAvatarAddress/scheme/:schemeId"
              render={this.schemeRoute} />

            <Route exact path="/dao/:daoAvatarAddress/schemes"
              render={this.daoSchemesRoute} />

            <Route path="/dao/:daoAvatarAddress"
              render={this.daoProposalsRoute}
            />
          </Switch>

          <ModalRoute
            path="/dao/:daoAvatarAddress/proposals/create"
            parentPath={this.modalRouteCreateProposal}
            component={this.createProposalRoute}
          />

          <ModalRoute
            path="/dao/:daoAvatarAddress/scheme/:schemeId/proposals/create"
            parentPath={this.modalRouteCreateProposal}
            component={this.createProposalRoute}
          />

        </div> : <Loading />}
      </div>
    );
  }
}

const SubscribedDaoContainer = withSubscription({
  wrappedComponent: DaoContainer,
  loadingComponent: <Loading />,
  errorComponent: (props) => <div>{props.error.message}</div>,
  checkForUpdate: ["daoAvatarAddress"],
  createObservable: (props: IExternalProps) => {
    const daoAddress = props.match.params.daoAvatarAddress;
    const arc = getArcByDAOAddress(daoAddress);
    const dao = arc.dao(daoAddress);
    const observable = combineLatest(
      dao.state(standardPolling(true)), // DAO state
      dao.members(),
      dao.schemes({ where: { isRegistered: true } }, standardPolling(true)),
    );
    return observable;
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscribedDaoContainer);
