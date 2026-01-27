import { useContext, useEffect, useState, useMemo } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { EnumType } from "@hooks/useEnum/useEnum";
import { searchAllMoneyDestinationByCustomerCode } from "@services/moneyDestination/searchAllMoneyDestinationByCostumerCode";
import { IMoneyDestination } from "@services/moneyDestination/searchAllMoneyDestinationByCostumerCode/types";
import { AppContext } from "@context/AppContext";
import { IAllEnumsResponse } from "@services/enumerators/types";
import { CustomerContext } from "@context/CustomerContext";

import { MoneyDestinationUI } from "./interface";
import { dataMoneyDestination } from "./config";

interface IMoneyDestinationProps {
  initialValues: string;
  isTablet: boolean;
  businessManagerCode: string;
  clientIdentificationNumber: string;
  lang: EnumType;
  enums: IAllEnumsResponse;
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
    enums,
    handleOnChange,
    onFormValid,
  } = props;
  const { customerData } = useContext(CustomerContext);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { businessUnitSigla } = useContext(AppContext);
  const navigate = useNavigate();

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
      customerData.token,
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

    const cleanedSearchTerm = searchTerm.trim();

    if (!cleanedSearchTerm) {
      return moneyDestinations;
    }

    const searchTermLowerCase = cleanedSearchTerm.toLowerCase();
    const searchWordsArray = searchTermLowerCase
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const filteredMoneyDestinations = moneyDestinations.filter(
      (destination) => {
        const destinationNameLowerCase =
          destination.abbreviatedName.toLowerCase();
        const destinationNameWordsArray = destinationNameLowerCase.split(/\s+/);
        const allSearchWordsMatch = searchWordsArray.every((searchWord) => {
          const foundMatchingWord = destinationNameWordsArray.some(
            (destinationWord) => destinationWord.startsWith(searchWord),
          );
          return foundMatchingWord;
        });

        return allSearchWordsMatch;
      },
    );

    const sortedDestinations = filteredMoneyDestinations.sort(
      (currentDestination, nextDestination) => {
        const currentName = currentDestination.abbreviatedName.toLowerCase();
        const nextName = nextDestination.abbreviatedName.toLowerCase();
        const currentStartsWithSearch =
          currentName.startsWith(searchTermLowerCase);
        const nextStartsWithSearch = nextName.startsWith(searchTermLowerCase);

        if (currentStartsWithSearch && !nextStartsWithSearch) return -1;
        if (!currentStartsWithSearch && nextStartsWithSearch) return 1;

        const currentContainsExactSearch =
          currentName.includes(searchTermLowerCase);
        const nextContainsExactSearch = nextName.includes(searchTermLowerCase);

        if (currentContainsExactSearch && !nextContainsExactSearch) return -1;
        if (!currentContainsExactSearch && nextContainsExactSearch) return 1;

        return currentName.localeCompare(nextName);
      },
    );

    return sortedDestinations;
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
      const typeCode = destination.moneyDestinationType;

      const enumInfo = enums?.["MoneyDestinationType"]?.find(
        (item) => item.code === typeCode,
      );

      const typeLabel = enumInfo
        ? enumInfo.i18n[lang]
        : typeCode || dataMoneyDestination.noType.i18n[lang];

      if (!groupedDestinations[typeLabel]) {
        groupedDestinations[typeLabel] = [];
      }
      groupedDestinations[typeLabel].push(destination);
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
          navigate={navigate}
          lang={lang}
        />
      )}
    </Formik>
  );
}

export { MoneyDestination };
