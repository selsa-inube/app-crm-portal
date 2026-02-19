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

import { BaseModal } from "@components/modals/baseModal";
import { disbursemenTabs } from "@pages/applyForCredit/steps/disbursementGeneral/config";
import { ICustomerData } from "@context/CustomerContext/types";
import { ErrorPage } from "@components/layout/ErrorPage";
import { ErrorModal } from "@components/modals/ErrorModal";
import {
  IProspect,
  IProspectBorrower,
  IProspectSummaryById,
} from "@services/prospect/types";
import { currencyFormat } from "@utils/formatData/currency";
import { TruncatedText } from "@components/modals/TruncatedTextModal";
import { EnumType } from "@hooks/useEnum/useEnum";
import { IAllEnumsResponse } from "@services/enumerators/types";
import { IValidateRequirement } from "@services/creditRequest/types";

import {
  IBorrowerData,
  IFormData,
  IStep,
  IStepDetails,
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
  currentStepNumber: IStepDetails;
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
  prospectSummaryData?: IProspectSummaryById;
  setSentModal: React.Dispatch<React.SetStateAction<boolean>>;
  setApprovedRequestModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormChange: (updatedValues: Partial<IFormData>) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleSubmitClick: () => void;
  handleSubmit: () => void;
  loading: boolean;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  businessUnitPublicCode: string;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  prospectData: IProspect;
  showErrorModal: boolean;
  messageError: string;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  creditRequestCode?: string;
  modesOfDisbursement: string[];
  customerData?: ICustomerData;
  codeError?: number | null;
  addToFix?: string[];
  guaranteesRequired: string[];
  lang: EnumType;
  enums: IAllEnumsResponse;
  generateAndShareApprovedRequest: () => Promise<void>;
  validDocumentsRequiredByCreditRequest: IValidateRequirement[];
}

