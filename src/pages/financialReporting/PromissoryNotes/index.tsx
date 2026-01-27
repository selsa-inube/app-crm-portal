import { useCallback, useEffect, useState, useContext } from "react";
import { Stack, useFlag, Tag } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { IEntries } from "@components/data/TableBoard/types";
import { PromissoryNotesModal } from "@components/modals/PromissoryNotesModal";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { AppContext } from "@context/AppContext";
import {
  ICreditRequest,
  IPayrollDiscountAuthorization,
  IPromissoryNotes,
} from "@services/creditRequest/types";
import { getPayrollDiscountAuthorizationsById } from "@services/creditRequest/payroll_discount_authorizations";
import { getPromissoryNotesById } from "@services/creditRequest/promissory_notes";
import { EnumType } from "@hooks/useEnum/useEnum";
import { useToken } from "@hooks/useToken";

import {
  appearanceTag,
  getTableBoardActionMobile,
  getTableBoardActions,
  titlesFinanacialReporting,
  infoItems,
  getActionsMobileIcon,
} from "./config";
import { errorObserver, errorMessages } from "../config";

interface IPromissoryNotesProps {
  id: string;
  isMobile: boolean;
  lang: EnumType;
  creditRequest?: ICreditRequest | null;
}

export const PromissoryNotes = (props: IPromissoryNotesProps) => {
  const { isMobile, lang, creditRequest } = props;
  const { addFlag } = useFlag();
  const { getAuthorizationToken } = useToken();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataPromissoryNotes, setDataPromissoryNotes] = useState<IEntries[]>(
    [],
  );
  const [showRetry, setShowRetry] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setShowRetry(false);

    if (!creditRequest?.creditRequestId) return;

    try {
      const authorizationToken = await getAuthorizationToken();

      const [payrollDiscountResult, promissoryNotesResult] =
        await Promise.allSettled([
          getPayrollDiscountAuthorizationsById(
            businessUnitPublicCode,
            businessManagerCode,
            creditRequest.creditRequestId,
            authorizationToken,
          ),
          getPromissoryNotesById(
            businessUnitPublicCode,
            businessManagerCode,
            creditRequest.creditRequestId,
            authorizationToken,
          ),
        ]);

      const processResult = (
        result: PromiseSettledResult<
          IPayrollDiscountAuthorization[] | IPromissoryNotes[]
        >,
        observerId: string,
        sourceType: "payroll" | "promissory_note",
      ) =>
        result.status === "fulfilled"
          ? result.value.map((entry) => ({
              id: entry.payrollDiscountAuthorizationId,
              "No. de Obligación": entry.obligationCode,
              "No. de Documento": entry.documentCode,
              Tipo: sourceType === "payroll" ? "Libranza" : "Pagaré",
              tag: (
                <Tag
                  label={entry.documentState}
                  appearance={appearanceTag(entry.documentState)}
                />
              ),
            }))
          : (errorObserver.notify({
              id: observerId,
              message: result.reason.message,
            }),
            []);

      const combinedData = [
        ...processResult(payrollDiscountResult, "PayrollDiscount", "payroll"),
        ...processResult(
          promissoryNotesResult,
          "PromissoryNotes",
          "promissory_note",
        ),
      ];

      if (!combinedData.length)
        throw new Error("No se encontraron datos en la base de datos");

      setDataPromissoryNotes(combinedData);
    } catch (error) {
      setErrorMessage((error as Error).message);
      setShowRetry(true);
    } finally {
      setLoading(false);
    }
  }, [businessUnitPublicCode, businessManagerCode, creditRequest]);

  useEffect(() => {
    if (creditRequest?.creditRequestId) fetchData();
  }, [fetchData, creditRequest]);

  const handleRetry = () => {
    setLoading(true);
    setShowRetry(false);
    fetchData();
  };

  return (
    <Fieldset
      title={errorMessages.PromissoryNotes.titleCard.i18n[lang]}
      heightFieldset="100%"
      hasTable
      hasOverflow={isMobile}
    >
      {!creditRequest || showRetry ? (
        <ItemNotFound
          image={userNotFound}
          title={errorMessages.PromissoryNotes.title.i18n[lang]}
          description={
            errorMessages.PromissoryNotes.description.i18n[lang] || errorMessage
          }
          buttonDescription={errorMessages.PromissoryNotes.button.i18n[lang]}
          onRetry={handleRetry}
        />
      ) : (
        <Stack direction="column" height={!isMobile ? "100%" : "auto"}>
          <TableBoard
            id="promissoryNotes"
            titles={titlesFinanacialReporting}
            entries={dataPromissoryNotes}
            actions={getTableBoardActions(() => setShowModal(true))}
            actionMobile={getTableBoardActionMobile(() => setShowModal(true))}
            actionMobileIcon={getActionsMobileIcon()}
            loading={loading}
            appearanceTable={{
              widthTd: isMobile ? "23%" : undefined,
              efectzebra: true,
              title: "primary",
              isStyleMobile: true,
            }}
            isFirstTable
            infoItems={infoItems}
          />

          {showModal && (
            <PromissoryNotesModal
              title="Confirma los datos del usuario"
              buttonText="Enviar"
              formValues={{
                field1: "usuario@inube.com",
                field2: "3122638128",
                field3: "3122638128",
              }}
              handleClose={() => setShowModal(false)}
              onSubmit={() => {
                addFlag({
                  title: "Datos enviados",
                  description:
                    "Los datos del usuario han sido enviados exitosamente.",
                  appearance: "success",
                  duration: 5000,
                });
                setShowModal(false);
              }}
            />
          )}
        </Stack>
      )}
    </Fieldset>
  );
};
