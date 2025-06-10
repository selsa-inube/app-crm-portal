import { useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { BaseModal } from "../baseModal";
import { PaymentCapacityAnalysisDetails } from "./Details";
import { DataCapacityAnalysis } from "./config";
import { IFieldsetData, ISummaryItem } from "./types";
import { FieldsetSection, SummarySection } from "./Section";

export interface IPaymentCapacityAnalysisProps {
  isMobile: boolean;
  handleClose: () => void;
}

export const PaymentCapacityAnalysis = (
  props: IPaymentCapacityAnalysisProps,
) => {
  const { isMobile, handleClose } = props;

  const dataTabs = [
    { id: "general", label: "General" },
    { id: "roster", label: "Nómina" },
  ];

  const [currentTab, setCurrentTab] = useState(dataTabs[0].id);
  const [showModal, setShowModal] = useState(false);

  const generalFieldsets: IFieldsetData[] = [
    {
      legend: DataCapacityAnalysis.workRents,
      items: [
        {
          label: DataCapacityAnalysis.periodicSalary,
          value: "2.000.000",
          showIcon: true,
        },
        {
          label: DataCapacityAnalysis.otherNonSalaryEmoluments,
          value: "500.000",
          showIcon: true,
        },
        {
          label: DataCapacityAnalysis.pensionPayments,
          value: "540.000",
          showIcon: true,
        },
      ],
    },
    {
      legend: DataCapacityAnalysis.professionalServices,
      items: [
        {
          label: DataCapacityAnalysis.professionalFees,
          value: "1.400.000",
          showIcon: true,
        },
      ],
    },
    {
      legend: DataCapacityAnalysis.capitalIncome,
      items: [
        {
          label: DataCapacityAnalysis.rentals,
          value: "640.000",
          showIcon: true,
        },
        {
          label: DataCapacityAnalysis.dividends,
          value: "40.000",
          showIcon: true,
        },
        {
          label: DataCapacityAnalysis.financialReturns,
          value: "96.000",
          showIcon: true,
        },
      ],
    },
    {
      legend: DataCapacityAnalysis.businessVentures,
      items: [
        {
          label: DataCapacityAnalysis.businessUtilities,
          value: "0",
          showIcon: true,
        },
      ],
    },
  ];

  const generalSummary: ISummaryItem[] = [
    {
      label: DataCapacityAnalysis.totalIncome,
      value: "1.400.000",
      bold: true,
    },
    {
      label: DataCapacityAnalysis.minimumPaymentReserve,
      value: "4.954.000",
      gray: true,
    },
    {
      label: DataCapacityAnalysis.paymentCapacity,
      value: "5.216.000",
      bold: true,
    },
  ];

  const rosterFieldsets: IFieldsetData[] = [
    {
      legend: DataCapacityAnalysis.workRents,
      items: [
        {
          label: DataCapacityAnalysis.periodicSalary,
          value: "5.000.000",
        },
        {
          label: DataCapacityAnalysis.otherNonSalaryEmoluments,
          value: "1.000.000",
        },
        {
          label: DataCapacityAnalysis.pensionPayments,
          value: "1.200.000",
        },
      ],
    },
  ];

  const rosterSummary: ISummaryItem[] = [
    {
      label: DataCapacityAnalysis.totalIncome,
      value: "7.200.000",
      bold: true,
    },
    {
      label: DataCapacityAnalysis.minimumPaymentReserve,
      value: "4.160.000",
      gray: true,
    },
    {
      label: DataCapacityAnalysis.currentObligations,
      value: "1.000.000",
      gray: true,
      showIcon: true,
    },
    {
      label: DataCapacityAnalysis.paymentCapacity,
      value: "4.216.000",
      bold: true,
    },
  ];

  const onChange = (tabId: string) => setCurrentTab(tabId);
  const onShowModal = () => setShowModal(true);

  return (
    <BaseModal
      title={DataCapacityAnalysis.modalTitle}
      nextButton={DataCapacityAnalysis.closeButton}
      handleNext={handleClose}
      handleClose={handleClose}
      finalDivider={true}
      width={isMobile ? "300px" : "452px"}
    >
      <Stack direction="column">
        <Tabs selectedTab={currentTab} tabs={dataTabs} onChange={onChange} />

        {currentTab === "general" && (
          <Stack direction="column">
            {generalFieldsets.map((fieldset, index) => (
              <FieldsetSection
                key={index}
                legend={fieldset.legend}
                items={fieldset.items}
                isMobile={isMobile}
                onShowModal={onShowModal}
              />
            ))}
            <SummarySection
              items={generalSummary}
              isMobile={isMobile}
              onShowModal={onShowModal}
            />
          </Stack>
        )}

        {currentTab === "roster" && (
          <Stack direction="column">
            {rosterFieldsets.map((fieldset, index) => (
              <FieldsetSection
                key={index}
                legend={fieldset.legend}
                items={fieldset.items}
                isMobile={isMobile}
                onShowModal={onShowModal}
              />
            ))}
            <SummarySection
              items={rosterSummary}
              isMobile={isMobile}
              onShowModal={onShowModal}
            />
          </Stack>
        )}

        {showModal && (
          <PaymentCapacityAnalysisDetails
            isMobile={isMobile}
            initialValues={{
              income: "5.000.000",
              reserve: "60%",
              value: "2.000.000",
            }}
            handleClose={() => setShowModal(false)}
          />
        )}
      </Stack>
    </BaseModal>
  );
};
