import { useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { BaseModal } from "../baseModal";
import { PaymentCapacityAnalysisDetails } from "./Details";
import { DataCapacityAnalysis } from "./config";
import { IFieldsetData, ISummaryItem } from "./types";
import { FieldsetSection, SummarySection } from "./Section";
import {
  IIncomeDetail,
  IPaymentCapacityResponse,
} from "@src/services/creditLimit/getBorrowePaymentCapacity/types";
import { currencyFormat } from "@src/utils/formatData/currency";
import { ScrollableContainer } from "./styles";

export interface IPaymentCapacityAnalysisProps {
  isMobile: boolean;
  handleClose: () => void;
  paymentCapacity?: IPaymentCapacityResponse | null;
}

export const PaymentCapacityAnalysis = (
  props: IPaymentCapacityAnalysisProps,
) => {
  const { isMobile, handleClose, paymentCapacity } = props;

  const initialValues: IIncomeDetail = {
    periodicSalary: 0,
    otherNonSalaryEmoluments: 0,
    pensionAllowances: 0,
    leases: 0,
    dividends: 0,
    financialIncome: 0,
    personalBusinessUtilities: 0,
    professionalFees: 0,
  };

  const [currentTab, setCurrentTab] = useState("general");
  const [showModal, setShowModal] = useState(false);
  const [modalInitialValues, setModalInitialValues] = useState<{
    concept: string;
    income: string;
    reserve: string;
    value: string;
  }>({ concept: "", income: "", reserve: "", value: "" });

  const capacityData =
    paymentCapacity?.paymentsCapacityResponse?.[0] || initialValues;

  const capacityRatios =
    paymentCapacity?.livingExpenseToIncomeRatiosResponse?.[0] || initialValues;

  const generalPayment = paymentCapacity?.paymentCapacity ?? 0;
  const generalReserve = paymentCapacity?.basicLivingExpenseReserve ?? 0;
  const generalRatio = paymentCapacity?.livingExpenseToIncomeRatio ?? 0;

  const handleShowModal = (
    concept: string,
    income: number,
    valueNumber: number,
    reservePercent: number,
  ) => {
    setModalInitialValues({
      concept,
      income: currencyFormat(income ?? 0, false) || "0",
      reserve: `${reservePercent ?? 0}%`,
      value: currencyFormat(valueNumber ?? 0, false) || "0",
    });
    setShowModal(true);
  };

  const generalFieldsets: IFieldsetData[] = [
    {
      legend: DataCapacityAnalysis.workRents,
      items: [
        {
          label: DataCapacityAnalysis.periodicSalary,
          value: currencyFormat(capacityData.periodicSalary ?? 0, false) || 0,
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.periodicSalary,
              capacityData.periodicSalary /
                (capacityRatios.periodicSalary / 100) || 0,
              capacityData.periodicSalary ?? 0,
              capacityRatios.periodicSalary ?? 0,
            ),
        },
        {
          label: DataCapacityAnalysis.otherNonSalaryEmoluments,
          value:
            currencyFormat(capacityData.otherNonSalaryEmoluments ?? 0, false) ||
            "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.otherNonSalaryEmoluments,
              capacityData.otherNonSalaryEmoluments /
                (capacityRatios.otherNonSalaryEmoluments / 100) || 0,
              capacityData.otherNonSalaryEmoluments ?? 0,
              capacityRatios.otherNonSalaryEmoluments ?? 0,
            ),
        },
        {
          label: DataCapacityAnalysis.pensionPayments,
          value:
            currencyFormat(capacityData.pensionAllowances ?? 0, false) || 0,
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.pensionPayments,
              capacityData.pensionAllowances /
                (capacityRatios.pensionAllowances / 100) || 0,
              capacityData.pensionAllowances ?? 0,
              capacityRatios.pensionAllowances ?? 0,
            ),
        },
      ],
    },
    {
      legend: DataCapacityAnalysis.professionalServices,
      items: [
        {
          label: DataCapacityAnalysis.professionalFees,
          value: currencyFormat(capacityData.professionalFees ?? 0, false) || 0,
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.professionalFees,
              capacityData.professionalFees /
                (capacityRatios.professionalFees / 100) || 0,
              capacityData.professionalFees ?? 0,
              capacityRatios.professionalFees ?? 0,
            ),
        },
      ],
    },
    {
      legend: DataCapacityAnalysis.capitalIncome,
      items: [
        {
          label: DataCapacityAnalysis.rentals,
          value: currencyFormat(capacityData.leases ?? 0, false) || "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.rentals,
              capacityData.leases / (capacityRatios.leases / 100) || 0,
              capacityData.leases ?? 0,
              capacityRatios.leases ?? 0,
            ),
        },
        {
          label: DataCapacityAnalysis.dividends,
          value: currencyFormat(capacityData.dividends ?? 0, false) || "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.dividends,
              capacityData.dividends / (capacityRatios.dividends / 100) || 0,
              capacityData.dividends ?? 0,
              capacityRatios.dividends ?? 0,
            ),
        },
        {
          label: DataCapacityAnalysis.financialReturns,
          value:
            currencyFormat(capacityData.financialIncome ?? 0, false) || "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.financialReturns,
              capacityData.financialIncome /
                (capacityRatios.financialIncome / 100) || 0,
              capacityData.financialIncome ?? 0,
              capacityRatios.financialIncome ?? 0,
            ),
        },
      ],
    },
    {
      legend: DataCapacityAnalysis.businessVentures,
      items: [
        {
          label: DataCapacityAnalysis.businessUtilities,
          value:
            currencyFormat(
              capacityData.personalBusinessUtilities ?? 0,
              false,
            ) || "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.businessUtilities,
              capacityData.personalBusinessUtilities /
                (capacityRatios.personalBusinessUtilities / 100) || 0,
              capacityData.personalBusinessUtilities ?? 0,
              capacityRatios.personalBusinessUtilities ?? 0,
            ),
        },
      ],
    },
  ];

  const payrollIncomeTotal =
    (capacityData.periodicSalary / (capacityRatios.periodicSalary / 100) || 0) +
    (capacityData.otherNonSalaryEmoluments /
      (capacityRatios.otherNonSalaryEmoluments / 100) || 0) +
    (capacityData.pensionAllowances /
      (capacityRatios.pensionAllowances / 100) || 0);

  const generalSummary: ISummaryItem[] = [
    {
      label: DataCapacityAnalysis.totalIncome,
      value:
        currencyFormat(generalPayment / (generalRatio / 100 || 1), false) ||
        "0",
      bold: true,
    },
    {
      label: DataCapacityAnalysis.minimumPaymentReserve.replace(
        "{percent}",
        `${generalRatio || 0}`,
      ),
      value: currencyFormat(generalReserve ?? 0, false) || "0",
      gray: true,
    },
    {
      label: DataCapacityAnalysis.paymentCapacity,
      value: currencyFormat(generalPayment ?? 0, false) || "0",
      bold: true,
    },
  ];

  const payrollSummary: ISummaryItem[] = [
    {
      label: DataCapacityAnalysis.totalIncome,
      value: currencyFormat(payrollIncomeTotal, false) || "0",
      bold: true,
    },
    {
      label: DataCapacityAnalysis.minimumPaymentReserve.replace(
        "{percent}",
        `${generalRatio || 0}`,
      ),
      value: currencyFormat(generalReserve ?? 0, false) || "0",
      gray: true,
    },
    {
      label: DataCapacityAnalysis.currentObligations,
      value: "0",
      gray: true,
      showIcon: true,
    },
    {
      label: DataCapacityAnalysis.paymentCapacity,
      value: currencyFormat(generalPayment ?? 0, false) || "0",
      bold: true,
    },
  ];

  const onChange = (tabId: string) => setCurrentTab(tabId);

  return (
    <BaseModal
      title={DataCapacityAnalysis.modalTitle}
      nextButton={DataCapacityAnalysis.closeButton}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "335px" : "500px"}
      finalDivider={true}
    >
      <Stack direction="column">
        <Tabs
          selectedTab={currentTab}
          tabs={[
            { id: "general", label: "General" },
            { id: "payroll", label: "Nómina" },
          ]}
          onChange={onChange}
        />
        <ScrollableContainer $smallScreen={isMobile}>
          {currentTab === "general" && (
            <Stack direction="column">
              {generalFieldsets.map((fieldset, index) => (
                <FieldsetSection
                  key={index}
                  legend={fieldset.legend}
                  items={fieldset.items}
                  isMobile={isMobile}
                />
              ))}
              <SummarySection items={generalSummary} isMobile={isMobile} />
            </Stack>
          )}
          {currentTab === "payroll" && (
            <Stack direction="column">
              {generalFieldsets[0] && (
                <FieldsetSection
                  legend={generalFieldsets[0].legend}
                  items={generalFieldsets[0].items}
                  isMobile={isMobile}
                />
              )}
              <SummarySection items={payrollSummary} isMobile={isMobile} />
            </Stack>
          )}
          {showModal && (
            <PaymentCapacityAnalysisDetails
              isMobile={isMobile}
              initialValues={modalInitialValues}
              handleClose={() => setShowModal(false)}
            />
          )}
        </ScrollableContainer>
      </Stack>
    </BaseModal>
  );
};
