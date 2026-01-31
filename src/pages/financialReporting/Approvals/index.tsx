import { useState, useEffect, useCallback, useContext } from "react";

import userNotFound from "@assets/images/ItemNotFound.png";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { IEntries } from "@components/data/TableBoard/types";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { getApprovalsById } from "@services/creditRequest/getApprovals";
import { ICreditRequest } from "@services/creditRequest/types";
import { AppContext } from "@context/AppContext";
import { EnumType } from "@hooks/useEnum/useEnum";

import { errorObserver, errorMessages } from "../config";
import {
  desktopActions,
  entriesApprovals,
  getActionsMobileIcon,
  titlesApprovals,
} from "../outlet/financialReporting/configApprovals";

import { IApprovals } from "./types";

interface IApprovalsProps {
  user: string;
  isMobile: boolean;
  creditRequest?: ICreditRequest | null;
  lang: EnumType;
}

export const Approvals = (props: IApprovalsProps) => {
  const { isMobile, creditRequest, lang } = props;

  const [loading, setLoading] = useState(true);
  const [approvalsEntries, setApprovalsEntries] = useState<IEntries[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const businessManagerCode = eventData.businessManager.publicCode;

  const fetchApprovalsData = useCallback(async () => {
    if (!creditRequest?.creditRequestId) return;
    setLoading(true);
    setError(null);
    try {
      const data: IApprovals = await getApprovalsById(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequest.creditRequestId,
        eventData.token,
      );
      if (data && Array.isArray(data)) {
        const entries: IEntries[] = entriesApprovals(data).map((entry) => ({
          ...entry,
          error: entry.concept === "Pendiente",
        }));
        setApprovalsEntries(entries);
      }
    } catch (error) {
      console.error(error);
      errorObserver.notify({
        id: "Aprovals",
        message: (error as Error).message.toString(),
      });
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [
    businessUnitPublicCode,
    creditRequest?.creditRequestId,
    businessManagerCode,
  ]);

  useEffect(() => {
    fetchApprovalsData();
  }, [fetchApprovalsData]);

  const desktopActionsConfig = !isMobile ? desktopActions([]) : [];

  const handleRetry = () => {
    fetchApprovalsData();
  };

  return (
    <>
      <Fieldset
        title={errorMessages.approval.titleCard.i18n[lang]}
        heightFieldset="100%"
        hasTable
        hasOverflow={isMobile || !creditRequest || Boolean(error)}
      >
        {!creditRequest || error ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessages.approval.title.i18n[lang]}
            description={errorMessages.approval.description.i18n[lang]}
            buttonDescription={errorMessages.approval.button.i18n[lang]}
            onRetry={handleRetry}
          />
        ) : (
          <TableBoard
            id="usuarios"
            titles={titlesApprovals}
            entries={approvalsEntries}
            actions={desktopActionsConfig}
            actionMobileIcon={getActionsMobileIcon()}
            loading={loading}
            isFirstTable={true}
          />
        )}
      </Fieldset>
    </>
  );
};
