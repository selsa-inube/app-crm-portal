import { useEffect, useState } from "react";
import * as Yup from "yup";

import { useMediaQuery } from "@inubekit/inubekit";

import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { ILinesOfCreditByMoneyDestination } from "@services/lineOfCredit/types";

import { IAddProductModalProps, TCreditLineTerms } from "./config";
import { AddProductModalUI } from "./interface";

function AddProductModal(props: IAddProductModalProps) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconBefore,
    iconAfter,
    moneyDestination,
    businessUnitPublicCode,
    customerData,
    businessManagerCode,
  } = props;

  const [creditLineTerms, setCreditLineTerms] = useState<TCreditLineTerms>({});

  useEffect(() => {
    (async () => {
      const clientInfo =
        customerData?.generalAttributeClientNaturalPersons?.[0];
      if (!clientInfo?.associateType) return;

      const lineOfCreditValues = await getLinesOfCreditByMoneyDestination(
        businessUnitPublicCode,
        businessManagerCode,
        moneyDestination,
        customerData!.publicCode,
      );

      const linesArray = Array.isArray(lineOfCreditValues)
        ? lineOfCreditValues
        : [lineOfCreditValues];

      const result: TCreditLineTerms = {};

      linesArray.forEach((line: ILinesOfCreditByMoneyDestination) => {
        if (line && line.abbreviateName) {
          result[line.abbreviateName] = {
            LoanAmountLimit: line.maxAmount,
            LoanTermLimit: line.maxTerm,
            RiskFreeInterestRate: line.maxEffectiveInterestRate,
            amortizationType: line.amortizationType,
            description: line.description,
          };
        }
      });

      setCreditLineTerms(result);
    })();
  }, [businessUnitPublicCode]);

  const isMobile = useMediaQuery("(max-width: 550px)");

  const validationSchema = Yup.object({
    creditLine: Yup.string(),
    creditAmount: Yup.number(),
    paymentMethod: Yup.string(),
    paymentCycle: Yup.string(),
    firstPaymentCycle: Yup.string(),
    termInMonths: Yup.number(),
    amortizationType: Yup.string(),
    interestRate: Yup.number().min(0, ""),
    rateType: Yup.string(),
    selectedProducts: Yup.array()
      .of(Yup.string().required())
      .default([])
      .required(),
  });

  return (
    <AddProductModalUI
      title={title}
      confirmButtonText={confirmButtonText}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onConfirm={onConfirm}
      onCloseModal={onCloseModal}
      iconBefore={iconBefore}
      iconAfter={iconAfter}
      creditLineTerms={creditLineTerms}
      isMobile={isMobile}
    />
  );
}

export { AddProductModal };
