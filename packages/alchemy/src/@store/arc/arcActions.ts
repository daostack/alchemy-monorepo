import Arc, { Address, DAO, IProposalCreateOptions, IProposalOutcome, ITransactionState, ITransactionUpdate, ReputationFromTokenScheme, Scheme, CL4RScheme, Token } from "@daostack/arc.js";
import { IAsyncAction } from "@store/async";
import { toWei, getArcByDAOAddress } from "lib/util";
import { IRedemptionState } from "lib/proposalHelpers";
import { IRootState } from "@store/index";
import { NotificationStatus, showNotification } from "@store/notifications/notifications.reducer";
import * as Redux from "redux";
import { ThunkAction } from "redux-thunk";
import BN from "bn.js";

export type CreateProposalAction = IAsyncAction<"ARC_CREATE_PROPOSAL", { avatarAddress: string }, any>;

/** use like this (unfortunately you need the @ts-ignore)
 * // @ts-ignore
 * transaction.send().observer(...operationNotifierObserver(dispatch, "Whatever"))
 */
export const operationNotifierObserver = (dispatch: Redux.Dispatch<any, any>, txDescription = "", onSuccess?: any, onError?: any): [(update: ITransactionUpdate<any>) => void, (err: Error) => void] => {
  return [
    (update: ITransactionUpdate<any>) => {
      let msg: string;
      if (update.state === ITransactionState.Sent) {
        msg = `${txDescription} transaction sent! Please wait for it to be processed`;
        dispatch(showNotification(NotificationStatus.Success, msg));
      } else if (update.confirmations === 0) {
        msg = `${txDescription} transaction processed successfully`;
        dispatch(showNotification(NotificationStatus.Success, msg));
      } else if (update.confirmations === 3) {
        msg = `${txDescription} transaction confirmed`;
        dispatch(showNotification(NotificationStatus.Success, msg));
        if (onSuccess) {
          onSuccess();
        }
      }
    },
    (err: Error) => {
      const msg = `${txDescription}: transaction failed :-( - ${err.message}`;
      // eslint-disable-next-line no-console
      console.warn(msg);
      dispatch(showNotification(NotificationStatus.Failure, msg));
      if (onError) {
        onError();
      }
    },
  ];
};

export function createProposal(proposalOptions: IProposalCreateOptions, daoAvatarAddress: string): ThunkAction<any, IRootState, null> {
  return async (dispatch: Redux.Dispatch<any, any>, _getState: () => IRootState) => {
    try {
      const arc = getArcByDAOAddress(daoAvatarAddress);

      const dao = new DAO(proposalOptions.dao, arc);

      const observer = operationNotifierObserver(dispatch, "Create proposal");
      await dao.createProposal(proposalOptions).subscribe(...observer);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    }
  };
}

export function executeProposal(avatarAddress: string, proposalId: string, _accountAddress: string) {
  return async (dispatch: Redux.Dispatch<any, any>) => {
    const arc = getArcByDAOAddress(avatarAddress);
    const observer = operationNotifierObserver(dispatch, "Execute proposal");
    const proposalObj = await arc.dao(avatarAddress).proposal(proposalId);

    // Call claimRewards to both execute the proposal and redeem the ContributionReward rewards,
    //   pass in null to not redeem any GenesisProtocol rewards
    const originalErrorHandler = observer[1];
    observer[1] = async (_error: any): Promise<any> => {
      observer[1] = originalErrorHandler;
      return await proposalObj.execute().subscribe(...observer);
    };
    await proposalObj.claimRewards(null).subscribe(...observer);
  };
}

