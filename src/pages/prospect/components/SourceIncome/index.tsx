import { useEffect, useState, useCallback } from "react";
import { MdCached, MdOutlineEdit } from "react-icons/md";
import { Stack, Text, Grid, useMediaQuery, Button } from "@inubekit/inubekit";

import { incomeCardData } from "@components/cards/IncomeCard/config";
import { CardGray } from "@components/cards/CardGray";
import { IncomeModal } from "@pages/prospect/components/modals/IncomeModal";
import {
  currencyFormat,
  parseCurrencyString,
} from "@utils/formatData/currency";
import { IIncomeSources } from "@services/creditLimit/types";
import { BaseModal } from "@components/modals/baseModal";
import { ICustomerData } from "@context/CustomerContext/types";
import { IncomeTypes } from "@services/enum/icorebanking-vi-crediboard/eincometype";
import { restoreIncomeInformationByBorrowerId } from "@services/prospect/restoreIncomeInformationByBorrowerId";
import { ErrorModal } from "@components/modals/ErrorModal";

import {
  IncomeEmployment,
  IncomeCapital,
  MicroBusinesses,
  getInitialValues,
} from "./config";
import { StyledContainer } from "./styles";
import { dataReport } from "../TableObligationsFinancial/config";
import { IIncome } from "./types";

interface ISourceIncomeProps {
  openModal?: (state: boolean) => void;
  onDataChange?: (newData: IIncomeSources) => void;
  ShowSupport?: boolean;
  disabled?: boolean;
  data?: IIncomeSources;
  customerData?: ICustomerData;
  showEdit?: boolean;
  initialDataForRestore?: IIncomeSources | null;
  onRestore?: () => void;
  borrowerOptions?: {
    id: `${string}-${string}-${string}-${string}-${string}`;
    label: string;
    value: string;
  }[];
  selectedIndex?: number | undefined;
  showErrorModal?: boolean;
  messageError?: string;
}

