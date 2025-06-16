import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { mockEditProspect } from "@mocks/add-prospect/edit-prospect/editprospect.mock";
import { CustomerContext } from "@context/CustomerContext";
import { getSearchProspectByCode } from "@services/prospects/AllProspects";
import { IProspect } from "@services/prospects/types";
import { AppContext } from "@context/AppContext";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { getCreditRequestByCode } from "@services/creditRequest/getCreditRequestByCode";
import { ICreditRequest } from "@services/types";
import { generatePDF } from "@utils/pdf/generetePDF";

import { ruleConfig } from "../SubmitCreditApplication/config/configRules";
import { evaluateRule } from "../SubmitCreditApplication/evaluateRule";
import { EditProspectUI } from "./interface";

export function EditProspect() {
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [dataProspect, setDataProspect] = useState<IProspect>();

  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreditRequest, setShowCreditRequest] = useState(false);
  const [pdfProspect, setPdfProspect] = useState<string | null>(null);

  const isMobile = useMediaQuery("(max-width:880px)");
  const { customerPublicCode, prospectCode } = useParams();

  const dataCreditRef = useRef<ICreditRequest>();
  const valueRuleRef = useRef<{ [ruleName: string]: string[] }>({});
  const dataPrint = useRef<HTMLDivElement>(null);

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const data = mockEditProspect[0];

  const { customerData } = useContext(CustomerContext);
  const navigate = useNavigate();

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const hasPermitSubmit = !!eventData.user.staff.useCases.canSubmitProspect;

  const fetchValidateCreditRequest = useCallback(async () => {
    try {
      const result = await getCreditRequestByCode(
        businessUnitPublicCode,
        prospectCode!,
      );

      const creditData = Array.isArray(result) ? result[0] : result;

      dataCreditRef.current = creditData;
      return creditData;
    } catch (error) {
      console.error("Error al obtener las solicitudes de crédito:", error);
      return null;
    }
  }, [businessUnitPublicCode, prospectCode]);

  const handleSubmitClick = async () => {
    const result = await fetchValidateCreditRequest();

    if (result) {
      setShowCreditRequest(true);
      return;
    }

    navigate(`/credit/apply-for-credit/${customerPublicCode}/${prospectCode}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanConditions = (rule: any) => {
    if (!rule) return rule;

    const cleaned = { ...rule };

    if (Array.isArray(cleaned.conditions)) {
      const hasValidCondition = cleaned.conditions.some(
        (c: { value: unknown }) =>
          c.value !== undefined && c.value !== null && c.value !== "",
      );
      if (!hasValidCondition) {
        delete cleaned.conditions;
      }
    }
    return cleaned;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchProspectByCode(
          businessUnitPublicCode,
          prospectCode!,
        );
        setDataProspect(Array.isArray(result) ? result[0] : result);
      } catch (error) {
        console.error("Error al obtener el prospecto:", error);
      }
    };

    fetchData();
  }, [businessUnitPublicCode]);

  useEffect(() => {
    const fetchPDF = async () => {
      const pdfData = await generatePDF(dataPrint, "");
      if (pdfData) {
        setPdfProspect(pdfData);
      }
    };
    fetchPDF();
  }, []);

  const fetchValidationRules = useCallback(async () => {
    const rulesToCheck = [
      "ModeOfDisbursementType",
      "ValidationGuarantee",
      "ValidationCoBorrower",
    ];
    const notDefinedRules: string[] = [];
    await Promise.all(
      rulesToCheck.map(async (ruleName) => {
        try {
          const rule = cleanConditions(ruleConfig[ruleName]?.({}));
          if (!rule) return notDefinedRules.push(ruleName);
          await evaluateRule(
            rule,
            postBusinessUnitRules,
            "value",
            businessUnitPublicCode,
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error?.response?.status === 400) notDefinedRules.push(ruleName);
        }
      }),
    );

    if (notDefinedRules.length >= 1) {
      setCodeError(1013);
      setAddToFix(notDefinedRules);
    }
  }, [businessUnitPublicCode]);

  const fetchValidationRulesData = useCallback(async () => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    const creditProducts = dataProspect?.creditProducts;

    if (!clientInfo.associateType || !creditProducts?.length || !dataProspect)
      return;

    const dataRulesBase = {
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      LoanAmount: dataProspect.requestedAmount,
      PrimaryIncomeType: "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };

    const rulesValidate = [
      "ModeOfDisbursementType",
      "ValidationGuarantee",
      "ValidationCoBorrower",
    ];

    for (const product of creditProducts) {
      if (!product || typeof product !== "object") continue;

      const dataRules = {
        ...dataRulesBase,
        LineOfCredit: product.lineOfCreditAbbreviatedName,
      };
      await Promise.all(
        rulesValidate.map(async (ruleName) => {
          const rule = ruleConfig[ruleName]?.(dataRules);
          if (!rule) return;

          try {
            const values = await evaluateRule(
              rule,
              postBusinessUnitRules,
              "value",
              businessUnitPublicCode,
            );

            const extractedValues = Array.isArray(values)
              ? values
                  .map((v) => (typeof v === "string" ? v : (v?.value ?? "")))
                  .filter((val): val is string => val !== "")
              : [];

            if (
              ruleName === "ModeOfDisbursementType" &&
              extractedValues.length === 0
            ) {
              setCodeError(1014);
              setAddToFix([ruleName]);
              return;
            }

            valueRuleRef.current = {
              ...valueRuleRef.current,
              [ruleName]: extractedValues,
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            console.error(
              `Error evaluando ${ruleName} para producto`,
              product,
              error,
            );
          }
        }),
      );
    }
  }, [customerData, dataProspect, businessUnitPublicCode]);

  useEffect(() => {
    if (customerData && dataProspect) {
      fetchValidationRules();
      fetchValidationRulesData();
    }
  }, [customerData, dataProspect, fetchValidationRulesData]);

  const handleInfo = () => {
    setIsModalOpen(true);
  };

  return (
    <EditProspectUI
      dataHeader={dataHeader}
      isMobile={isMobile}
      prospectCode={prospectCode || ""}
      data={data}
      dataProspect={dataProspect}
      showMenu={showMenu}
      showShareModal={showShareModal}
      codeError={codeError}
      addToFix={addToFix}
      hasPermitSubmit={hasPermitSubmit}
      isModalOpen={isModalOpen}
      showCreditRequest={showCreditRequest}
      dataPrint={dataPrint}
      pdfProspect={pdfProspect}
      setShowShareModal={setShowShareModal}
      setShowMenu={setShowMenu}
      handleSubmitClick={handleSubmitClick}
      handleInfo={handleInfo}
      setIsModalOpen={setIsModalOpen}
      setShowCreditRequest={setShowCreditRequest}
    />
  );
}
