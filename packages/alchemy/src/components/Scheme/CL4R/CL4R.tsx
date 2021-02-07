import * as React from "react";
import * as css from "./CL4R.scss";
import gql from "graphql-tag";
import Loading from "components/Shared/Loading";
import withSubscription, { ISubscriptionProps } from "components/Shared/withSubscription";
import { getArcByDAOAddress, standardPolling, getNetworkByDAOAddress, toWei, ethErrorHandler, fromWei, formatTokens } from "lib/util";
import { Address, CL4RScheme, IDAOState, ISchemeState, Token } from "@daostack/arc.js";
import { RouteComponentProps } from "react-router-dom";
import LockRow from "./LockRow";
import PeriodRow from "./PeriodRow";
import * as classNames from "classnames";
import * as moment from "moment";
import Countdown from "components/Shared/Countdown";
import { first } from "rxjs/operators";
import { combineLatest, of } from "rxjs";
import { enableWalletProvider } from "arc";
import { lock, releaseLocking, extendLocking, redeemLocking, approveTokens } from "@store/arc/arcActions";
import { showNotification } from "@store/notifications/notifications.reducer";
import { connect } from "react-redux";
import Tooltip from "rc-tooltip";
import { calculateTotalRedeemedAmount, getCL4RParams, getLockingIdsForRedeem, ICL4RParams } from "./CL4RHelper";
import BN from "bn.js";
import humanizeDuration from "humanize-duration";

interface IDispatchProps {
  lock: typeof lock;
  releaseLocking: typeof releaseLocking;
  extendLocking: typeof extendLocking;
  redeemLocking: typeof redeemLocking;
  showNotification: typeof showNotification;
  approveTokens: typeof approveTokens;
}

const mapDispatchToProps = {
  lock,
  releaseLocking,
  extendLocking,
  redeemLocking,
  showNotification,
  approveTokens,
};

type SubscriptionData = [any, BN, BN];
type IProps = IExternalProps & ISubscriptionProps<SubscriptionData> & IDispatchProps;
type IExternalProps = {
  daoState: IDAOState;
  scheme: ISchemeState;
  onCreateProposal: () => void;
  currentAccountAddress: Address;
} & RouteComponentProps<any>;

