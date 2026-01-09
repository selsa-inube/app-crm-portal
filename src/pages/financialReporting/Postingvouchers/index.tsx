import { useContext, useEffect, useState } from "react";
import { Stack } from "@inubekit/inubekit";
import { useIAuth } from "@inube/iauth-react";

import { AppContext } from "@context/AppContext";
import { IEntries } from "@components/data/TableBoard/types";
import { UnfoundData } from "@components/layout/UnfoundData";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import {
  IAccountingVouchers,
  ICreditRequest,
} from "@services/creditRequest/types";
import { getAccountingVouchers } from "@services/creditRequest/accountingVouchers";
import { EnumType } from "@hooks/useEnum/useEnum";

import { errorMessages } from "../config";
import {
  actionsPostingvouchers,
  titlesPostingvouchers,
  actionMobile,
} from "./config";

interface IApprovalsProps {
  user: string;
  id: string;
  isMobile: boolean;
  lang: EnumType;
  creditRequest?: ICreditRequest | null;
}
export const Postingvouchers = (props: IApprovalsProps) => {
  const { isMobile, lang, creditRequest } = props;
  const { user } = useIAuth();
  const [error, setError] = useState(false);
  const [positionsAccountingVouchers, setPositionsAccountingVouchers] =
    useState<IAccountingVouchers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const fetchAccountingVouchers = async () => {
    if (!creditRequest?.creditRequestId) return;
    setLoading(true);
    try {
      const vouchers = await getAccountingVouchers(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequest.creditRequestId,
      );
      setPositionsAccountingVouchers(vouchers);
    } catch (error) {
      console.error("Error loading accounting vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountingVouchers();
  }, [user, creditRequest, businessUnitPublicCode, businessManagerCode]);

  return (
    <Stack direction="column">
      <Fieldset
        title={errorMessages.Postingvouchers.titleCard.i18n[lang]}
        heightFieldset={isMobile ? "100%" : "162px"}
        hasTable
        hasOverflow={isMobile}
      >
        {error || (!loading && positionsAccountingVouchers.length === 0) ? (
          <UnfoundData
            title={errorMessages.PromissoryNotes.title.i18n[lang]}
            description={errorMessages.PromissoryNotes.description.i18n[lang]}
            buttonDescription={errorMessages.PromissoryNotes.button.i18n[lang]}
            onRetry={() => {
              setError(false);
              fetchAccountingVouchers();
            }}
          />
        ) : (
          <TableBoard
            id="postingvouchers"
            loading={loading}
            titles={titlesPostingvouchers}
            entries={positionsAccountingVouchers as unknown as IEntries[]}
            actions={actionsPostingvouchers}
            actionMobile={actionMobile}
            appearanceTable={{
              efectzebra: true,
              title: "primary",
              isStyleMobile: true,
            }}
            isFirstTable={true}
          />
        )}
      </Fieldset>
    </Stack>
  );
};
