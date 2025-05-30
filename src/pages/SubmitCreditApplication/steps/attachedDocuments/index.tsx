import { Stack } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { TableAttachedDocuments } from "@pages/prospect/components/tableAttachedDocuments";
import { ICustomerData } from "@context/CustomerContext/types";
import { useCallback, useContext, useEffect } from "react";
import { getMonthsElapsed } from "@src/utils/formatData/currency";
import { ruleConfig } from "../../config/configRules";
import { evaluateRule } from "../../evaluateRule";
import { postBusinessUnitRules } from "@src/services/businessUnitRules";
import { AppContext } from "@src/context/AppContext";
import { IProspect } from "@src/services/prospects/types";

interface IAttachedDocumentsProps {
  isMobile: boolean;
  initialValues: {
    [key: string]: { id: string; name: string; file: File }[];
  };
  handleOnChange: (files: {
    [key: string]: { id: string; name: string; file: File }[];
  }) => void;
  customerData: ICustomerData;
  prospectData: IProspect;
}

export function AttachedDocuments(props: IAttachedDocumentsProps) {
  const {
    isMobile,
    initialValues,
    handleOnChange,
    customerData,
    prospectData,
  } = props;

  const { businessUnitSigla } = useContext(AppContext);

  const fetchValidationRulesData = useCallback(async () => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    const creditProducts = prospectData?.creditProducts;

    const businessUnitPublicCode: string =
      JSON.parse(businessUnitSigla).businessUnitPublicCode;

    if (!clientInfo.associateType || !creditProducts?.length || !prospectData)
      return;

    const dataRulesBase = {
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      PrimaryIncomeType: "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };

    for (const product of creditProducts) {
      if (!product || typeof product !== "object") continue;

      const dataRules = {
        ...dataRulesBase,
        LineOfCredit: product.lineOfCreditAbbreviatedName,
        LoanAmount: prospectData.requestedAmount,
      };

      const ruleName = "DocumentaryRequirement";
      const rule = ruleConfig[ruleName]?.(dataRules);

      if (rule) {
        try {
          console.log(rule, "rule2");
          const values = await evaluateRule(
            rule,
            postBusinessUnitRules,
            "value",
            businessUnitPublicCode,
          );
          console.log(values, "values2");
        } catch (error) {
          console.error("Error al evaluar la regla:", error);
        }
      }
    }
  }, [customerData, prospectData, postBusinessUnitRules, businessUnitSigla]);

  useEffect(() => {
    if (customerData && prospectData) {
      fetchValidationRulesData();
    }
  }, [customerData, prospectData, fetchValidationRulesData]);

  return (
    <Fieldset>
      <Stack padding="16px">
        <TableAttachedDocuments
          isMobile={isMobile}
          uploadedFilesByRow={initialValues}
          setUploadedFilesByRow={handleOnChange}
          customerData={customerData}
        />
      </Stack>
    </Fieldset>
  );
}