const CL4R = (props: IProps) => {
  const { data, daoState, currentAccountAddress } = props;
  const [loading, setLoading] = React.useState(true);
  const [schemeParams, setSchemeParams] = React.useState({} as ICL4RParams);
  const [showYourLocks, setShowYourLocks] = React.useState(false);
  const [lockDuration, setLockDuration] = React.useState(1);
  const [lockAmount, setLockAmount] = React.useState(0);
  const [cl4rScheme, setCL4RScheme] = React.useState<CL4RScheme>();
  const [isLocking, setIsLocking] = React.useState(false);
  const [isApprovingToken, setIsApprovingToken] = React.useState(false);
  const [isRedeeming, setIsRedeeming] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(moment().unix());
  const isAllowance = data[1]?.gt(new BN(0));
  const isEnoughBalance = fromWei(data[2]) >= lockAmount;
  const cl4Rlocks = (data as any)[0].data?.cl4Rlocks ?? [];
  const [redeemableAmount, setRedeemableAmount] = React.useState(0);

  React.useEffect(() => {
    setRedeemableAmount(0);
  }, [currentAccountAddress]);

  const isLockingStarted = React.useMemo(() => {
    return (moment().isAfter(moment.unix(Number(schemeParams.startTime))));
  }, [schemeParams]);

  const endTime = React.useMemo(() => {
    return Number(schemeParams.startTime) + (schemeParams.batchTime * schemeParams.batchesIndexCap);
  }, [schemeParams]);

  const isLockingEnded = React.useMemo(() => {
    return (moment().isAfter(moment.unix(endTime)));
  }, [schemeParams, currentTime]);

  const handleRelease = React.useCallback(async (lockingId: number, setIsReleasing: any) => {
    if (!await enableWalletProvider({ showNotification: props.showNotification }, getNetworkByDAOAddress(daoState.address))) { return; }
    props.releaseLocking(cl4rScheme, currentAccountAddress, lockingId, setIsReleasing);
  }, [cl4rScheme, currentAccountAddress]);

  const handleExtend = React.useCallback(async (extendPeriod: number, batchIndexToLockIn: number, lockingId: number, setIsExtending: any) => {
    if (!await enableWalletProvider({ showNotification: props.showNotification }, getNetworkByDAOAddress(daoState.address))) { return; }
    props.extendLocking(cl4rScheme, extendPeriod, batchIndexToLockIn, lockingId, schemeParams.agreementHash, setIsExtending);
  }, [cl4rScheme, schemeParams, currentAccountAddress]);

  const handleRedeem = React.useCallback(async (lockingIds: number[], setIsRedeeming: any) => {
    if (!await enableWalletProvider({ showNotification: props.showNotification }, getNetworkByDAOAddress(daoState.address))) { return; }
    props.redeemLocking(cl4rScheme, currentAccountAddress, lockingIds, setIsRedeeming, setRedeemableAmount);
  }, [cl4rScheme, schemeParams, currentAccountAddress]);

  const handleTokenApproving = React.useCallback(async () => {
    if (!await enableWalletProvider({ showNotification: props.showNotification }, getNetworkByDAOAddress(daoState.address))) { return; }
    props.approveTokens(props.scheme.address, getArcByDAOAddress(daoState.address), schemeParams.token, schemeParams.tokenSymbol, setIsApprovingToken);
  }, [schemeParams]);

  React.useEffect(() => {
    const getSchemeInfo = async () => {
      const arc = getArcByDAOAddress(daoState.id);
      setSchemeParams(await getCL4RParams(daoState.id, props.scheme.id));
      const schemes = await arc.schemes({ where: { id: props.scheme.id.toLowerCase() } }).pipe(first()).toPromise();
      setCL4RScheme(schemes[0].CTL4R as CL4RScheme);
      setLoading(false);
    };
    getSchemeInfo();
  }, []);

  const redeemedAmount = React.useMemo(() => {
    return calculateTotalRedeemedAmount(cl4Rlocks);
  }, [schemeParams, cl4Rlocks]);

  const durations = [] as any;
  for (let duration = 1; duration <= schemeParams.maxLockingBatches; duration++) {
    if (moment().unix() + (duration * schemeParams.batchTime) <= endTime) {
      durations.push(<option key={duration} value={duration} selected={duration === 1}>{duration}</option>);
    }
  }

  const startTime = Number(schemeParams.startTime);
  const timeElapsed = currentTime - startTime;
  const currentLockingBatch = isLockingEnded ? schemeParams.batchesIndexCap : Math.trunc(timeElapsed / schemeParams.batchTime);
  const nextBatchStartTime = moment.unix(startTime + ((currentLockingBatch + 1) * schemeParams.batchTime));
  const redeemable = moment().isSameOrAfter(moment.unix(Number(schemeParams.redeemEnableTime)));

  const handleLock = React.useCallback(async () => {
    if (!await enableWalletProvider({ showNotification: props.showNotification }, getNetworkByDAOAddress(daoState.address))) { return; }
    props.lock(cl4rScheme, toWei(Number(lockAmount)), lockDuration, currentLockingBatch, schemeParams.agreementHash, setIsLocking);
  }, [cl4rScheme, lockAmount, lockDuration, currentLockingBatch]);

  const allLockingIdsForRedeem = React.useMemo(() => {
    return getLockingIdsForRedeem(cl4Rlocks, currentLockingBatch, schemeParams.startTime, schemeParams.batchTime);
  }, [cl4Rlocks, currentAccountAddress, currentTime, schemeParams]);

  const periods = [];
  for (let period = 0; period <= currentLockingBatch; period++) {
    periods.push(<PeriodRow
      key={period}
      period={period}
      schemeParams={schemeParams}
      lockData={cl4Rlocks}
      cl4rScheme={cl4rScheme}
      currentLockingBatch={currentLockingBatch}
      isLockingEnded={isLockingEnded}
      redeemableAmount={redeemableAmount}
      setRedeemableAmount={setRedeemableAmount} />);
  }
  if (isLockingEnded) {
    periods.splice(-1, 1);
  }

  periods.reverse();

  const lockings = (cl4Rlocks?.map((lock: any) => {
    return <LockRow
      key={lock.id}
      schemeParams={schemeParams}
      lockData={lock}
      handleRelease={handleRelease}
      handleExtend={handleExtend}
      endTime={endTime}
      currentLockingBatch={currentLockingBatch}
      isLockingEnded={isLockingEnded} />;
  }));

  let prefix = "Next in";

  if (!isLockingStarted) {
    prefix = "Starts in";
  }

  if (currentLockingBatch + 1 === schemeParams.batchesIndexCap) {
    prefix = "Ends in";
  }

  const periodsClass = classNames({
    [css.title]: true,
    [css.active]: !showYourLocks,
  });

  const locksClass = classNames({
    [css.title]: true,
    [css.active]: showYourLocks,
  });

  const lockButtonClass = classNames({
    [css.actionButton]: true,
    [css.disabled]: !lockAmount || !lockDuration || isLocking || !isEnoughBalance,
  });

  const approveTokenButtonClass = classNames({
    [css.actionButton]: true,
    [css.disabled]: isApprovingToken,
  });

  const actionButtonClass = classNames({
    [css.actionButton]: true,
    [css.disabled]: isRedeeming || !redeemable || redeemableAmount === 0,
  });

  return (
    !loading ? <div className={css.wrapper}>
      <div className={css.leftWrapper}>
        <div className={css.top}>
          <div className={css.countersWrapper}>
            <div className={css.currentPeriod}>Current Period: {isLockingEnded ? schemeParams.batchesIndexCap : currentLockingBatch + 1} of {schemeParams.batchesIndexCap}</div>
            <div className={css.nextPeriod}>{isLockingEnded ? "Locking Ended" : <div>{prefix} <Countdown toDate={nextBatchStartTime} onEnd={() => setCurrentTime(moment().unix())} /></div>}</div>
          </div>
          <div className={css.redeemWrapper}>
            <div className={css.redeemButtonWrapper}>
              <button
                className={actionButtonClass}
                onClick={() => handleRedeem(allLockingIdsForRedeem, setIsRedeeming)}
                disabled={isRedeeming || !redeemable || redeemableAmount === 0}>{`Redeem ${formatTokens(toWei(redeemableAmount))} REP`}
              </button>
              {!redeemable && <Tooltip trigger={["hover"]} overlay={`Redeem Enable Time: ${moment.unix(Number(schemeParams.redeemEnableTime)).utc().format("h:mm A [UTC] on MMMM Do, YYYY")}`}>
                <img style={{ marginLeft: "10px" }} width="15px" src="/assets/images/Icon/question-help.svg" />
              </Tooltip>}
            </div>
            <div className={css.redeemedAmountLabel}>{`Total Redeemed: ${formatTokens(redeemedAmount, "REP")}`}</div>
          </div>
        </div>
        <div className={css.tableTitleWrapper}>
          <div className={periodsClass} onClick={() => { setShowYourLocks(false); setRedeemableAmount(0); }}>All Periods</div>
          <div className={locksClass} onClick={() => setShowYourLocks(true)}>Your Locks</div>
        </div>
        {
          showYourLocks ? cl4Rlocks.length > 0 ?
            <table>
              <thead>
                <tr>
                  <th style={{ padding: "10px" }}>Period</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>Releasable</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lockings}
              </tbody>
            </table>
            : <span className={css.noLockLabel}>No locks yet.</span> :
            <table>
              <thead>
                <tr>
                  <th style={{ padding: "10px" }}>Period</th>
                  <th>You Locked</th>
                  <th>Total Reputation</th>
                  <th>You Will Receive</th>
                </tr>
              </thead>
              <tbody>
                {periods}
              </tbody>
            </table>
        }
      </div>
      {!isLockingEnded && isLockingStarted && <div className={css.lockWrapper}>
        <div className={css.lockTitle}>New Lock</div>
        <div className={css.lockDurationLabel}>
          <span style={{ marginRight: "5px" }}>Lock Duration</span>
          <Tooltip trigger={["hover"]} overlay={`Period: ${humanizeDuration(schemeParams.batchTime * 1000)}`}>
            <img width="15px" src="/assets/images/Icon/question-help.svg" />
          </Tooltip>
        </div>
        <select onChange={(e: any) => setLockDuration(e.target.value)} disabled={!isAllowance}>
          {durations}
        </select>
        <span style={{ marginBottom: "5px" }}>Lock Amount ({schemeParams.tokenSymbol})</span>
        <input type="number" onChange={(e: any) => setLockAmount(e.target.value)} disabled={!isAllowance} />
        {!isEnoughBalance && <span className={css.lowBalanceLabel}>{`Not enough ${schemeParams.tokenSymbol}!`}</span>}
        {<span className={css.releasableLable}>Releasable: {moment().add(lockDuration * schemeParams.batchTime, "seconds").format("DD.MM.YYYY HH:mm")}</span>}
        {isAllowance && <button onClick={handleLock} className={lockButtonClass} disabled={!lockAmount || !lockDuration}>Lock</button>}
        {!isAllowance && <Tooltip trigger={["hover"]} overlay={`Upon activation, the smart contract will be authorized to receive up to 100,000 ${schemeParams.tokenSymbol}`}>
          <button onClick={handleTokenApproving} className={approveTokenButtonClass} disabled={isApprovingToken}>Enable Locking</button>
        </Tooltip>}
      </div>}
    </div> : <Loading />
  );
};

