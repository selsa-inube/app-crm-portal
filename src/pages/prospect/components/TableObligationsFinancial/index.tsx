import { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "@inubekit/inubekit";
import { FormikValues, useFormik } from "formik";

import { AppContext } from "@context/AppContext";
import { currencyFormat } from "@utils/formatData/currency";
import { updateProspect } from "@services/prospect/updateProspect";

import { convertObligationsToProperties, headers } from "./config";
import {
  ITableFinancialObligationsProps,
  TableFinancialObligationsUI,
} from "./interface";
import { IProperty, IObligations } from "./types";

export const TableFinancialObligations = (
  props: ITableFinancialObligationsProps,
) => {
  const {
    refreshKey,
    initialValues,
    handleOnChange = () => {},
    setRefreshKey,
    showActions,
    showButtons,
    formState,
    services = true,
  } = props;
  const [loading] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedDebtor, setSelectedDebtor] =
    useState<ITableFinancialObligationsProps | null>(null);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);
  const [selectedBorrowerIndex, setSelectedBorrowerIndex] = useState<number>(0);

  const { businessUnitSigla } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const formik = useFormik({
    initialValues: initialValues as IObligations,
    onSubmit: () => {},
  });

  useEffect(() => {
    handleOnChange(formik.values);
  }, []);

  const handleEdit = (debtor: ITableFinancialObligationsProps) => {
    let balance = "";
    let fee = "";

    if (typeof debtor.propertyValue === "string") {
      const values = debtor.propertyValue.split(",");
      balance = currencyFormat(Number(values[1]?.trim() || 0), false);
      fee = currencyFormat(Number(values[2]?.trim() || 0), false);
    }

    setSelectedDebtor({
      ...debtor,
      balance,
      fee,
    });
    setIsModalOpenEdit(true);
  };

  const isMobile = useMediaQuery("(max-width:880px)");

  const visibleHeaders = isMobile
    ? headers.filter(
        (header) =>
          ["type", "balance", "actions"].includes(header.key) &&
          (showActions || header.key !== "actions"),
      )
    : headers.filter((header) => showActions || header.key !== "actions");

  useEffect(() => {
    const data = Array.isArray(initialValues) ? initialValues : [initialValues];
    if (data && data.length > 0) {
      const borrowerList = Array.isArray(data[0]?.borrowers)
        ? data[0]?.borrowers
        : data;

      const financialObligationsFromProps =
        borrowerList?.[0]?.borrowerProperties?.filter(
          (prop: IProperty) => prop.propertyName === "FinancialObligation",
        ) || [];

      const getObligationsFromInitialValues = (
        initial: FormikValues | undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ): any[] => {
        if (!initial) return [];

        if (Array.isArray(initial)) {
          return initial;
        }

        const maybeObligations = initial?.obligations?.obligations;

        return Array.isArray(maybeObligations) ? maybeObligations : [];
      };

      const obligations = getObligationsFromInitialValues(initialValues);

      const obligationsConverted = Array.isArray(obligations)
        ? convertObligationsToProperties(obligations)
        : [];

      setExtraDebtors([
        ...financialObligationsFromProps,
        ...obligationsConverted,
      ]);
    } else {
      if (initialValues) {
        initialValues.obligations = {
          obligations: [],
        };
      }
      setExtraDebtors([]);
    }
  }, [refreshKey, initialValues]);

  const handleDelete = async (id: string) => {
    if (services) {
      const borrowers = initialValues?.[0]?.borrowers || [];
      const selectedBorrower = borrowers[selectedBorrowerIndex];

      const updatedProperties = selectedBorrower.borrowerProperties.filter(
        (prop: IProperty) =>
          !(
            prop.propertyName === "FinancialObligation" &&
            prop.propertyValue === id
          ),
      );

      const updatedBorrower = {
        ...selectedBorrower,
        borrowerProperties: updatedProperties,
      };

      const updatedBorrowers = [...borrowers];
      updatedBorrowers[selectedBorrowerIndex] = updatedBorrower;

      const updatedInitialValues = {
        ...initialValues?.[0],
        borrowers: updatedBorrowers,
      };

      try {
        await updateProspect(businessUnitPublicCode, updatedInitialValues);
      } catch (error) {
        console.log(error);
      }

      setRefreshKey?.((prev) => prev + 1);
    } else {
      try {
        const obligationNumberFromRow =
          typeof id === "string" ? id.split(",")[5]?.trim() : undefined;

        if (!obligationNumberFromRow) return;

        const currentObligations = Array.isArray(initialValues)
          ? [...initialValues]
          : initialValues
            ? [initialValues]
            : [];

        const updatedInitialValues = currentObligations.filter(
          (obligation: IObligations) =>
            String(obligation.obligationNumber) !== obligationNumberFromRow,
        );

        handleOnChange(updatedInitialValues);
        setRefreshKey?.((prev) => prev + 1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdate = async (
    updatedDebtor: ITableFinancialObligationsProps,
  ) => {
    if (services) {
      try {
        const borrowers = initialValues?.[0]?.borrowers || [];
        const selectedBorrower = borrowers[selectedBorrowerIndex];

        const obligationIndex = selectedBorrower.borrowerProperties.findIndex(
          (prop: IProperty) =>
            prop.propertyName === "FinancialObligation" &&
            prop.propertyValue === selectedDebtor?.propertyValue,
        );

        if (obligationIndex === -1) return;

        const originalValues = selectedDebtor?.propertyValue
          ? selectedDebtor.propertyValue.split(",").map((v: string) => v.trim())
          : [];

        originalValues[1] = updatedDebtor.balance || originalValues[1];
        originalValues[2] = updatedDebtor.fee || originalValues[2];

        const newPropertyValue = originalValues.join(", ");

        const updatedProperties = [...selectedBorrower.borrowerProperties];
        updatedProperties[obligationIndex] = {
          ...updatedProperties[obligationIndex],
          propertyValue: newPropertyValue,
        };

        const updatedBorrower = {
          ...selectedBorrower,
          borrowerProperties: updatedProperties,
        };

        const updatedBorrowers = [...borrowers];
        updatedBorrowers[selectedBorrowerIndex] = updatedBorrower;

        const updatedInitialValues = {
          ...initialValues?.[0],
          borrowers: updatedBorrowers,
        };

        await updateProspect(businessUnitPublicCode, updatedInitialValues);
        setRefreshKey?.((prev) => prev + 1);
        setIsModalOpenEdit(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const currentObligations = Array.isArray(initialValues)
          ? [...initialValues]
          : initialValues
            ? [initialValues]
            : [];

        const obligationIndex = currentObligations.findIndex(
          (obligation: IObligations) =>
            obligation.obligationNumber ===
            updatedDebtor.propertyValue?.split(",")[5].trim(),
        );

        if (obligationIndex === -1) return;

        const updatedObligation = {
          ...currentObligations[obligationIndex],
          balanceObligationTotal:
            updatedDebtor.balance ||
            currentObligations[obligationIndex].balanceObligationTotal,
          nextPaymentValueTotal:
            updatedDebtor.fee ||
            currentObligations[obligationIndex].nextPaymentValueTotal,
        };

        const updatedInitialValues = [...currentObligations];
        updatedInitialValues[obligationIndex] = updatedObligation;

        handleOnChange(updatedInitialValues);
        setRefreshKey?.((prev) => prev + 1);
        setIsModalOpenEdit(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (
      Array.isArray(initialValues?.[0]?.borrowers) &&
      initialValues[0].borrowers.length > 0
    ) {
      setSelectedBorrowerIndex(0);
    }
  }, [initialValues]);

  const dataInformation =
    (initialValues?.[0]?.borrowers?.[
      selectedBorrowerIndex
    ]?.borrowerProperties?.filter(
      (prop: IProperty) => prop.propertyName === "FinancialObligation",
    ) ??
      extraDebtors) ||
    [];

  return (
    <TableFinancialObligationsUI
      dataInformation={dataInformation}
      extraDebtors={extraDebtors}
      loading={loading}
      visibleHeaders={visibleHeaders}
      isMobile={isMobile}
      selectedDebtor={selectedDebtor}
      isModalOpenEdit={isModalOpenEdit}
      setIsModalOpenEdit={setIsModalOpenEdit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      showButtons={showButtons}
      formState={formState}
      services={services}
      initialValues={initialValues as IObligations}
      handleOnChange={handleOnChange}
      setRefreshKey={setRefreshKey}
      setSelectedDebtor={setSelectedDebtor}
      selectedBorrowerIndex={selectedBorrowerIndex}
      businessUnitPublicCode={businessUnitPublicCode}
      setSelectedBorrowerIndex={setSelectedBorrowerIndex}
    />
  );
};