export function ApplyForCreditUI(props: ApplyForCreditUIProps) {
  const {
    currentStepNumber,
    currentStep,
    steps,
    isCurrentFormValid,
    formData,
    isMobile,
    isModalOpen,
    setIsModalOpen,
    validDocumentsRequiredByCreditRequest,
    sentModal,
    approvedRequestModal,
    businessManagerCode,
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
    creditRequestCode,
    modesOfDisbursement,
    guaranteesRequired,
    loading,
    lang,
    enums,
    generateAndShareApprovedRequest,
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
    setMessageError(tittleOptions.tryLater.i18n[lang]);
  }

  const handleRedirect = () => {
    if (codeError === 400 || codeError === 1003) {
      navigate(`/clients/select-client/`);
    } else {
      navigate(`/credit/prospects`);
    }
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
          width={isMobile ? "calc(100% - 5px)" : "min(100% - 40px, 1064px)"}
          margin={`20px auto ${isMobile ? "100px" : "60px"} auto`}
        >
          <Stack
            direction="column"
            width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
            margin={`0px auto ${isMobile ? "100px" : "50px"} auto`}
          >
            <Stack gap="24px" direction="column" height="100%" width="100%">
              <Breadcrumbs
                crumbs={submitCreditApplicationConfig.crumbs.map((crumb) => ({
                  ...crumb,
                  label: crumb.label.i18n[lang],
                }))}
              />
              <Stack justifyContent="space-between" alignItems="center">
                <StyledArrowBack onClick={handleHome}>
                  <Stack gap="8px" alignItems="center" width="100%">
                    <Icon
                      icon={<MdArrowBack />}
                      appearance="dark"
                      size="20px"
                    />
                    <Text type="title" size={isMobile ? "small" : "large"}>
                      {`${submitCreditApplicationConfig.title.i18n[lang]}`}
                    </Text>
                  </Stack>
                </StyledArrowBack>
              </Stack>
              <StyledContainerAssisted $cursorDisabled={!isCurrentFormValid}>
                <Assisted
                  step={currentStepNumber!}
                  totalSteps={steps.length}
                  onBackClick={handlePreviousStep}
                  onNextClick={handleNextStep}
                  controls={{
                    goBackText: titleButtonTextAssited.goBackText.i18n[lang],
                    goNextText: titleButtonTextAssited.goNextText.i18n[lang],
                    submitText: titleButtonTextAssited.submitText.i18n[lang],
                  }}
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
                  <Stack width="100%">
                    <Text
                      type="body"
                      size="medium"
                      weight="bold"
                      appearance="dark"
                    >
                      {`${dataSubmitApplication.prospect.i18n[lang]} ${prospectData.prospectCode}`}
                    </Text>
                  </Stack>
                  <StyledSeparatorLine />
                  <Stack width="100%" justifyContent="center">
                    <TruncatedText
                      text={`${dataSubmitApplication.cards.destination.i18n[lang]} ${prospectData.moneyDestinationAbbreviatedName}`}
                      maxLength={30}
                      type="body"
                      size="medium"
                      appearance="gray"
                    />
                  </Stack>
                  <StyledSeparatorLine />
                  <Stack width="100%" justifyContent="center">
                    <TruncatedText
                      text={`${dataSubmitApplication.net.i18n[lang]} ${currencyFormat(prospectSummaryData?.netAmountToDisburse ?? 0)}`}
                      maxLength={30}
                      type="body"
                      size="medium"
                      appearance="gray"
                    />
                  </Stack>
                  <StyledSeparatorLine />
                  <Stack width="100%" justifyContent="end">
                    <TruncatedText
                      text={`${dataSubmitApplication.creditProducts.i18n[lang]} ${currencyFormat(prospectSummaryData?.requestedAmount ?? 0)}`}
                      maxLength={40}
                      type="body"
                      size="medium"
                      appearance="gray"
                    />
                  </Stack>
                </Stack>
              )}
              {currentStepNumber &&
                currentStepNumber.id ===
                  stepsFilingApplication.generalInformation.id &&
                customerData && (
                  <RequirementsNotMet
                    isMobile={isMobile}
                    customerData={customerData}
                    prospectData={prospectData}
                    businessUnitPublicCode={businessUnitPublicCode}
                    businessManagerCode={businessManagerCode}
                    lang={lang}
                    enums={enums}
                  />
                )}
              {currentStepNumber &&
                currentStepNumber.id ===
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
                    lang={lang}
                  />
                )}
              {currentStepNumber &&
                currentStepNumber.id ===
                  stepsFilingApplication.borrowerData.id && (
                  <Borrowers
                    isMobile={isMobile}
                    onFormValid={setIsCurrentFormValid}
                    initialValues={prospectData.borrowers}
                    handleOnChange={(values) =>
                      handleFormChange({
                        borrowerData: values as IBorrowerData,
                      })
                    }
                    prospectData={prospectData as IProspectBorrower}
                    valueRule={guaranteesRequired}
                    businessManagerCode={businessManagerCode}
                    lang={lang}
                    enums={enums}
                  />
                )}
              {currentStepNumber &&
                currentStepNumber.id ===
                  stepsFilingApplication.propertyOffered.id && (
                  <PropertyOffered
                    isMobile={isMobile}
                    onFormValid={setIsCurrentFormValid}
                    initialValues={formData.propertyOffered}
                    handleOnChange={(values) =>
                      handleFormChange({ propertyOffered: values })
                    }
                    lang={lang}
                  />
                )}
              {currentStepNumber &&
                currentStepNumber.id ===
                  stepsFilingApplication.vehicleOffered.id && (
                  <VehicleOffered
                    isMobile={isMobile}
                    onFormValid={setIsCurrentFormValid}
                    initialValues={formData.vehicleOffered}
                    handleOnChange={(values) =>
                      handleFormChange({ vehicleOffered: values })
                    }
                    lang={lang}
                  />
                )}
              {currentStepNumber &&
                currentStepNumber.id === stepsFilingApplication.bail.id && (
                  <Bail
                    onFormValid={setIsCurrentFormValid}
                    initialValues={formData.bail}
                    handleOnChange={(values) =>
                      handleFormChange({ bail: values })
                    }
                    data={prospectData}
                    lang={lang}
                  />
                )}
              {currentStepNumber &&
                currentStepNumber.id ===
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
                    lang={lang}
                    enums={enums}
                  />
                )}
              {currentStepNumber &&
                currentStepNumber.id ===
                  stepsFilingApplication.attachedDocuments.id &&
                customerData && (
                  <AttachedDocuments
                    isMobile={isMobile}
                    initialValues={formData.attachedDocuments || {}}
                    handleOnChange={(newDocs) =>
                      handleFormChange({ attachedDocuments: newDocs })
                    }
                    customerData={customerData}
                    lang={lang}
                    loading={loading}
                    validDocumentsRequiredByCreditRequest={
                      validDocumentsRequiredByCreditRequest
                    }
                    showErrorModal={showErrorModal}
                  />
                )}
              {currentStepNumber &&
                currentStepNumber.id ===
                  stepsFilingApplication.observations.id &&
                customerData && (
                  <Observations
                    initialValues={formData.observations}
                    isMobile={isMobile}
                    handleOnChange={(newData) =>
                      handleFormChange({ observations: newData })
                    }
                    onFormValid={setIsCurrentFormValid}
                    lang={lang}
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
                  disabled={currentStepNumber === steps[0]}
                >
                  {titleButtonTextAssited.goBackText.i18n[lang]}
                </Button>
                <Button onClick={handleNextStep} disabled={!isCurrentFormValid}>
                  {currentStep === steps[steps.length - 1].id
                    ? titleButtonTextAssited.submitText.i18n[lang]
                    : titleButtonTextAssited.goNextText.i18n[lang]}
                </Button>
              </Stack>
            </Stack>
            {isModalOpen && (
              <>
                <BaseModal
                  title={titlesModal.title.i18n[lang]}
                  nextButton={titlesModal.textButtonNext.i18n[lang]}
                  handleNext={() => setIsModalOpen(false)}
                  handleClose={() => setIsModalOpen(false)}
                  width={isMobile ? "290px" : "400px"}
                >
                  <Stack gap="16px" direction="column">
                    <Text type="body" size="medium" appearance="gray">
                      {`${dataSubmitApplication.cards.destination.i18n[lang]}
        ${prospectData.moneyDestinationAbbreviatedName}`}
                    </Text>
                    <Text type="body" size="medium" appearance="gray">
                      {`${dataSubmitApplication.net.i18n[lang]} ${currencyFormat(prospectSummaryData?.netAmountToDisburse ?? 0)}`}
                    </Text>
                    <Text type="body" size="medium" appearance="gray">
                      {`${dataSubmitApplication.creditProducts.i18n[lang]} ${currencyFormat(prospectSummaryData?.requestedAmount ?? 0)}`}
                    </Text>
                  </Stack>
                </BaseModal>
              </>
            )}
            {sentModal && (
              <BaseModal
                title={dataSubmitApplication.modals.file.i18n[lang]}
                nextButton={dataSubmitApplication.modals.continue.i18n[lang]}
                backButton={dataSubmitApplication.modals.cancel.i18n[lang]}
                handleNext={() => {
                  handleSubmit();
                }}
                handleClose={() => {
                  setSentModal(false);
                }}
                handleBack={() => setSentModal(false)}
                width={isMobile ? "290px" : "402px"}
                isLoading={loading}
              >
                <Text type="body" size="large">
                  {dataSubmitApplication.modals.fileDescription.i18n[
                    lang
                  ].replace("{numberProspectCode}", `${prospectCode}` || "")}
                </Text>
              </BaseModal>
            )}
            {approvedRequestModal && (
              <BaseModal
                title={dataSubmitApplication.modals.filed.i18n[lang]}
                nextButton={dataSubmitApplication.modals.cancel.i18n[lang]}
                backButton={dataSubmitApplication.modals.share.i18n[lang]}
                iconBeforeback={
                  <Icon
                    icon={<MdOutlineShare />}
                    appearance="gray"
                    size="16px"
                  />
                }
                handleNext={() => {
                  setApprovedRequestModal(false);
                  navigate("/credit/credit-requests");
                }}
                handleBack={async () => {
                  await generateAndShareApprovedRequest();
                }}
                handleClose={() => {
                  setApprovedRequestModal(false);
                  navigate("/credit/credit-requests");
                }}
                width={isMobile ? "290px" : "402px"}
              >
                <Stack direction="column" alignItems="center" gap="24px">
                  <Icon
                    icon={<MdCheckCircle />}
                    appearance="success"
                    size="68px"
                  />
                  <Stack gap="6px" direction="column" alignItems="center">
                    <Text type="body" size="large" textAlign="center">
                      {dataSubmitApplication.modals.filed.i18n[lang]}
                    </Text>
                    <Text
                      type="body"
                      size="large"
                      weight="bold"
                      textAlign="center"
                    >
                      {creditRequestCode}
                    </Text>
                  </Stack>
                  <Text
                    type="body"
                    size="medium"
                    appearance="gray"
                    textAlign="center"
                  >
                    {dataSubmitApplication.modals.filedDescription.i18n[lang]}
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
