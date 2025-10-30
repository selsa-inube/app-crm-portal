import { useState } from "react";
import {
  MdCheckCircle,
  MdOutlineShare,
  MdArrowBack,
  MdOutlineInfo,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  Assisted,
  Breadcrumbs,
  Icon,
  Text,
  Stack,
  Button,
} from "@inubekit/inubekit";

import userImage from "@assets/images/userImage.jpeg";
import { BaseModal } from "@components/modals/baseModal";
import { disbursemenTabs } from "@pages/applyForCredit/steps/disbursementGeneral/config";
import { GeneralHeader } from "@pages/simulateCredit/components/GeneralHeader";
import { ICustomerData } from "@context/CustomerContext/types";
import { ErrorPage } from "@components/layout/ErrorPage";
import { ErrorModal } from "@components/modals/ErrorModal";
import {
  IProspect,
  IProspectBorrower,
  IProspectSummaryById,
} from "@services/prospect/types";
import { currencyFormat } from "@utils/formatData/currency";

import {
  IBorrowerData,
  IFormData,
  IStep,
  StepDetails,
  titleButtonTextAssited,
} from "./types";
import {
  StyledArrowBack,
  StyledContainerAssisted,
  StyledSeparatorLine,
} from "./styles";
import { RequirementsNotMet } from "./steps/requirementsNotMet";
import { stepsFilingApplication } from "./config/filingApplication.config";
import { ContactInformation } from "./steps/contactInformation";
import { Borrowers } from "./steps/borrowerData";
import { PropertyOffered } from "./steps/propertyOffered";
import { VehicleOffered } from "./steps/vehicleOffered";
import { Bail } from "./steps/bail";
import { AttachedDocuments } from "./steps/attachedDocuments";
import { DisbursementGeneral } from "./steps/disbursementGeneral";
import { Observations } from "./steps/observations";
import { submitCreditApplicationConfig } from "./config/submitCreditApplication.config";
import { dataSubmitApplication } from "./config/config";
import { titlesModal } from "../simulations/config";
import { tittleOptions } from "./config/config";

interface ApplyForCreditUIProps {
  currentStep: number;
  currentStepsNumber: StepDetails;
  steps: IStep[];
  isCurrentFormValid: boolean;
  formData: IFormData;
  isMobile: boolean;
  sentModal: boolean;
  approvedRequestModal: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  numberProspectCode: string;
  dataHeader: { name: string; status: string; image?: string };
  businessManagerCode: string;
  getRuleByName: (name: string) => string[];
  prospectSummaryData?: IProspectSummaryById;
  setSentModal: React.Dispatch<React.SetStateAction<boolean>>;
  setApprovedRequestModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormChange: (updatedValues: Partial<IFormData>) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleSubmitClick: () => void;
  handleSubmit: () => void;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  businessUnitPublicCode: string;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  prospectData: IProspect;
  showErrorModal: boolean;
  messageError: string;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  modesOfDisbursement: string[];
  customerData?: ICustomerData;
  codeError?: number | null;
  addToFix?: string[];
}

