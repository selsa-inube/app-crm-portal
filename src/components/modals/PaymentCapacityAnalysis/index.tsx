import { useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";
import {
  IIncomeDetail,
  IPaymentCapacityResponse,
} from "@services/creditLimit/types";
import { currencyFormat } from "@utils/formatData/currency";
import { ISourcesOfIncomeState } from "@pages/simulateCredit/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { BaseModal } from "../baseModal";
import { PaymentCapacityAnalysisDetails } from "./Details";
import { DataCapacityAnalysis } from "./config";
import { IFieldsetData, ISummaryItem } from "./types";
import { FieldsetSection, SummarySection } from "./Section";
import { ScrollableContainer } from "./styles";

export interface IPaymentCapacityAnalysisProps {
  isMobile: boolean;
  lang: EnumType;
  handleClose: () => void;
  sourcesOfIncome: ISourcesOfIncomeState;
  paymentCapacity?: IPaymentCapacityResponse | null;
}

export const PaymentCapacityAnalysis = (
  props: IPaymentCapacityAnalysisProps,
) => {
  const { isMobile, handleClose, paymentCapacity, sourcesOfIncome, lang } =
    props;

  const initialValues: IIncomeDetail = {
    periodicSalary: sourcesOfIncome?.PeriodicSalary ?? 0,
    otherNonSalaryEmoluments: sourcesOfIncome?.OtherNonSalaryEmoluments ?? 0,
    pensionAllowances: sourcesOfIncome?.PensionAllowances ?? 0,
    leases: sourcesOfIncome?.Leases ?? 0,
    dividends: sourcesOfIncome?.Dividends ?? 0,
    financialIncome: sourcesOfIncome?.FinancialIncome ?? 0,
    personalBusinessUtilities: sourcesOfIncome?.PersonalBusinessUtilities ?? 0,
    professionalFees: sourcesOfIncome?.ProfessionalFees ?? 0,
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
      legend: DataCapacityAnalysis.workRents.i18n[lang],
      items: [
        {
          label: DataCapacityAnalysis.periodicSalary.i18n[lang],
          value: currencyFormat(capacityData.periodicSalary ?? 0, false) || 0,
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.periodicSalary.i18n[lang],
              capacityData.periodicSalary /
                (1 - capacityRatios.periodicSalary / 100) ||
                capacityData.periodicSalary,
              capacityData.periodicSalary ?? 0,
              capacityRatios.periodicSalary ?? 0,
            ),
        },
        {
          label: DataCapacityAnalysis.otherNonSalaryEmoluments.i18n[lang],
          value:
            currencyFormat(capacityData.otherNonSalaryEmoluments ?? 0, false) ||
            "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.otherNonSalaryEmoluments.i18n[lang],
              capacityData.otherNonSalaryEmoluments /
                (1 - capacityRatios.otherNonSalaryEmoluments / 100) ||
                capacityData.otherNonSalaryEmoluments,
              capacityData.otherNonSalaryEmoluments ?? 0,
              capacityRatios.otherNonSalaryEmoluments ?? 0,
            ),
        },
        {
          label: DataCapacityAnalysis.pensionPayments.i18n[lang],
          value:
            currencyFormat(capacityData.pensionAllowances ?? 0, false) || 0,
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.pensionPayments.i18n[lang],
              capacityData.pensionAllowances /
                (1 - capacityRatios.pensionAllowances / 100) ||
                capacityData.pensionAllowances,
              capacityData.pensionAllowances ?? 0,
              capacityRatios.pensionAllowances ?? 0,
            ),
        },
      ],
    },
    {
      legend: DataCapacityAnalysis.professionalServices.i18n[lang],
      items: [
        {
          label: DataCapacityAnalysis.professionalFees.i18n[lang],
          value: currencyFormat(capacityData.professionalFees ?? 0, false) || 0,
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.professionalFees.i18n[lang],
              capacityData.professionalFees /
                (1 - capacityRatios.professionalFees / 100) ||
                capacityData.professionalFees,
              capacityData.professionalFees ?? 0,
              capacityRatios.professionalFees ?? 0,
            ),
        },
      ],
    },
    {
      legend: DataCapacityAnalysis.capitalIncome.i18n[lang],
      items: [
        {
          label: DataCapacityAnalysis.rentals.i18n[lang],
          value: currencyFormat(capacityData.leases ?? 0, false) || "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.rentals.i18n[lang],
              capacityData.leases / (1 - capacityRatios.leases / 100) ||
                capacityData.leases,
              capacityData.leases ?? 0,
              capacityRatios.leases ?? 0,
            ),
        },
        {
          label: DataCapacityAnalysis.dividends.i18n[lang],
          value: currencyFormat(capacityData.dividends ?? 0, false) || "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.dividends.i18n[lang],
              capacityData.dividends / (1 - capacityRatios.dividends / 100) ||
                capacityData.dividends,
              capacityData.dividends ?? 0,
              capacityRatios.dividends ?? 0,
            ),
        },
        {
          label: DataCapacityAnalysis.financialReturns.i18n[lang],
          value:
            currencyFormat(capacityData.financialIncome ?? 0, false) || "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.financialReturns.i18n[lang],
              capacityData.financialIncome /
                (1 - capacityRatios.financialIncome / 100) ||
                capacityData.financialIncome,
              capacityData.financialIncome ?? 0,
              capacityRatios.financialIncome ?? 0,
            ),
        },
      ],
    },
    {
      legend: DataCapacityAnalysis.businessVentures.i18n[lang],
      items: [
        {
          label: DataCapacityAnalysis.businessUtilities.i18n[lang],
          value:
            currencyFormat(
              capacityData.personalBusinessUtilities ?? 0,
              false,
            ) || "0",
          showIcon: true,
          onShowModal: () =>
            handleShowModal(
              DataCapacityAnalysis.businessUtilities.i18n[lang],
              capacityData.personalBusinessUtilities /
                (1 - capacityRatios.personalBusinessUtilities / 100) ||
                capacityData.personalBusinessUtilities,
              capacityData.personalBusinessUtilities ?? 0,
              capacityRatios.personalBusinessUtilities ?? 0,
            ),
        },
      ],
    },
  ];

  const payrollIncomeTotal =
    ((capacityData.periodicSalary ?? 0) /
      (1 - capacityRatios.periodicSalary / 100) ||
      (capacityData.periodicSalary ?? 0)) +
    ((capacityData.otherNonSalaryEmoluments ?? 0) /
      (1 - capacityRatios.otherNonSalaryEmoluments / 100) ||
      (capacityData.otherNonSalaryEmoluments ?? 0)) +
    ((capacityData.pensionAllowances ?? 0) /
      (1 - capacityRatios.pensionAllowances / 100) ||
      (capacityData.pensionAllowances ?? 0));

  const payrollReserve =
    ((capacityData.periodicSalary ?? 0) /
      (1 - (capacityRatios.periodicSalary / 100 || 0))) *
      (capacityRatios.periodicSalary / 100 || 0) +
    (((capacityData.otherNonSalaryEmoluments ?? 0) /
      (1 - (capacityRatios.otherNonSalaryEmoluments / 100 || 0))) *
      (capacityRatios.otherNonSalaryEmoluments / 100 || 0) +
      ((capacityData.pensionAllowances ?? 0) /
        (1 - (capacityRatios.pensionAllowances / 100 || 0))) *
        (capacityRatios.pensionAllowances / 100 || 0));

  const payrollMinReserveToIncomeRatio =
    payrollIncomeTotal != null
      ? (payrollReserve / payrollIncomeTotal) * 100
      : 0;

  const generalSummary: ISummaryItem[] = [
    {
      label: DataCapacityAnalysis.totalIncome.i18n[lang],
      value:
        currencyFormat(generalPayment / (1 - generalRatio / 100 || 1), false) ||
        "0",
      bold: true,
    },
    {
      label: DataCapacityAnalysis.minimumPaymentReserve.i18n[lang].replace(
        "{percent}",
        `${generalRatio.toFixed(4) || 0}`,
      ),
      value: currencyFormat(generalReserve ?? 0, false) || "0",
      gray: true,
    },
    {
      label: DataCapacityAnalysis.paymentCapacity.i18n[lang],
      value: currencyFormat(generalPayment ?? 0, false) || "0",
      bold: true,
    },
  ];

  const payrollSummary: ISummaryItem[] = [
    {
      label: DataCapacityAnalysis.totalIncome.i18n[lang],
      value: currencyFormat(payrollIncomeTotal, false) || "0",
      bold: true,
    },
    {
      label: DataCapacityAnalysis.minimumPaymentReserve.i18n[lang].replace(
        "{percent}",
        `${payrollMinReserveToIncomeRatio.toFixed(4) || 0}`,
      ),
      value: currencyFormat(payrollReserve ?? 0, false) || "0",
      gray: true,
    },
    {
      label: DataCapacityAnalysis.paymentCapacity.i18n[lang],
      value: currencyFormat(generalPayment ?? 0, false) || "0",
      bold: true,
    },
  ];

  const onChange = (tabId: string) => setCurrentTab(tabId);

  return (
    <BaseModal
      title={DataCapacityAnalysis.modalTitle.i18n[lang]}
      nextButton={DataCapacityAnalysis.closeButton.i18n[lang]}
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
                  lang={lang}
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
                  lang={lang}
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
              lang={lang}
            />
          )}
        </ScrollableContainer>
      </Stack>
    </BaseModal>
  );
};
