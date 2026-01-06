import { useFormik } from "formik";
import { useEffect, useContext, useCallback } from "react";
import { Stack } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { AppContext } from "@context/AppContext";
import { ICustomerData } from "@context/CustomerContext/types";
import { IProspect } from "@services/prospect/types";

import { DisbursementWithInternalAccount } from "./disbursementWithInternalAccount/index";
import { IDisbursementGeneral } from "../../types";

interface IDisbursementGeneralProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  data: IProspect;

  identificationNumber: string;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IDisbursementGeneral) => void;

  customerData?: ICustomerData;

  modesOfDisbursement: string[];
}

export function DisbursementGeneral(props: IDisbursementGeneralProps) {
  const {
    isMobile,
    initialValues,

    identificationNumber,
    onFormValid,
    handleOnChange,
    modesOfDisbursement,
    customerData,
  } = props;

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    onSubmit: () => {},
  });

  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  useEffect(() => {
    handleOnChange(formik.values);
  }, [formik.values, handleOnChange]);

  const getTotalAmount = useCallback(() => {
    return modesOfDisbursement.reduce((total, modeKey) => {
      const disbursementData =
        formik.values[modeKey as keyof IDisbursementGeneral];
      const amount =
        disbursementData &&
        typeof disbursementData === "object" &&
        "amount" in disbursementData
          ? disbursementData.amount || 0
          : 0;
      return total + Number(amount);
    }, 0);
  }, [formik.values, modesOfDisbursement]);

  return (
    <Fieldset>
      <Stack
        direction="column"
        padding={isMobile ? "4px 10px" : "10px 16px"}
        gap="20px"
      >
        <Stack direction="column">
          <DisbursementWithInternalAccount
            isMobile={isMobile}
            onFormValid={onFormValid}
            initialValues={initialValues}
            handleOnChange={handleOnChange}
            formik={formik}
            optionNameForm="Internal_account"
            getTotalAmount={getTotalAmount}
            businessUnitPublicCode={businessUnitPublicCode}
            identificationNumber={identificationNumber}
            customerData={customerData}
            businessManagerCode={businessManagerCode}
          />
        </Stack>
      </Stack>
    </Fieldset>
  );
}
