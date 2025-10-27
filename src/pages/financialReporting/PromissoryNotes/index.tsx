import { useCallback, useEffect, useState, useContext } from "react";
import { Stack, useFlag, Tag } from "@inubekit/inubekit";

import ItemNotFound from "@assets/images/ItemNotFound.png";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { IEntries } from "@components/data/TableBoard/types";
import { PromissoryNotesModal } from "@components/modals/PromissoryNotesModal";
import { UnfoundData } from "@components/layout/UnfoundData";
import { AppContext } from "@context/AppContext";

import {
  appearanceTag,
  getTableBoardActionMobile,
  getTableBoardActions,
  titlesFinanacialReporting,
  infoItems,
  getActionsMobileIcon,
} from "./config";
import { errorObserver, errorMessages } from "../config";
import {
  ICreditRequest,
  IPayrollDiscountAuthorization,
  IPromissoryNotes,
} from "@src/services/creditRequest/types";
import { getCreditRequestByCode } from "@src/services/creditRequest/getCreditRequestByCode";
import { getPayrollDiscountAuthorizationsById } from "@src/services/creditRequest/payroll_discount_authorizations";
import { getPromissoryNotesById } from "@src/services/creditRequest/promissory_notes";

interface IPromissoryNotesProps {
  id: string;
  isMobile: boolean;
}

export const PromissoryNotes = (props: IPromissoryNotesProps) => {
  const { id, isMobile } = props;
  const { addFlag } = useFlag();

  const [creditRequets, setCreditRequests] = useState<ICreditRequest | null>(
    null,
  );
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
  const creditRequestCode = id;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  useEffect(() => {
    const fetchCreditRequest = async () => {
      try {
        const data = await getCreditRequestByCode(
          businessUnitPublicCode,
          businessManagerCode,
          userAccount,
          { creditRequestCode },
        );
        setCreditRequests(data[0] as ICreditRequest);
      } catch (error) {
        errorObserver.notify({
          id: "Management",
          message: (error as Error).message,
        });
      }
    };
    if (id) fetchCreditRequest();
  }, [businessUnitPublicCode, id, businessManagerCode, userAccount]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setShowRetry(false);

    if (!creditRequets?.creditRequestId) return;

    try {
      const [payrollDiscountResult, promissoryNotesResult] =
        await Promise.allSettled([
          getPayrollDiscountAuthorizationsById(
            businessUnitPublicCode,
            businessManagerCode,
            creditRequets.creditRequestId,
          ),
          getPromissoryNotesById(
            businessUnitPublicCode,
            businessManagerCode,
            creditRequets.creditRequestId,
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
  }, [businessUnitPublicCode, businessManagerCode, creditRequets]);

  useEffect(() => {
    if (creditRequets?.creditRequestId) fetchData();
  }, [fetchData, creditRequets]);

  const handleRetry = () => {
    setLoading(true);
    setShowRetry(false);
    fetchData();
  };

  return (
    <Fieldset
      title={errorMessages.PromissoryNotes.titleCard}
      heightFieldset="100%"
      hasTable
      hasOverflow={isMobile}
    >
      {!creditRequets || showRetry ? (
        <UnfoundData
          image={ItemNotFound}
          title={errorMessages.PromissoryNotes.title}
          description={
            errorMessages.PromissoryNotes.description || errorMessage
          }
          buttonDescription={errorMessages.PromissoryNotes.button}
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
