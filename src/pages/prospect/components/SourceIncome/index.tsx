import { useEffect, useRef, useState } from "react";
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
}

export function SourceIncome(props: ISourceIncomeProps) {
  const {
    openModal,
    onDataChange,
    ShowSupport,
    disabled,
    showEdit = true,
    data,
    customerData = {} as ICustomerData,
  } = props;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [borrowerIncome, setBorrowerIncome] = useState<IIncome | null>();
  const isMobile = useMediaQuery("(max-width:880px)");
  const [dataValues, setDataValues] = useState<IIncome | null>(null);
  const initialValuesRef = useRef<IIncome | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const sourceData = data as IIncomeSources;
      const values: IIncome = {
        borrower_id: customerData?.publicCode ?? "",
        borrower: customerData?.fullName ?? "",
        capital: [
          (sourceData.FinancialIncome ?? 0).toString(),
          (sourceData.Dividends ?? 0).toString(),
          (sourceData.Leases ?? 0).toString(),
        ],
        employment: [
          (sourceData.PeriodicSalary ?? 0).toString(),
          (sourceData.OtherNonSalaryEmoluments ?? 0).toString(),
          (sourceData.PensionAllowances ?? 0).toString(),
        ],
        businesses: [
          (sourceData.ProfessionalFees ?? 0).toString(),
          (sourceData.PersonalBusinessUtilities ?? 0).toString(),
        ],
      };

      setDataValues(values);
      setBorrowerIncome(values);
      if (!isInitializedRef.current) {
        initialValuesRef.current = JSON.parse(JSON.stringify(values));
        isInitializedRef.current = true;
      }
    } else {
      const defaultValues = getInitialValues(customerData);
      setDataValues(defaultValues);
      setBorrowerIncome(defaultValues);
      if (!isInitializedRef.current) {
        initialValuesRef.current = JSON.parse(JSON.stringify(defaultValues));
        isInitializedRef.current = true;
      }
    }
  }, [data, customerData]);

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

  const handleRestore = () => {
    if (initialValuesRef.current) {
      const restoredValues = JSON.parse(
        JSON.stringify(initialValuesRef.current),
      );
      setBorrowerIncome(restoredValues);
      const mappedData = mapToIncomeSources(restoredValues);
      onDataChange?.(mappedData);
    }
    setIsOpenModal(false);
  };

  function mapToIncomeSources(values: IIncome): IIncomeSources {
    return {
      identificationNumber: values.borrower_id,
      identificationType: "",
      name: values.borrower.split(" ")[0] || "",
      surname: values.borrower.split(" ").slice(1).join(" ") || "",
      Leases: parseCurrencyString(values.capital[2] || "0"),
      Dividends: parseCurrencyString(values.capital[1] || "0"),
      FinancialIncome: parseCurrencyString(values.capital[0] || "0"),
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

  const handleIncomeChange = (
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
      onDataChange?.(mappedBack);

      return updated;
    });
  };

  const handleModalSubmit = (updatedData: IIncomeSources) => {
    onDataChange?.(updatedData);
    setIsOpenEditModal(false);
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
                  {customerData?.fullName}
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
          onSubmit={handleModalSubmit}
          initialValues={data}
          customerData={customerData}
          dataValues={dataValues}
        />
      )}
    </StyledContainer>
  );
}

export type { ISourceIncomeProps };
