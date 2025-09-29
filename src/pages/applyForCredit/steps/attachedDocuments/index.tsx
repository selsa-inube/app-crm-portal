import { Stack } from "@inubekit/inubekit";
import { useCallback, useContext, useEffect, useState } from "react";

import { Fieldset } from "@components/data/Fieldset";
import { TableAttachedDocuments } from "@pages/prospect/components/tableAttachedDocuments";
import { ICustomerData } from "@context/CustomerContext/types";
import { AppContext } from "@context/AppContext";
import { IProspect } from "@services/prospect/types";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { IFile } from "@components/modals/ListModal";
import { postDocumentsRequiredByCreditRequest } from "@services/creditRequest/getDocumentsRequiredByCreditRequest";
import {
  IPatchValidateRequirementsPayload,
  IValidateRequirement,
} from "@services/creditRequest/types";

import { ruleConfig } from "../../config/configRules";
import { evaluateRule } from "../../evaluateRule";

export interface IBorrowerDocumentRule {
  borrower: string;
  value: string;
}

interface IAttachedDocumentsProps {
  isMobile: boolean;
  initialValues: {
    [key: string]: IFile[];
  };
  handleOnChange: (files: {
    [key: string]: IFile[] | { id: string; name: string; file: File }[];
  }) => void;
  customerData: ICustomerData;
  prospectData: IProspect;
  businessUnitPublicCode: string;
}

export function AttachedDocuments(props: IAttachedDocumentsProps) {
  const {
    isMobile,
    initialValues,
    handleOnChange,
    customerData,
    prospectData,
    businessUnitPublicCode,
  } = props;

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [ruleValues, setRuleValues] = useState<IBorrowerDocumentRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [
    validDocumentsRequiredByCreditRequest,
    setValidDocumentsRequiredByCreditRequest,
  ] = useState<IValidateRequirement[]>([]);

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const fetchValidationRulesData = useCallback(async () => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    const creditProducts = prospectData?.creditProducts;
    const borrowers = prospectData?.borrowers || [];
    const businessUnitPublicCode: string =
      JSON.parse(businessUnitSigla).businessUnitPublicCode;

    if (!clientInfo?.associateType || !creditProducts?.length || !prospectData)
      return;

    const dataRulesBase = {
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };
    const borrowerDocumentRules: { borrower: string; value: string }[] = [];
    for (const borrower of borrowers) {
      for (const product of creditProducts) {
        if (!product || typeof product !== "object") continue;

        const dataRules = {
          ...dataRulesBase,
          LineOfCredit: product.lineOfCreditAbbreviatedName,
          LoanAmount: product.loanAmount,
          PrimaryIncomeType: "PeriodicSalary",
        };

        const ruleName = "DocumentaryRequirement";
        const rule = ruleConfig[ruleName]?.(dataRules);

        if (rule) {
          try {
            const values = await evaluateRule(
              rule,
              postBusinessUnitRules,
              "value",
              businessUnitPublicCode,
              businessManagerCode,
            );
            if (Array.isArray(values) && values.length > 0) {
              for (const value of values) {
                borrowerDocumentRules.push({
                  borrower: borrower.borrowerName,
                  value: String(value),
                });
              }
            }
          } catch (error) {
            console.error("Error al evaluar la regla:", error);
          }
        }
      }
    }

    setRuleValues(borrowerDocumentRules);
  }, [customerData, prospectData, businessUnitSigla]);

  useEffect(() => {
    if (customerData && prospectData) {
      fetchValidationRulesData();
    }
  }, [customerData, prospectData, fetchValidationRulesData]);

  useEffect(() => {
    if (!prospectData) return;
    const payload =
      prospectData as unknown as IPatchValidateRequirementsPayload;
    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        const data = await postDocumentsRequiredByCreditRequest(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
          eventData?.user?.identificationDocumentNumber || "",
        );
        if (data && Array.isArray(data) && data.length > 0) {
          setValidDocumentsRequiredByCreditRequest(data);
        }
      } catch (error) {
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    handleSubmit();
  }, [prospectData, businessUnitPublicCode]);

  const documentsRequiredByBorrower =
    validDocumentsRequiredByCreditRequest.length
      ? validDocumentsRequiredByCreditRequest.map((item) => ({
          borrower: item.borrowerName,
          value: Array.isArray(item.documentalRequirement)
            ? item.documentalRequirement.join(", ")
            : "",
        }))
      : ruleValues;

  return (
    <Fieldset>
      <Stack padding="16px">
        <TableAttachedDocuments
          isMobile={isMobile}
          uploadedFilesByRow={initialValues}
          setUploadedFilesByRow={handleOnChange}
          customerData={customerData}
          ruleValues={documentsRequiredByBorrower}
          isLoading={isLoading}
          showErrorModal={showErrorModal}
        />
      </Stack>
    </Fieldset>
  );
}
