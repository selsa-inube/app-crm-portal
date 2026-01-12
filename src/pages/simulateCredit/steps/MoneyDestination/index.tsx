import { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { EnumType } from "@hooks/useEnum/useEnum";
import { searchAllMoneyDestinationByCustomerCode } from "@services/moneyDestination/searchAllMoneyDestinationByCostumerCode";
import { IMoneyDestination } from "@services/moneyDestination/searchAllMoneyDestinationByCostumerCode/types";
import { AppContext } from "@context/AppContext";

import { MoneyDestinationUI } from "./interface";
import { dataMoneyDestination } from "./config";

interface IMoneyDestinationProps {
  initialValues: string;
  isTablet: boolean;
  businessManagerCode: string;
  clientIdentificationNumber: string;
  lang: EnumType;
  handleOnChange: React.Dispatch<React.SetStateAction<string>>;
  onFormValid: React.Dispatch<React.SetStateAction<boolean>>;
}

function MoneyDestination(props: IMoneyDestinationProps) {
  const {
    initialValues,
    isTablet,
    businessManagerCode,
    clientIdentificationNumber,
    lang,
    handleOnChange,
    onFormValid,
  } = props;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const { businessUnitSigla } = useContext(AppContext);
  const navigate = useNavigate();

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [moneyDestinations, setMoneyDestinations] =
    useState<IMoneyDestination[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    searchAllMoneyDestinationByCustomerCode(
      businessUnitPublicCode,
      businessManagerCode,
      clientIdentificationNumber,
    )
      .then((response) => {
        if (response && Array.isArray(response)) {
          const filteredDestinations = response.filter((destination) =>
            destination.linesOfCredit.some(
              (lineOfCredit: {
                creditPlacementChannels: string[];
                lineOfCreditAbbreviatedName: string;
              }) => lineOfCredit.creditPlacementChannels.includes("CRM"),
            ),
          );

          setMoneyDestinations(filteredDestinations);
        } else if (response === null) {
          setMoneyDestinations([]);
        }
      })
      .catch((error) => {
        setShowErrorModal(true);
        setMessageError(
          `Error fetching money destinations data:, ${error.message}`,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [businessUnitPublicCode]);

  useEffect(() => {
    onFormValid(Boolean(initialValues));
  }, [initialValues, onFormValid]);

  const MoneyDestinationSchema = Yup.object().shape({
    selectedDestination: Yup.string().required(""),
  });

  const groupedDestinations: { [type: string]: IMoneyDestination[] } = {};

  if (moneyDestinations) {
    moneyDestinations.forEach((destination) => {
      const type =
        destination.moneyDestinationType ||
        dataMoneyDestination.noType.i18n[lang];
      if (!groupedDestinations[type]) {
        groupedDestinations[type] = [];
      }
      groupedDestinations[type].push(destination);
    });
  }

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
          isTablet={isTablet}
          selectedDestination={values.selectedDestination}
          handleChange={(value: string) => {
            setFieldValue("selectedDestination", value);
            handleOnChange(value);
            onFormValid(Boolean(value));
          }}
          setShowErrorModal={setShowErrorModal}
          showErrorModal={showErrorModal}
          messageError={messageError}
          groupedDestinations={groupedDestinations}
          loading={loading}
          navigate={navigate}
        />
      )}
    </Formik>
  );
}

export { MoneyDestination };
