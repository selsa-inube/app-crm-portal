import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  Assisted,
  Breadcrumbs,
  Icon,
  Text,
  Stack,
  Button,
} from "@inubekit/inubekit";
import { MdCheckCircle, MdOutlineShare } from "react-icons/md";

import userImage from "@assets/images/userImage.jpeg";
import { BaseModal } from "@components/modals/baseModal";
import { disbursemenTabs } from "@pages/SubmitCreditApplication/steps/disbursementGeneral/config";
import { GeneralHeader } from "@pages/addProspect/components/GeneralHeader/";
import { ICustomerData } from "@context/CustomerContext/types";

import { IFormData, IStep, StepDetails, titleButtonTextAssited } from "./types";
import { StyledArrowBack, StyledContainerAssisted } from "./styles";
import { RequirementsNotMet } from "./steps/requirementsNotMet";
import { stepsFilingApplication } from "./config/filingApplication.config";
import { ContactInformation } from "./steps/contactInformation";
import { Borrowers } from "./steps/borrowerData";
import { PropertyOffered } from "./steps/propertyOffered";
import { VehicleOffered } from "./steps/vehicleOffered";
import { Bail } from "./steps/bail";
import { AttachedDocuments } from "./steps/attachedDocuments";
import { DisbursementGeneral } from "./steps/disbursementGeneral";
import { submitCreditApplicationConfig } from "./config/submitCreditApplication.config";
import { dataSubmitApplication } from "./config/config";
import { SummaryProspectCredit } from "@src/pages/prospect/outlets/CardCommercialManagement/config/config";
import { CardValues } from "@components/cards/cardValues";
import { mockCommercialManagement } from "@mocks/financialReporting/commercialmanagement.mock";
import { ErrorPage } from "@components/layout/ErrorPage";

interface SubmitCreditApplicationUIProps {
  currentStep: number;
  currentStepsNumber: StepDetails;
  steps: IStep[];
  isCurrentFormValid: boolean;
  formData: IFormData;
  isMobile: boolean;
  sentModal: boolean;
  approvedRequestModal: boolean;
  numberProspectCode: string;
  dataHeader: { name: string; status: string; image?: string };
  getRuleByName: (name: string) => string[];
  setSentModal: React.Dispatch<React.SetStateAction<boolean>>;
  setApprovedRequestModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormChange: (updatedValues: Partial<IFormData>) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleSubmitClick: () => void;
  handleSubmit: () => void;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prospectData: any;
  customerData?: ICustomerData;
  codeError?: number | null;
  addToFix?: string[];
}