export function SourceIncome(props: ISourceIncomeProps) {
  const {
    openModal,
    onDataChange,
    ShowSupport,
    disabled,
    showEdit = true,
    data,
    selectedIndex,
    customerData = {} as ICustomerData,
    initialDataForRestore,
    borrowerOptions,
    onRestore,
  } = props;

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [borrowerIncome, setBorrowerIncome] = useState<IIncome | null>();
  const isMobile = useMediaQuery("(max-width:880px)");
  const [dataValues, setDataValues] = useState<IIncome | null>(null);
  const [pendingDataChange, setPendingDataChange] =
    useState<IIncomeSources | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");

  const groupMapping: Record<
    string,
    keyof Omit<IIncome, "borrower_id" | "borrower">
  > = {
    "Employment income": "employment",
    "Capital income": "capital",
    "Professional fees": "businesses",
    "Earnings from ventures or micro-businesses": "businesses",
  };

  function buildIncomeValues(
    sourceData: IIncomeSources,
    IncomeTypes: { Code: string; Type: string }[],
  ): IIncome {
    const values: IIncome = {
      borrower_id: sourceData?.identificationNumber ?? ".....",
      borrower: sourceData?.name ?? "",
      employment: [],
      capital: [],
      businesses: [],
    };

    for (const item of IncomeTypes) {
      const groupKey = groupMapping[item.Type];
      if (!groupKey) continue;

      const amount = (
        sourceData[item.Code as keyof IIncomeSources] ?? 0
      ).toString();
      if (values[groupKey]) {
        (values[groupKey] as unknown as string[]).push(amount);
      }
    }

    return values;
  }

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const sourceData = data as IIncomeSources;
      const values = buildIncomeValues(sourceData, IncomeTypes);

      setDataValues(values);
      setBorrowerIncome(values);
    } else {
      const defaultValues = getInitialValues(customerData);

      setDataValues(defaultValues);
      setBorrowerIncome(defaultValues);
    }
  }, [data]);

  useEffect(() => {
    if (pendingDataChange && onDataChange) {
      onDataChange(pendingDataChange);
      setPendingDataChange(null);
    }
  }, [pendingDataChange, onDataChange]);

  const totalSum = () => {
    const sumCapital =
      borrowerIncome?.capital.reduce(
        (acc, val) => acc + parseCurrencyString(val),
        0,
      ) ?? 0;
    const sumEmployment =
      borrowerIncome?.employment.reduce(
        (acc, val) => acc + parseCurrencyString(val),
        0,
      ) ?? 0;
    const sumBusinesses =
      borrowerIncome?.businesses.reduce(
        (acc, val) => acc + parseCurrencyString(val),
        0,
      ) ?? 0;

    return sumCapital + sumEmployment + sumBusinesses;
  };

  // const handleRestore = () => {
  //   if (onRestore) {
  //     onRestore();
  //   } else if (initialDataForRestore) {
  //     const restoredValues = buildIncomeValues(
  //       initialDataForRestore,
  //       IncomeTypes,
  //     );
  //     setBorrowerIncome(restoredValues);
  //     setDataValues(restoredValues);
  //     setPendingDataChange(initialDataForRestore);
  //   }
  //   setIsOpenModal(false);
  // };

  function mapToIncomeSources(values: IIncome): IIncomeSources {
    return {
      identificationNumber: values.borrower_id,
      identificationType: "",
      name: values.borrower.split(" ")[0] || "",
      surname: values.borrower.split(" ").slice(1).join(" ") || "",
      Leases: parseCurrencyString(values.capital[0] || "0"),
      Dividends: parseCurrencyString(values.capital[1] || "0"),
      FinancialIncome: parseCurrencyString(values.capital[2] || "0"),
      PeriodicSalary: parseCurrencyString(values.employment[0] || "0"),
      OtherNonSalaryEmoluments: parseCurrencyString(
        values.employment[1] || "0",
      ),
      PensionAllowances: parseCurrencyString(values.employment[2] || "0"),
      ProfessionalFees: parseCurrencyString(values.businesses[0] || "0"),
      PersonalBusinessUtilities: parseCurrencyString(
        values.businesses[1] || "0",
      ),
    };
  }

  const handleIncomeChange = useCallback(
    (
      category: "employment" | "capital" | "businesses",
      index: number,
      newValue: string,
    ) => {
      const cleanedValue = parseCurrencyString(newValue);
      const cleanedString = cleanedValue.toString();

      setBorrowerIncome((prev) => {
        if (!prev) return null;

        const updated = {
          ...prev,
          [category]: prev[category].map((val, i) =>
            i === index ? cleanedString : val,
          ),
        };
        const mappedBack: IIncomeSources = mapToIncomeSources(updated);
        setPendingDataChange(mappedBack);

        return updated;
      });
    },
    [],
  );

  const handleEditModalSubmit = (updatedData: IIncomeSources) => {
    const updatedIncomeValues = buildIncomeValues(updatedData, IncomeTypes);
    setBorrowerIncome(updatedIncomeValues);
    setDataValues(updatedIncomeValues);
    setPendingDataChange(updatedData);
    setIsOpenEditModal(false);
  };

  const handleRestore = async () => {
    if (!data) return;

    const body = {
      borrowerIdentificationNumber: data.identificationNumber,
      income: {
        dividends: data.Dividends || 0,
        financialIncome: data.FinancialIncome || 0,
        leases: data.Leases || 0,
        otherNonSalaryEmoluments: data.OtherNonSalaryEmoluments || 0,
        pensionAllowances: data.PensionAllowances || 0,
        periodicSalary: data.PeriodicSalary || 0,
        personalBusinessUtilities: data.PersonalBusinessUtilities || 0,
        professionalFees: data.ProfessionalFees || 0,
      },
      justification: "restore income",
      prospectCode: "",
    };

    try {
      await restoreIncomeInformationByBorrowerId("fondecom", body);
      if (onRestore) onRestore();
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(dataReport.errorIncome);
    } finally {
      setIsOpenModal(false);
    }
  };

  return (
    <StyledContainer $smallScreen={isMobile}>
      <Stack
        direction="column"
        padding={isMobile ? "none" : "16px 24px"}
        gap="16px"
      >
        <Stack direction="column">
          <Stack
            width={!isMobile ? "auto" : "auto"}
            justifyContent="space-between"
            alignItems={isMobile ? "center" : "normal"}
            gap="24px"
            direction={!isMobile ? "row" : "column"}
          >
            {!isMobile && (
              <Stack direction="column" gap="8px">
                <Text type="body" size="small" weight="bold" appearance="dark">
                  {incomeCardData.borrower}
                </Text>
                <Text type="title" size="medium">
                  {borrowerOptions?.[selectedIndex || 0]?.value}
                </Text>
              </Stack>
            )}
            {isMobile && (
              <CardGray label="Deudor" placeHolder={borrowerIncome?.borrower} />
            )}
            <Stack
              width={!isMobile ? "end" : "auto"}
              direction="column"
              gap="8px"
              alignItems="center"
            >
              <Text
                appearance="primary"
                type="headline"
                size="large"
                weight="bold"
              >
                {currencyFormat(totalSum())}
              </Text>
              <Text size="small" appearance="gray" weight="normal">
                {incomeCardData.income}
              </Text>
            </Stack>

            <Stack
              width={isMobile ? "100%" : "auto"}
              gap="16px"
              margin="auto 0 0 0"
            >
              <Button
                variant="outlined"
                iconBefore={<MdCached />}
                fullwidth={isMobile}
                onClick={() => setIsOpenModal(true)}
                disabled={!initialDataForRestore && !onRestore}
              >
                {incomeCardData.restore}
              </Button>
              {showEdit && (
                <Button
                  iconBefore={<MdOutlineEdit />}
                  onClick={() =>
                    openModal ? openModal(true) : setIsOpenEditModal(true)
                  }
                >
                  {dataReport.edit}
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="column">
          <Grid
            templateColumns={!isMobile ? "repeat(3,1fr)" : "1fr"}
            gap="16px"
            autoRows="auto"
          >
            {borrowerIncome && (
              <>
                <IncomeEmployment
                  values={borrowerIncome.employment}
                  ShowSupport={ShowSupport}
                  disabled={disabled}
                  onValueChange={handleIncomeChange.bind(null, "employment")}
                />
                <IncomeCapital
                  values={borrowerIncome.capital}
                  ShowSupport={ShowSupport}
                  disabled={disabled}
                  onValueChange={handleIncomeChange.bind(null, "capital")}
                />
                <MicroBusinesses
                  values={borrowerIncome.businesses}
                  ShowSupport={ShowSupport}
                  disabled={disabled}
                  onValueChange={handleIncomeChange.bind(null, "businesses")}
                />
              </>
            )}
          </Grid>
        </Stack>
      </Stack>
      {isOpenModal && (
        <BaseModal
          title={incomeCardData.restore}
          nextButton={incomeCardData.restore}
          handleNext={handleRestore}
          handleClose={() => setIsOpenModal(false)}
          width={isMobile ? "290px" : "400px"}
        >
          <Text>{incomeCardData.description}</Text>
        </BaseModal>
      )}
      {isOpenEditModal && (
        <IncomeModal
          handleClose={() => setIsOpenEditModal(false)}
          disabled={false}
          onSubmit={handleEditModalSubmit}
          initialValues={data}
          dataValues={dataValues}
          customerData={customerData}
          borrowerOptions={borrowerOptions}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          isMobile={isMobile}
          message={messageError}
        />
      )}
    </StyledContainer>
  );
}

export type { ISourceIncomeProps };