export function executeCalls(avatarAddress: string, proposalId: string) {
  return async (dispatch: Redux.Dispatch<any, any>) => {
    try {
      const arc = getArcByDAOAddress(avatarAddress);
      const observer = operationNotifierObserver(dispatch, "Execute calls");
      const proposalObj = await arc.dao(avatarAddress).proposal(proposalId);
      return await proposalObj.executeCalls().subscribe(...observer);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}

export type VoteAction = IAsyncAction<"ARC_VOTE", {
  avatarAddress: string;
  proposalId: string;
  reputation: number;
  voteOption: IProposalOutcome;
  voterAddress: string;
}, {
  entities: any;
  proposal: any;
  voter: any;
}>;

export function voteOnProposal(daoAvatarAddress: string, proposalId: string, voteOption: IProposalOutcome) {
  return async (dispatch: Redux.Dispatch<any, any>, _getState: () => IRootState) => {
    const arc = getArcByDAOAddress(daoAvatarAddress);
    const proposalObj = await arc.dao(daoAvatarAddress).proposal(proposalId);
    const observer = operationNotifierObserver(dispatch, "Vote");
    await proposalObj.vote(voteOption).subscribe(...observer);
  };
}

export type StakeAction = IAsyncAction<"ARC_STAKE", {
  avatarAddress: string;
  proposalId: string;
  prediction: IProposalOutcome;
  stakeAmount: number;
  stakerAddress: string;
}, {
  dao: any;
  proposal: any;
}>;

export function stakeProposal(daoAvatarAddress: string, proposalId: string, prediction: number, stakeAmount: number) {
  return async (dispatch: Redux.Dispatch<any, any>, ) => {
    const arc = getArcByDAOAddress(daoAvatarAddress);
    const proposalObj = await arc.dao(daoAvatarAddress).proposal(proposalId);
    const observer = operationNotifierObserver(dispatch, "Stake");
    await proposalObj.stake(prediction, toWei(stakeAmount)).subscribe(...observer);
  };
}

// Approve transfer of 100000 GENs from accountAddress to the GenesisProtocol contract for use in staking
export function approveStakingGens(spender: Address, daoId: any) {
  return async (dispatch: Redux.Dispatch<any, any>, ) => {
    const arc = getArcByDAOAddress(daoId);
    const observer = operationNotifierObserver(dispatch, "Approve GEN");
    await arc.approveForStaking(spender, toWei(100000)).subscribe(...observer);
  };
}

export type RedeemAction = IAsyncAction<"ARC_REDEEM", {
  avatarAddress: string;
  proposalId: string;
  accountAddress: string;
}, {
  currentAccount: any;
  beneficiary: any;
  dao: any;
  proposal: any;
  beneficiaryRedemptions: IRedemptionState;
  currentAccountRedemptions: IRedemptionState;
}>;

export function redeemProposal(daoAvatarAddress: string, proposalId: string, accountAddress: string) {
  return async (dispatch: Redux.Dispatch<any, any>) => {
    const arc = getArcByDAOAddress(daoAvatarAddress);
    const proposalObj = await arc.dao(daoAvatarAddress).proposal(proposalId);
    const observer = operationNotifierObserver(dispatch, "Reward");
    await proposalObj.claimRewards(accountAddress).subscribe(...observer);
  };
}

export function redeemReputationFromToken(scheme: Scheme, addressToRedeem: string, privateKey: string|undefined, redeemerAddress: Address|undefined, redemptionSucceededCallback: () => void) {
  return async (dispatch: Redux.Dispatch<any, any>) => {
    const arc = getArcByDAOAddress(redeemerAddress);

    // ensure that scheme.ReputationFromToken is set
    await scheme.fetchStaticState();

    if (privateKey) {
      const reputationFromTokenScheme = scheme.ReputationFromToken as ReputationFromTokenScheme;
      const agreementHash = await reputationFromTokenScheme.getAgreementHash();
      const state = await reputationFromTokenScheme.scheme.fetchStaticState();
      const contract = arc.getContract(state.address);
      const block = await arc.web3.eth.getBlock("latest");
      const gas = block.gasLimit - 100000;
      const redeemMethod = contract.methods.redeem(addressToRedeem, agreementHash);
      let gasPrice = await arc.web3.eth.getGasPrice();
      gasPrice = gasPrice * 1.2;
      const txToSign = {
        gas,
        gasPrice,
        data: redeemMethod.encodeABI(),
        to: state.address,
        value: "0",
      };
      const gasEstimate = await arc.web3.eth.estimateGas(txToSign);
      txToSign.gas = gasEstimate;
      // if the gas cost is higher then the users balance, we lower it to fit
      const userBalance = await arc.web3.eth.getBalance(redeemerAddress);
      if (userBalance < gasEstimate * gasPrice) {
        txToSign.gasPrice = Math.floor(userBalance/gasEstimate);
      }
      const signedTransaction = await arc.web3.eth.accounts.signTransaction(txToSign, privateKey);
      dispatch(showNotification(NotificationStatus.Success, "Sending redeem transaction, please wait for it to be mined"));
      // const txHash = await arc.web3.utils.sha3(signedTransaction.rawTransaction);
      try {
        await arc.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        dispatch(showNotification(NotificationStatus.Success, "Transaction was succesful!"));
        redemptionSucceededCallback();
      } catch (err) {
        dispatch(showNotification(NotificationStatus.Failure, `Transaction failed: ${err.message}`));
      }
    } else {
      const observer = operationNotifierObserver(dispatch, "Redeem reputation");
      const reputationFromTokenScheme = scheme.ReputationFromToken as ReputationFromTokenScheme;

      // send the transaction and get notifications
      if (reputationFromTokenScheme) {
        const agreementHash = await reputationFromTokenScheme.getAgreementHash();
        reputationFromTokenScheme.redeem(addressToRedeem, agreementHash).subscribe(observer[0], observer[1], redemptionSucceededCallback);
      }
    }
  };
}

/**
 * Locks tokens in a CL4R scheme
 * @param {CL4RScheme} cl4rScheme
 * @param {BN} lockAmount
 * @param {number} lockDuration
 * @param {number} currentLockingBatch
 * @param {string} agreementHash
 * @param {function} setIsLocking
 */
export const lock = (cl4rScheme: CL4RScheme, lockAmount: BN, lockDuration: number, currentLockingBatch: number, agreementHash: string, setIsLocking: any) => {
  return async (dispatch: Redux.Dispatch<any, any>) => {
    setIsLocking(true);
    const observer = operationNotifierObserver(dispatch, "Lock", () => setIsLocking(false), () => setIsLocking(false));
    cl4rScheme.lock(lockAmount, lockDuration, currentLockingBatch, agreementHash).subscribe(...observer);
  };
};

/**
 * Releases a lock in a CL4R scheme
 * @param {CL4RScheme} cl4rScheme
 * @param {string} beneficiary
 * @param {number} lockingId
 * @param {function} setIsReleasing
 */
export const releaseLocking = (cl4rScheme: CL4RScheme, beneficiary: string, lockingId: number, setIsReleasing: any) => {
  return async (dispatch: Redux.Dispatch<any, any>) => {
    setIsReleasing(true);
    const observer = operationNotifierObserver(dispatch, "Release Locking", () => setIsReleasing(false), () => setIsReleasing(false));
    cl4rScheme.release(beneficiary, lockingId).subscribe(...observer);
  };
};

/**
 * Extends an existing lock in a CL4R scheme
 * @param {CL4RScheme} cl4rScheme
 * @param {number} extendPeriod
 * @param {number} batchIndexToLockIn
 * @param {number} lockingId
 * @param {string} agreementHash
 * @param {function} setIsExtending
 */
export const extendLocking = (cl4rScheme: CL4RScheme, extendPeriod: number, batchIndexToLockIn: number, lockingId: number, agreementHash: string, setIsExtending: any) => {
  return async (dispatch: Redux.Dispatch<any, any>) => {
    setIsExtending(true);
    const observer = operationNotifierObserver(dispatch, "Extend Locking", () => setIsExtending(false), () => setIsExtending(false));
    cl4rScheme.extendLocking(extendPeriod, batchIndexToLockIn, lockingId, agreementHash).subscribe(...observer);
  };
};

/**
 * Redeems reputation from a lock in a CL4R scheme
 * @param {CL4RScheme} cl4rScheme
 * @param {string} beneficiary
 * @param {int[]} lockingIds
 * @param {function} setIsRedeeming
 * @param {function} setRedeemableAmount
 */
export const redeemLocking = (cl4rScheme: CL4RScheme, beneficiary: string, lockingIds: number[], setIsRedeeming: any, setRedeemableAmount: any) => {
  return async (dispatch: Redux.Dispatch<any, any>) => {
    setIsRedeeming(true);
    const observer = operationNotifierObserver(dispatch, "Redeem Locking", () => { setIsRedeeming(false); setRedeemableAmount(0); }, () => setIsRedeeming(false));
    cl4rScheme.redeem(beneficiary, lockingIds).subscribe(...observer);
  };
};

/**
 * A generic function to approve spending of a token in a scheme.
 * The default allowance is 100,000 tokens.
 * @param {Address} spender
 * @param {Arc} arc
 * @param {string} token
 * @param {string} tokenSymbol
 * @param {function} setIsApproving
 * @param {number} amount
 */
export function approveTokens(spender: Address, arc: Arc, token: string, tokenSymbol: string, setIsApproving: any, amount = 100000) {
  return async (dispatch: Redux.Dispatch<any, any>, ) => {
    const tokenObj = new Token(token, arc);
    setIsApproving(true);
    const observer = operationNotifierObserver(dispatch, `Approve ${tokenSymbol}`, () => setIsApproving(false), () => setIsApproving(false));
    tokenObj.approveForStaking(spender, toWei(amount)).subscribe(...observer);
  };
}
