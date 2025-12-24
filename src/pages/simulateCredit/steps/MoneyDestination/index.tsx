import { useContext, useEffect, useState, useMemo } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

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
  handleOnChange: React.Dispatch<React.SetStateAction<string>>;
  onFormValid: React.Dispatch<React.SetStateAction<boolean>>;
}

function MoneyDestination(props: IMoneyDestinationProps) {
  const {
    initialValues,
    isTablet,
    businessManagerCode,
    clientIdentificationNumber,
    handleOnChange,
    onFormValid,
  } = props;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [moneyDestinations, setMoneyDestinations] =
    useState<IMoneyDestination[]>();
  const [loading, setLoading] = useState(true);

  const loadMoneyDestinations = () => {
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
  };

  useEffect(() => {
    loadMoneyDestinations();
  }, [businessUnitPublicCode]);

  const filteredDestinations = useMemo(() => {
    if (!moneyDestinations) return undefined;

    if (!searchTerm.trim()) {
      return moneyDestinations;
    }

    const searchLower = searchTerm.toLowerCase();

    return moneyDestinations.filter((destination) => {
      const nameMatch = destination.abbreviatedName
        .toLowerCase()
        .includes(searchLower);
      const descriptionMatch = destination.descriptionUse
        ?.toLowerCase()
        .includes(searchLower);
      const typeMatch = destination.moneyDestinationType
        ?.toLowerCase()
        .includes(searchLower);

      return nameMatch || descriptionMatch || typeMatch;
    });
  }, [moneyDestinations, searchTerm]);

  useEffect(() => {
    onFormValid(Boolean(initialValues));
  }, [initialValues, onFormValid]);

  const MoneyDestinationSchema = Yup.object().shape({
    selectedDestination: Yup.string().required(""),
  });

  const groupedDestinations: { [type: string]: IMoneyDestination[] } = {};

  if (filteredDestinations) {
    filteredDestinations.forEach((destination) => {
      const type =
        destination.moneyDestinationType || dataMoneyDestination.noType;
      if (!groupedDestinations[type]) {
        groupedDestinations[type] = [];
      }
      groupedDestinations[type].push(destination);
    });
  }

  const hasActiveSearch = searchTerm.trim().length > 0;

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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
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
          hasActiveSearch={hasActiveSearch}
        />
      )}
    </Formik>
  );
}

export { MoneyDestination };