const SubscribedCL4R = withSubscription({
  wrappedComponent: CL4R,
  loadingComponent: <Loading />,
  errorComponent: (props) => <div>{props.error.message}</div>,
  checkForUpdate: ["currentAccountAddress"],
  createObservable: async (props: IProps) => {
    if (props.currentAccountAddress) {
      const arc = getArcByDAOAddress(props.daoState.id);
      const schemeToken = gql`
      query SchemeInfo {
        controllerSchemes(where: {id: "${props.scheme.id.toLowerCase()}"}) {
          continuousLocking4ReputationParams {
            id
            token
          }
        }
      }
      `;
      const schemeTokenData = await arc.sendQuery(schemeToken);
      const tokenString = schemeTokenData.data.controllerSchemes[0].continuousLocking4ReputationParams.token;
      const locksQuery = gql`
      query Locks {
        cl4Rlocks(where: {scheme: "${props.scheme.id.toLowerCase()}", locker: "${props.currentAccountAddress}"}) {
          id
          lockingId
          locker
          amount
          lockingTime
          period
          released
          releasedAt
          redeemed {
            id
            lock
            amount
            redeemedAt
            batchIndex
          }
        }
      }
      `;
      const token = new Token(tokenString, arc);
      const allowance = token.allowance(props.currentAccountAddress, props.scheme.address);
      const balanceOf = token.balanceOf(props.currentAccountAddress);
      return combineLatest(
        arc.getObservable(locksQuery, standardPolling()),
        allowance.pipe(ethErrorHandler()),
        balanceOf.pipe(ethErrorHandler())
      );
    } else {
      return of([[], new BN(0), new BN(0)] as SubscriptionData);
    }
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(SubscribedCL4R);
