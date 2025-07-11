import { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { getMoneyDestinations } from "@services/moneyDestination";
import { IMoneyDestination } from "@services/moneyDestination/types";
import { AppContext } from "@context/AppContext";

import { MoneyDestinationUI } from "./interface";

interface IMoneyDestinationProps {
  initialValues: string;
  isTablet: boolean;
  handleOnChange: React.Dispatch<React.SetStateAction<string>>;
  onFormValid: React.Dispatch<React.SetStateAction<boolean>>;
}

function MoneyDestination(props: IMoneyDestinationProps) {
  const { initialValues, isTablet, handleOnChange, onFormValid } = props;

  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [moneyDestinations, setMoneyDestinations] =
    useState<IMoneyDestination[]>();

  useEffect(() => {
    getMoneyDestinations(businessUnitPublicCode)
      .then((data) => {
        if (data && Array.isArray(data)) {
          setMoneyDestinations(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching money destinations data:", error.message);
      });
  }, [businessUnitPublicCode]);

  useEffect(() => {
    onFormValid(Boolean(initialValues));
  }, [initialValues, onFormValid]);

  const MoneyDestinationSchema = Yup.object().shape({
    selectedDestination: Yup.string().required(""),
  });

  return (
    <Formik
      initialValues={{ selectedDestination: initialValues }}
      validationSchema={MoneyDestinationSchema}
      onSubmit={(values) => {
        handleOnChange(values.selectedDestination);
        onFormValid(true);
      }}
    >
      {({ values, setFieldValue }) => (
        <MoneyDestinationUI
          destinations={moneyDestinations}
          isTablet={isTablet}
          selectedDestination={values.selectedDestination}
          handleChange={(value: string) => {
            setFieldValue("selectedDestination", value);
            handleOnChange(value);
            onFormValid(Boolean(value));
          }}
        />
      )}
    </Formik>
  );
}

export { MoneyDestination };
