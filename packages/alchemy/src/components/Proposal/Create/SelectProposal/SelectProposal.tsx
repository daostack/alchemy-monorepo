import * as React from "react";
import { useCallback, useEffect, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";

import { DAO, ISchemeState, Scheme } from "@daostack/arc.js";

import { getUnknownSchemes, getProposalSchemes } from "lib/schemeUtils";
import Select from "react-select";

import SelectProposalLabel from "components/Proposal/Create/SelectProposal/SelectProposalLabel";
import * as css from "components/Proposal/Create/SelectProposal/SelectProposal.scss";
import { ISubscriptionProps } from "components/Shared/withSubscription";

export interface IExternalSelectProposalProps extends RouteComponentProps<{ daoAvatarAddress: string }>, ISubscriptionProps<any> {
  dao: DAO;
  daoAvatarAddress: string;
  scheme?: ISchemeState;
}

interface IProps extends IExternalSelectProposalProps {
  data: Scheme[];
}

export const SelectProposal: React.FC<IProps> = ({
  scheme,
  daoAvatarAddress,
  data: schemes,
  history,
  match,
}) => {
  const handleChange = useCallback((el) => {
    const schemeId = el.value;
    history.push(`/dao/${match.params.daoAvatarAddress}/scheme/${schemeId}/proposals/create`);
  }, [daoAvatarAddress, history, match]);

  const knownProposalSchemes = useMemo(() => {
    return getProposalSchemes(schemes);
  }, [schemes]);

  useEffect(() => {
    if (!scheme && knownProposalSchemes?.length) {
      handleChange({ value: knownProposalSchemes[0].staticState.id });
    }
  }, [handleChange, scheme, knownProposalSchemes]);

  const unknownSchemes = useMemo(() => {
    return getUnknownSchemes(schemes);
  }, [schemes]);

  const options = useMemo(() => {
    return knownProposalSchemes.map(({staticState}: Scheme) => ({
      label: staticState,
      value: staticState.id,
    }));
  }, [knownProposalSchemes]);

  const currentOption = useMemo(() => {
    if (scheme?.id) {
      return options.find(el => el.value === scheme.id);
    }

    return undefined;
  }, [options, scheme]);

  return (
    <div className={css.body}>
      <div className={css.wrapper}>
        <label className={css.label} htmlFor="selectProposalType">
          Proposal Type
        </label>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Select
            value={currentOption}
            id="selectProposalType"
            options={options}
            onChange={handleChange}
            maxMenuHeight={200}
            placeholder="Select Proposal Type..."
            formatOptionLabel={SelectProposalLabel}
            styles={{menu: (provided: any) => ({ ...provided, zIndex: 901 })}}
          />
        </React.Suspense>
        {Boolean(unknownSchemes?.length) && <span style={{fontSize: 8, display: "none"}}>{unknownSchemes.length}</span>}
      </div>
    </div>
  );
};
