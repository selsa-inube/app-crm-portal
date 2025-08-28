import { useState, useEffect } from "react";
import { useMediaQuery } from "@inubekit/inubekit";
import { FormikValues, useFormik } from "formik";

import { currencyFormat } from "@utils/formatData/currency";
import { IObligations } from "@services/creditRequest/types";

import { convertObligationsToProperties, headers } from "./config";
import {
  ITableFinancialObligationsProps,
  TableFinancialObligationsUI,
} from "./interface";
import { IProperty } from "./types";

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
  } = props;
  const [loading] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedDebtor, setSelectedDebtor] =
    useState<ITableFinancialObligationsProps | null>(null);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);
  const [selectedBorrowerIndex, setSelectedBorrowerIndex] = useState<number>(0);

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

  const handleDelete = async () => {};

  const handleUpdate = async () => {};

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
      initialValues={initialValues as IObligations}
      handleOnChange={handleOnChange}
      setRefreshKey={setRefreshKey}
      setSelectedDebtor={setSelectedDebtor}
      selectedBorrowerIndex={selectedBorrowerIndex}
      setSelectedBorrowerIndex={setSelectedBorrowerIndex}
    />
  );
};