export function SubmitCreditApplicationUI(
  props: SubmitCreditApplicationUIProps,
) {
  const {
    currentStepsNumber,
    currentStep,
    steps,
    isCurrentFormValid,
    formData,
    isMobile,
    dataHeader,
    sentModal,
    approvedRequestModal,
    getRuleByName,
    setSentModal,
    setApprovedRequestModal,
    handleFormChange,
    handleNextStep,
    handlePreviousStep,
    handleSubmitClick,
    handleSubmit,
    setIsCurrentFormValid,
    prospectData,
    customerData,
    codeError,
    addToFix,
  } = props;

  const [isSelected, setIsSelected] = useState<string>();
  const { customerPublicCode, prospectCode } = useParams();

  const handleTabChange = (tabId: string) => {
    setIsSelected(tabId);
  };

  const navigate = useNavigate();

  const handleHome = () => {
    navigate(`/credit/edit-prospect/${customerPublicCode}/${prospectCode}`);
  };

  return (
    <>
      {codeError ? (
        <ErrorPage errorCode={codeError} addToFix={addToFix || []} />
      ) : (
        <>
          <GeneralHeader
            buttonText="Agregar vinculación"
            descriptionStatus={dataHeader.status}
            name={dataHeader.name}
            profileImageUrl={dataHeader.image || userImage}
          />
          <Stack
            direction="column"
            alignItems={isMobile ? "normal" : "center"}
            margin="20px 0px"
            padding="24px"
            height="100vh"
          >
            <Stack
              gap="24px"
              direction="column"
              height="100%"
              width={isMobile ? "-webkit-fill-available" : "min(100%,1440px)"}
            >
              <Breadcrumbs crumbs={submitCreditApplicationConfig.crumbs} />
              <Stack justifyContent="space-between" alignItems="center">
                <StyledArrowBack onClick={handleHome}>
                  <Stack gap="8px" alignItems="center" width="100%">
                    <Icon
                      icon={<MdArrowBack />}
                      appearance="dark"
                      size="20px"
                    />
                    <Text type="title" size="large">
                      {`${submitCreditApplicationConfig.title}
                  ${prospectData?.prospect_code}`}
                    </Text>
                  </Stack>
                </StyledArrowBack>
                <Text type="body" size="medium" appearance="gray">
                  {`${dataSubmitApplication.cards.destination}
              ${prospectData.money_destination_abbreviated_name}`}
                </Text>
              </Stack>
              <Stack direction="column" gap="6px">
                {SummaryProspectCredit.map((entry, index) => (
                  <CardValues
                    key={index}
                    items={entry.item.map((item, index) => ({
                      ...item,
                      amount: mockCommercialManagement[index]?.amount,
                    }))}
                    showIcon={false}
                    isMobile={isMobile}
                    showMiniIcons={false}
                  />
                ))}
              </Stack>
              <StyledContainerAssisted $cursorDisabled={!isCurrentFormValid}>
                <Assisted
                  step={currentStepsNumber!}
                  totalSteps={steps.length}
                  onBackClick={handlePreviousStep}
                  onNextClick={handleNextStep}
                  controls={titleButtonTextAssited}
                  onSubmitClick={handleSubmitClick}
                  disableNext={!isCurrentFormValid}
                  disableSubmit={!isCurrentFormValid}
                  showCurrentStepNumber={false}
                  size={isMobile ? "small" : "large"}
                />
              </StyledContainerAssisted>
              {currentStepsNumber &&
                currentStepsNumber.id ===
                  stepsFilingApplication.generalInformation.id && (
                  <RequirementsNotMet isMobile={isMobile} />
                )}
              {currentStepsNumber &&
                currentStepsNumber.id ===
                  stepsFilingApplication.contactInformation.id &&
                customerData && (
                  <ContactInformation
                    isMobile={isMobile}
                    onFormValid={setIsCurrentFormValid}
                    initialValues={formData.contactInformation}
                    handleOnChange={(values) =>
                      handleFormChange({ contactInformation: values })
                    }
                    customerData={customerData}
                  />
                )}
              {currentStepsNumber &&
                currentStepsNumber.id ===
                  stepsFilingApplication.BorrowerData.id && (
                  <Borrowers
                    isMobile={isMobile}
                    onFormValid={setIsCurrentFormValid}
                    initialValues={formData.borrowerData}
                    handleOnChange={(values) =>
                      handleFormChange({ borrowerData: values })
                    }
                    data={prospectData}
                    valueRule={getRuleByName("ValidationCoBorrower")}
                  />
                )}
              {currentStepsNumber &&
                currentStepsNumber.id ===
                  stepsFilingApplication.propertyOffered.id && (
                  <PropertyOffered
                    isMobile={isMobile}
                    onFormValid={setIsCurrentFormValid}
                    initialValues={formData.propertyOffered}
                    handleOnChange={(values) =>
                      handleFormChange({ propertyOffered: values })
                    }
                  />
                )}
              {currentStepsNumber &&
                currentStepsNumber.id ===
                  stepsFilingApplication.vehicleOffered.id && (
                  <VehicleOffered
                    isMobile={isMobile}
                    onFormValid={setIsCurrentFormValid}
                    initialValues={formData.vehicleOffered}
                    handleOnChange={(values) =>
                      handleFormChange({ vehicleOffered: values })
                    }
                  />
                )}
              {currentStepsNumber &&
                currentStepsNumber.id === stepsFilingApplication.bail.id && (
                  <Bail
                    onFormValid={setIsCurrentFormValid}
                    initialValues={formData.bail}
                    handleOnChange={(values) =>
                      handleFormChange({ bail: values })
                    }
                    data={prospectData}
                  />
                )}
              {currentStepsNumber &&
                currentStepsNumber.id ===
                  stepsFilingApplication.attachedDocuments.id &&
                customerData && (
                  <AttachedDocuments
                    isMobile={isMobile}
                    initialValues={formData.attachedDocuments || {}}
                    handleOnChange={(newDocs) =>
                      handleFormChange({ attachedDocuments: newDocs })
                    }
                    customerData={customerData}
                  />
                )}
              {currentStepsNumber &&
                currentStepsNumber.id ===
                  stepsFilingApplication.disbursement.id &&
                customerData && (
                  <DisbursementGeneral
                    isMobile={isMobile}
                    onFormValid={setIsCurrentFormValid}
                    initialValues={formData.disbursementGeneral}
                    handleOnChange={(values) =>
                      handleFormChange({ disbursementGeneral: values })
                    }
                    isSelected={isSelected || disbursemenTabs.internal.id}
                    handleTabChange={handleTabChange}
                    data={prospectData}
                    customerData={customerData}
                    identificationNumber={customerData?.publicCode || ""}
                    rule={getRuleByName("ModeOfDisbursementType")}
                  />
                )}
              <Stack justifyContent="end" gap="20px" margin="auto 0 0 0">
                <Button
                  variant="outlined"
                  appearance="gray"
                  onClick={handlePreviousStep}
                  disabled={currentStepsNumber === steps[0]}
                >
                  {titleButtonTextAssited.goBackText}
                </Button>
                <Button onClick={handleNextStep} disabled={!isCurrentFormValid}>
                  {currentStep === steps[steps.length - 1].id
                    ? titleButtonTextAssited.submitText
                    : titleButtonTextAssited.goNextText}
                </Button>
              </Stack>
            </Stack>
            {sentModal && (
              <BaseModal
                title={dataSubmitApplication.modals.file}
                nextButton={dataSubmitApplication.modals.continue}
                backButton={dataSubmitApplication.modals.cancel}
                handleNext={handleSubmit}
                handleBack={() => setSentModal(false)}
                width={isMobile ? "290px" : "402px"}
              >
                <Text type="body" size="large">
                  {dataSubmitApplication.modals.fileDescription.replace(
                    "{numberProspectCode}",
                    `${prospectData?.prospect_code}` || "",
                  )}
                </Text>
              </BaseModal>
            )}
            {approvedRequestModal && (
              <BaseModal
                title={dataSubmitApplication.modals.filed}
                nextButton={dataSubmitApplication.modals.cancel}
                backButton={dataSubmitApplication.modals.share}
                iconBeforeback={
                  <Icon
                    icon={<MdOutlineShare />}
                    appearance="gray"
                    size="16px"
                  />
                }
                handleNext={() => setApprovedRequestModal(false)}
                handleClose={() => setApprovedRequestModal(false)}
                handleBack={() => console.log("data: ", formData)}
                width={isMobile ? "290px" : "402px"}
              >
                <Stack direction="column" alignItems="center" gap="24px">
                  <Icon
                    icon={<MdCheckCircle />}
                    appearance="success"
                    size="68px"
                  />
                  <Stack gap="6px">
                    <Text type="body" size="large">
                      {dataSubmitApplication.modals.filed}
                    </Text>
                    <Text type="body" size="large" weight="bold">
                      {prospectData?.prospect_code}
                    </Text>
                  </Stack>
                  <Text type="body" size="medium" appearance="gray">
                    {dataSubmitApplication.modals.filedDescription}
                  </Text>
                </Stack>
              </BaseModal>
            )}
          </Stack>
        </>
      )}
    </>
  );
}
