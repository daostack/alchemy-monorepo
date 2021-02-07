import { IDAOState, IProposalState, IProposalType } from "@daostack/arc.js";
import classNames from "classnames";
import { getNetworkByDAOAddress, linkToEtherScan } from "lib/util";
import CopyToClipboard from "components/Shared/CopyToClipboard";
import { schemeNameAndAddress } from "lib/schemeUtils";
import * as React from "react";
import { IProfileState } from "@store/profiles/profilesReducer";
import * as css from "./ProposalSummary.scss";

interface IExternalProps {
  beneficiaryProfile?: IProfileState;
  detailView?: boolean;
  dao: IDAOState;
  proposal: IProposalState;
  transactionModal?: boolean;
}

interface IState {
  network: string;
}

type IProps = IExternalProps;

export default class ProposalSummary extends React.Component<IProps, IState> {

  public render(): RenderOutput {
    const { proposal, detailView, transactionModal } = this.props;
    const network = getNetworkByDAOAddress(this.props.dao.address);

    const proposalSummaryClass = classNames({
      [css.detailView]: detailView,
      [css.transactionModal]: transactionModal,
      [css.proposalSummary]: true,
      [css.withDetails]: true,
    });

    const schemeRegistrar = proposal.schemeRegistrar;
    const permissions = parseInt(schemeRegistrar.schemeToRegisterPermission, 16);

    return (
      <div className={proposalSummaryClass}>
        {schemeRegistrar.schemeToRemove ?
          <div>
            <span className={css.summaryTitle}>
              <img src="/assets/images/Icon/delete.svg" />&nbsp;
                  Remove Scheme&nbsp;
              <a href={linkToEtherScan(schemeRegistrar.schemeToRemove, network)} target="_blank" rel="noopener noreferrer">{schemeNameAndAddress(schemeRegistrar.schemeToRemove)}</a>
            </span>
            {detailView ?
              <div className={css.summaryDetails}>
                <table><tbody>
                  <tr>
                    <th>
                      Address:
                      <a href={linkToEtherScan(schemeRegistrar.schemeToRemove, network)} target="_blank" rel="noopener noreferrer">
                        <img src="/assets/images/Icon/Link-blue.svg" />
                      </a>
                    </th>
                    <td>{schemeRegistrar.schemeToRemove}</td>
                  </tr>
                </tbody></table>
              </div>
              : ""
            }
          </div>
          : schemeRegistrar.schemeToRegister ?
            <div>
              <span className={css.summaryTitle}>
                <b className={css.schemeRegisterIcon}>{proposal.type === IProposalType.SchemeRegistrarEdit ? <img src="/assets/images/Icon/edit-sm.svg" /> : "+"}</b>&nbsp;
                {proposal.type === IProposalType.SchemeRegistrarEdit ? "Edit" : "Add"} Scheme&nbsp;
                <a href={linkToEtherScan(schemeRegistrar.schemeToRegister, network)} target="_blank" rel="noopener noreferrer">{schemeNameAndAddress(schemeRegistrar.schemeToRegister)}</a>
              </span>
              {detailView ?
                <div className={css.summaryDetails}>
                  <table>
                    <tbody>
                      <tr>
                        <th>
                          Address:
                          <a href={linkToEtherScan(schemeRegistrar.schemeToRegister, network)} target="_blank" rel="noopener noreferrer">
                            <img src="/assets/images/Icon/Link-blue.svg" />
                          </a>
                        </th>
                        <td>
                          <span>{schemeRegistrar.schemeToRegister}</span>
                          <CopyToClipboard value={schemeRegistrar.schemeToRegister} />
                        </td>
                      </tr>
                      <tr>
                        <th>Param Hash:</th>
                        <td>
                          <span>{schemeRegistrar.schemeToRegisterParamsHash.slice(0, 43)}</span>
                          <CopyToClipboard value={schemeRegistrar.schemeToRegisterParamsHash} />
                        </td>
                      </tr>
                      <tr>
                        <th>Permissions:</th>
                        <td>
                          {
                            // eslint-disable-next-line no-bitwise
                            permissions & 2 ? <div>Register other schemes</div> : ""
                          }
                          {
                            // eslint-disable-next-line no-bitwise
                            permissions & 4 ? <div>Change constraints</div> : ""
                          }
                          {
                            // eslint-disable-next-line no-bitwise
                            permissions & 8 ? <div>Upgrade the controller</div> : ""
                          }
                          {
                            // eslint-disable-next-line no-bitwise
                            permissions & 16 ? <div>Call genericCall on behalf of</div> : ""
                          }
                          {
                            <div>Mint or burn reputation</div>
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                : ""
              }
            </div>
            :
            ""
        }
      </div>
    );
  }
}
