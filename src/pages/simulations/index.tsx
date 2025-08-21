import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { getSearchProspectByCode } from "@services/prospect/SearchAllProspects";
import {
  IProspect,
  IExtraordinaryInstallments,
} from "@services/prospect/types";
import { AppContext } from "@context/AppContext";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { getCreditRequestByCode } from "@services/creditRequest/getCreditRequestByCode";
import { ICreditRequest, IPaymentChannel } from "@services/creditRequest/types";
import { generatePDF } from "@utils/pdf/generetePDF";

import { ruleConfig } from "../applyForCredit/config/configRules";
import { evaluateRule } from "../applyForCredit/evaluateRule";
import { SimulationsUI } from "./interface";
import { ICondition, Irule } from "../simulateCredit/types";

export function Simulations() {
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [dataProspect, setDataProspect] = useState<IProspect>();

  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreditRequest, setShowCreditRequest] = useState(false);
  const [pdfProspect, setPdfProspect] = useState<string | null>(null);

  const isMobile = useMediaQuery("(max-width:880px)");
  const { prospectCode } = useParams();

  const dataCreditRef = useRef<ICreditRequest>();
  const valueRuleRef = useRef<{ [ruleName: string]: string[] }>({});
  const dataPrint = useRef<HTMLDivElement>(null);

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const data = dataProspect;
  const [sentData, setSentData] = useState<IExtraordinaryInstallments | null>(
    null,
  );
  const { customerData } = useContext(CustomerContext);
  const navigate = useNavigate();

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();
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

    navigate(`/credit/apply-for-credit/${prospectCode}`);
  };

  const cleanConditions = (
    rule: Irule | null | undefined,
  ): Irule | null | undefined => {
    if (!rule) return rule;

    const cleaned = { ...rule };

    if (Array.isArray(cleaned.conditions)) {
      const hasValidCondition = cleaned.conditions.some(
        (c: ICondition) =>
          c.value !== undefined && c.value !== null && c.value !== "",
      );
      if (!hasValidCondition) {
        Reflect.deleteProperty(cleaned, "conditions");
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
  }, [businessUnitPublicCode, sentData]);

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
    const rulesToCheck = ["ValidationGuarantee", "ValidationCoBorrower"];
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
        } catch (error) {
          const errorResponse = error as { response?: { status: number } };
          if (errorResponse.response?.status === 400) {
            notDefinedRules.push(ruleName);
          }
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

    const rulesValidate = ["ValidationGuarantee", "ValidationCoBorrower"];

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
                  .map((v) =>
                    typeof v === "string" ? v : (v?.valuesAvailable ?? ""),
                  )
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
          } catch (error) {
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
    <SimulationsUI
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
      setRequestValue={setRequestValue}
      setProspectData={setDataProspect}
      requestValue={requestValue}
      sentData={sentData}
      setSentData={setSentData}
      businessUnitPublicCode={businessUnitPublicCode}
    />
  );
}