export function ApplyForCreditUI(props: ApplyForCreditUIProps) {
  const {
    currentStepsNumber,
    currentStep,
    steps,
    isCurrentFormValid,
    formData,
    isMobile,
    isModalOpen,
    setIsModalOpen,
    dataHeader,
    sentModal,
    approvedRequestModal,
    businessManagerCode,
    getRuleByName,
    setSentModal,
    setApprovedRequestModal,
    handleFormChange,
    handleNextStep,
    handlePreviousStep,
    handleSubmitClick,
    handleSubmit,
    setShowErrorModal,
    prospectSummaryData,
    setIsCurrentFormValid,
    prospectData,
    showErrorModal,
    messageError,
    customerData,
    codeError,
    addToFix,
    businessUnitPublicCode,
    setMessageError,
    modesOfDisbursement,
  } = props;

  const [isSelected, setIsSelected] = useState<string>();
  const { prospectCode } = useParams();

  const handleTabChange = (tabId: string) => {
    setIsSelected(tabId);
  };

  const navigate = useNavigate();
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleHome = () => {
    navigate(`/credit/prospects/${prospectCode}`);
  };

  if (codeError) {
    setShowErrorModal(true);
    setMessageError(tittleOptions.tryLater);
  }

  const handleRedirect = () => {
    navigate(`/credit/prospects`);
  };
  return (
    <>
      {codeError ? (
        <ErrorPage
          errorCode={codeError}
          addToFix={addToFix || []}
          handleRedirect={handleRedirect}
        />
      ) : (
        <Stack
          direction="column"
          width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
          margin={`20px auto ${isMobile ? "100px" : "60px"} auto`}
        >
          <Stack
            direction="column"
            width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
            margin={`0px auto ${isMobile ? "100px" : "50px"} auto`}
          >
            <Stack gap="24px" direction="column" height="100%" width="100%">
              <GeneralHeader
                buttonText="Agregar vinculación"
                descriptionStatus={dataHeader.status}
                name={dataHeader.name}
                profileImageUrl={dataHeader.image || userImage}
              />
              <Breadcrumbs crumbs={submitCreditApplicationConfig.crumbs} />
              <Stack justifyContent="space-between" alignItems="center">
                <StyledArrowBack onClick={handleHome}>
                  <Stack gap="8px" alignItems="center" width="100%">
                    <Icon
                      icon={<MdArrowBack />}
                      appearance="dark"
                      size="20px"
                    />
                    <Text type="title" size={isMobile ? "small" : "large"}>
                      {`${submitCreditApplicationConfig.title}`}
                    </Text>
                  </Stack>
                </StyledArrowBack>
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
              {isMobile ? (
                <Stack gap="2px">
                  <Text
                    type="body"
                    size="small"
                    weight="bold"
                    appearance="dark"
                  >
                    {`Prospecto ${prospectData.prospectCode}`}
                  </Text>
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                </Stack>
              ) : (
                <Stack gap="16px" width="100%" justifyContent="space-between">
                  <Text
                    type="body"
                    size="medium"
                    weight="bold"
                    appearance="dark"
                  >
                    {`Prospecto ${prospectData.prospectCode}`}
                  </Text>
                  <StyledSeparatorLine />
                  <Text type="body" size="medium" appearance="gray">
                    {`${dataSubmitApplication.cards.destination}
        ${prospectData.moneyDestinationAbbreviatedName}`}
                  </Text>
                  <StyledSeparatorLine />
                  <Text type="body" size="medium" appearance="gray">
                    {`Neto a girar: ${currencyFormat(prospectSummaryData?.netAmountToDisburse ?? 0)}`}
                  </Text>
                  <StyledSeparatorLine />
                  <Text type="body" size="medium" appearance="gray">
                    {`Monto: ${currencyFormat(prospectSummaryData?.requestedAmount ?? 0)}`}
                  </Text>
                </Stack>
              )}

              {currentStepsNumber &&
                currentStepsNumber.id ===
                  stepsFilingApplication.generalInformation.id &&
                customerData && (
                  <RequirementsNotMet
                    isMobile={isMobile}
                    customerData={customerData}
                    prospectData={prospectData}
                    businessUnitPublicCode={businessUnitPublicCode}
                    businessManagerCode={businessManagerCode}
                  />
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
                      handleFormChange({
                        borrowerData: values as IBorrowerData,
                      })
                    }
                    prospectData={prospectData as IProspectBorrower}
                    valueRule={getRuleByName("ValidationCoBorrower")}
                    businessManagerCode={businessManagerCode}
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
                    businessUnitPublicCode={businessUnitPublicCode}
                    businessManagerCode={businessManagerCode}
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
                    businessUnitPublicCode={businessUnitPublicCode}
                    businessManagerCode={businessManagerCode}
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
                    prospectSummaryData={prospectSummaryData}
                    modesOfDisbursement={modesOfDisbursement}
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
                    prospectData={prospectData}
                    businessUnitPublicCode={businessUnitPublicCode}
                  />
                )}
              {currentStepsNumber &&
                currentStepsNumber.id ===
                  stepsFilingApplication.observations.id &&
                customerData && (
                  <Observations
                    initialValues={formData.observations}
                    isMobile={isMobile}
                    handleOnChange={(newData) =>
                      handleFormChange({ observations: newData })
                    }
                    onFormValid={setIsCurrentFormValid}
                  />
                )}
              <Stack
                justifyContent="end"
                gap="20px"
                margin={isMobile ? "0px" : "auto 0 0 0"}
              >
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
            {isModalOpen && (
              <>
                <BaseModal
                  title={titlesModal.title}
                  nextButton={titlesModal.textButtonNext}
                  handleNext={() => setIsModalOpen(false)}
                  handleClose={() => setIsModalOpen(false)}
                  width={isMobile ? "290px" : "400px"}
                >
                  <Stack gap="16px" direction="column">
                    <Text type="body" size="medium" appearance="gray">
                      {`${dataSubmitApplication.cards.destination}
        ${prospectData.moneyDestinationAbbreviatedName}`}
                    </Text>
                    <Text type="body" size="medium" appearance="gray">
                      {`Neto a girar: ${currencyFormat(prospectSummaryData?.netAmountToDisburse ?? 0)}`}
                    </Text>
                    <Text type="body" size="medium" appearance="gray">
                      {`Monto: ${currencyFormat(prospectSummaryData?.requestedAmount ?? 0)}`}
                    </Text>
                  </Stack>
                </BaseModal>
              </>
            )}
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
                    `${prospectData?.prospectCode}` || "",
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
                      {prospectData?.prospectCode}
                    </Text>
                  </Stack>
                  <Text type="body" size="medium" appearance="gray">
                    {dataSubmitApplication.modals.filedDescription}
                  </Text>
                </Stack>
              </BaseModal>
            )}
          </Stack>
          {showErrorModal && (
            <ErrorModal
              handleClose={() => setShowErrorModal(false)}
              isMobile={isMobile}
              message={messageError}
            />
          )}
        </Stack>
      )}
    </>
  );
}
