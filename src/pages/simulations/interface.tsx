import {
  Breadcrumbs,
  Button,
  Divider,
  Icon,
  SkeletonLine,
  Stack,
  Text,
} from "@inubekit/inubekit";
import {
  MdArrowBack,
  MdOutlineBeachAccess,
  MdOutlineInfo,
  MdOutlineShare,
  MdBolt,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Fieldset } from "@components/data/Fieldset";
import { ErrorPage } from "@components/layout/ErrorPage";
import { BaseModal } from "@components/modals/baseModal";
import { ErrorModal } from "@components/modals/ErrorModal";
import userImage from "@assets/images/userImage.jpeg";
import {
  IProspect,
  IExtraordinaryInstallments,
} from "@services/prospect/types";
import { IPaymentChannel } from "@services/creditRequest/types";
import { currencyFormat } from "@utils/formatData/currency";
import { IProspectSummaryById } from "@services/prospect/types";
import { IValidateRequirement } from "@services/requirement/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { RequirementsModal } from "../prospect/components/modals/RequirementsModal";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import { CreditProspect } from "../prospect/components/CreditProspect";
import {
  StyledArrowBack,
  StyledMarginPrint,
  StyledPrint,
  StyledScrollPrint,
  StyledPrintContainerHeader,
} from "./styles";
import {
  addConfig,
  dataEditProspect,
  titlesModal,
  labelsRecalculateSimulation,
} from "./config";
import { IDataHeader } from "./types";

interface ProcessedData {
  totalLoanAmount: number;
  destinationName: string;
  mainBorrowerName: string;
}

interface SimulationsUIProps {
  dataHeader: IDataHeader;
  isLoading: boolean;
  isMobile: boolean;
  prospectCode: string;
  data: IProspect | undefined;
  dataProspect: IProspect | undefined;
  showMenu: boolean;
  codeError: number | null;
  addToFix: string[];
  isModalOpen: boolean;
  showCreditRequest: boolean;
  dataPrint: React.RefObject<HTMLDivElement>;
  showErrorModal: boolean;
  messageError: string;
  showDeleteModal: boolean;
  businessManagerCode: string;
  canRequestCredit: boolean;
  canDeleteCreditRequest: boolean;
  canEditCreditRequest: boolean;
  processedData: ProcessedData;
  lang: EnumType;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: ReturnType<typeof useNavigate>;
  setShowMenu: (value: boolean) => void;
  handleSubmitClick: () => void;
  handleInfo: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreditRequest: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  setProspectData?: (prospect: IProspect) => void;
  requestValue?: IPaymentChannel[];
  sentData: IExtraordinaryInstallments | null;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  generateAndSharePdf: () => void;
  userAccount?: string;
  showRecalculateSimulation: boolean;
  setShowRecalculateSimulation: React.Dispatch<React.SetStateAction<boolean>>;
  handleRecalculateSimulation: () => void;
  showRequirements: boolean;
  setShowRequirements: React.Dispatch<React.SetStateAction<boolean>>;
  validateRequirements: IValidateRequirement[];
  onProspectUpdated?: () => void;
  handleDeleteProspect: () => void;
  prospectSummaryData?: IProspectSummaryById;
  setProspectSummaryData?: React.Dispatch<
    React.SetStateAction<IProspectSummaryById>
  >;
  isLoadingDelete?: boolean;
}

export function SimulationsUI(props: SimulationsUIProps) {
  const {
    dataHeader,
    isMobile,
    prospectCode,
    userAccount,
    dataProspect,
    showMenu,
    codeError,
    addToFix,
    isModalOpen,
    showCreditRequest,
    dataPrint,
    showErrorModal,
    messageError,
    showDeleteModal,
    businessManagerCode,
    canRequestCredit,
    canDeleteCreditRequest,
    canEditCreditRequest,
    processedData,
    lang,
    setShowDeleteModal,
    setShowErrorModal,
    navigate,
    setShowMenu,
    setRequestValue,
    handleSubmitClick,
    handleInfo,
    setIsModalOpen,
    sentData,
    setSentData,
    setShowCreditRequest,
    setProspectData,
    generateAndSharePdf,
    onProspectUpdated,
    handleDeleteProspect,
    prospectSummaryData,
    setProspectSummaryData,
    showRecalculateSimulation,
    setShowRecalculateSimulation,
    handleRecalculateSimulation,
    showRequirements,
    setShowRequirements,
    validateRequirements,
    isLoading = false,
    isLoadingDelete = false,
  } = props;

  return (
    <div ref={dataPrint}>
      {codeError ? (
        <ErrorPage errorCode={codeError} addToFix={addToFix || []} />
      ) : (
        <Stack
          direction="column"
          width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
          margin={`20px auto ${isMobile ? "100px" : "50px"} auto`}
        >
          <Stack
            direction="column"
            alignItems={isMobile ? "normal" : "center"}
            margin="20px 0px"
          >
            <Stack gap="24px" direction="column" height="100%" width="100%">
              <StyledPrint>
                <GeneralHeader
                  buttonText="Agregar vinculación"
                  descriptionStatus={dataHeader.status}
                  name={dataHeader.name}
                  profileImageUrl={dataHeader.image || userImage}
                />
                <Breadcrumbs
                  crumbs={[
                    ...addConfig.crumbs.slice(0, 3).map((crumb) => ({
                      ...crumb,
                      label: crumb.label.i18n[lang as "es" | "en"],
                    })),
                    {
                      path: `/credit/prospects/${prospectCode}`,
                      label:
                        lang === "es"
                          ? `Prospecto #${prospectCode}`
                          : `Prospect #${prospectCode}`,
                      id: `/prospectos/${prospectCode}`,
                      isActive: false,
                    },
                  ]}
                />
                <Stack>
                  <StyledArrowBack onClick={() => navigate(addConfig.route)}>
                    <Stack gap="8px" alignItems="center" width="100%">
                      <Icon
                        icon={<MdArrowBack />}
                        appearance="dark"
                        size="20px"
                      />
                      <Text type="title" size={isMobile ? "small" : "large"}>
                        {addConfig.title.i18n[lang]}
                      </Text>
                    </Stack>
                  </StyledArrowBack>
                  <Stack
                    direction="row-reverse"
                    width="100%"
                    justifyContent="end"
                  >
                    {!isMobile ? (
                      <Button
                        width={isMobile ? "auto " : "189px"}
                        iconBefore={<MdBolt />}
                        children={
                          isMobile
                            ? ""
                            : labelsRecalculateSimulation.button.i18n[lang]
                        }
                        variant="outlined"
                        spacing="compact"
                        onClick={() => setShowRecalculateSimulation(true)}
                      />
                    ) : (
                      <Icon
                        icon={<MdBolt />}
                        appearance="primary"
                        size="25px"
                        cursorHover
                        onClick={() => setShowRecalculateSimulation(true)}
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Stack>
              </StyledPrint>

              <StyledMarginPrint>
                <Stack>
                  <Stack
                    width={
                      isMobile ? "-webkit-fill-available" : "min(100%,1440px)"
                    }
                    margin="0 auto"
                    direction="column"
                    gap="20px"
                  >
                    <Fieldset>
                      <Stack gap="16px" direction="column" padding="4px 16px">
                        <Stack
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack
                            gap={isMobile ? "0" : "8px"}
                            direction={isMobile ? "column" : "row"}
                          >
                            <Text
                              type="title"
                              weight="bold"
                              size="large"
                              appearance="gray"
                            >
                              {dataEditProspect.creditProspect.i18n[lang]}
                            </Text>
                            <Text
                              type="title"
                              weight="bold"
                              size="large"
                              appearance="gray"
                            >
                              #{prospectCode}
                            </Text>
                          </Stack>
                          <StyledPrint>
                            <Icon
                              icon={<MdOutlineShare />}
                              appearance="primary"
                              size="20px"
                              cursorHover
                              onClick={generateAndSharePdf}
                            />
                          </StyledPrint>
                        </Stack>
                        <Divider dashed />
                        <StyledPrintContainerHeader>
                          <Stack
                            justifyContent="space-between"
                            alignItems="center"
                            direction={isMobile ? "column" : "row"}
                            gap="16px"
                          >
                            <Stack
                              gap="8px"
                              direction="column"
                              alignItems="center"
                              width="30%"
                            >
                              <Stack gap="8px" width="100%">
                                {isLoading ? (
                                  <SkeletonLine
                                    animated
                                    height="40px"
                                    width="40px"
                                  />
                                ) : (
                                  <Icon
                                    icon={<MdOutlineBeachAccess />}
                                    appearance="dark"
                                    size="28px"
                                  />
                                )}
                                <Stack
                                  direction="column"
                                  alignItems="center"
                                  gap="8px"
                                >
                                  <Stack
                                    direction="column"
                                    alignItems="center"
                                    gap="8px"
                                    width="100%"
                                  >
                                    {isLoading ? (
                                      <SkeletonLine
                                        animated
                                        height="40px"
                                        width="150px"
                                      />
                                    ) : (
                                      <Text type="title" size="large">
                                        {processedData?.destinationName}
                                      </Text>
                                    )}
                                    <Text
                                      type="body"
                                      size="small"
                                      appearance="gray"
                                    >
                                      {dataEditProspect.destination.i18n[lang]}
                                    </Text>
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Stack>
                            <Stack
                              direction="column"
                              alignItems="center"
                              gap="8px"
                              width="40%"
                            >
                              {isLoading ? (
                                <SkeletonLine
                                  animated
                                  height="40px"
                                  width="150px"
                                />
                              ) : (
                                <Text
                                  type="title"
                                  size="large"
                                  textAlign="center"
                                >
                                  {processedData?.mainBorrowerName}
                                </Text>
                              )}
                              <Text type="body" size="small" appearance="gray">
                                {dataEditProspect.customer.i18n[lang]}
                              </Text>
                            </Stack>
                            <Stack
                              direction="column"
                              alignItems="center"
                              gap="8px"
                              width="30%"
                            >
                              <Stack gap="8px">
                                {isLoading ? (
                                  <SkeletonLine
                                    animated
                                    height="40px"
                                    width="150px"
                                  />
                                ) : (
                                  <Text
                                    type="headline"
                                    weight="bold"
                                    size="large"
                                    appearance="primary"
                                  >
                                    {currencyFormat(
                                      dataProspect
                                        ? Number(
                                            dataProspect?.requestedAmount || 0,
                                          )
                                        : 0,
                                    )}
                                  </Text>
                                )}
                              </Stack>
                              <Text type="body" size="small" appearance="gray">
                                {dataEditProspect.value.i18n[lang]}
                              </Text>
                            </Stack>
                          </Stack>
                        </StyledPrintContainerHeader>
                      </Stack>
                    </Fieldset>

                    <StyledScrollPrint>
                      <Fieldset>
                        <CreditProspect
                          isMobile={isMobile}
                          showMenu={() => setShowMenu(false)}
                          showPrint={true}
                          isPrint={true}
                          prospectData={dataProspect!}
                          sentData={sentData}
                          businessManagerCode={businessManagerCode}
                          setSentData={setSentData}
                          setRequestValue={setRequestValue}
                          onProspectUpdate={setProspectData}
                          onProspectUpdated={onProspectUpdated}
                          prospectSummaryData={prospectSummaryData}
                          setProspectSummaryData={setProspectSummaryData}
                          onProspectRefreshData={onProspectUpdated}
                          userAccount={userAccount as string}
                          setShowRequirements={setShowRequirements}
                          validateRequirements={validateRequirements}
                          lang={lang}
                        />
                      </Fieldset>
                    </StyledScrollPrint>

                    <StyledPrint>
                      <Stack
                        gap="10px"
                        justifyContent="end"
                        padding="0 0 16px 0"
                      >
                        <Stack gap="2px">
                          <Button
                            appearance="danger"
                            variant="outlined"
                            disabled={canDeleteCreditRequest}
                            onClick={() => setShowDeleteModal(true)}
                          >
                            {dataEditProspect.delete.i18n[lang]}
                          </Button>
                          <Stack alignItems="center">
                            {canDeleteCreditRequest && (
                              <Icon
                                icon={<MdOutlineInfo />}
                                appearance="primary"
                                size="16px"
                                cursorHover
                                onClick={handleInfo}
                              />
                            )}
                          </Stack>
                        </Stack>
                        <Stack gap="2px" alignItems="center">
                          <Button
                            onClick={handleSubmitClick}
                            disabled={canRequestCredit}
                          >
                            {dataEditProspect.confirm.i18n[lang]}
                          </Button>
                          <Stack alignItems="center">
                            {canRequestCredit && (
                              <Icon
                                icon={<MdOutlineInfo />}
                                appearance="primary"
                                size="16px"
                                cursorHover
                                onClick={handleInfo}
                              />
                            )}
                          </Stack>
                        </Stack>
                      </Stack>
                    </StyledPrint>
                  </Stack>
                  {showMenu && <Stack></Stack>}
                </Stack>
              </StyledMarginPrint>

              {isModalOpen && (
                <BaseModal
                  title={titlesModal.title.i18n[lang]}
                  nextButton={titlesModal.textButtonNext.i18n[lang]}
                  handleNext={() => setIsModalOpen(false)}
                  handleClose={() => setIsModalOpen(false)}
                  width={isMobile ? "290px" : "400px"}
                >
                  <Stack gap="16px" direction="column">
                    <Text weight="bold" size="large">
                      {titlesModal.subTitle.i18n[lang]}
                    </Text>
                    <Stack direction="column" gap="8px">
                      <ul>
                        <li>
                          <Text weight="normal" size="medium" appearance="gray">
                            {titlesModal.titlePrivileges.i18n[lang]}
                          </Text>
                        </li>
                        {dataProspect?.state === "Submitted" && (
                          <li>
                            <Text
                              weight="normal"
                              size="medium"
                              appearance="gray"
                            >
                              {titlesModal.titleSubmitted.i18n[lang]}
                            </Text>
                          </li>
                        )}
                      </ul>
                    </Stack>
                  </Stack>
                </BaseModal>
              )}

              {showCreditRequest && (
                <BaseModal
                  title={titlesModal.title.i18n[lang]}
                  nextButton={titlesModal.textButtonNext.i18n[lang]}
                  handleNext={() => setShowCreditRequest(false)}
                  handleClose={() => setShowCreditRequest(false)}
                  width={isMobile ? "290px" : "400px"}
                >
                  <Text>
                    {titlesModal.titleRequest.i18n[lang] + prospectCode}
                  </Text>
                </BaseModal>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}

      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          isMobile={isMobile}
          message={messageError}
        />
      )}
      {showRequirements && validateRequirements != undefined && (
        <RequirementsModal
          handleClose={() => setShowRequirements(false)}
          isMobile={isMobile}
          isLoading={false}
          validateRequirements={
            validateRequirements || ([] as IValidateRequirement[])
          }
          errorsManager={{
            validateRequirements: validateRequirements?.length === 0,
          }}
          lang={lang}
        />
      )}
      {showRecalculateSimulation && (
        <BaseModal
          title={labelsRecalculateSimulation.title.i18n[lang]}
          handleBack={() => setShowRecalculateSimulation(false)}
          handleNext={handleRecalculateSimulation}
          disabledNext={canEditCreditRequest}
          backButton={labelsRecalculateSimulation.cancel.i18n[lang]}
          nextButton={labelsRecalculateSimulation.recalculate.i18n[lang]}
          width={isMobile ? "300px" : "480px"}
          isLoading={isLoading}
        >
          <Stack direction="column" gap="16px" alignItems="center">
            <Icon
              icon={<MdBolt />}
              appearance="primary"
              spacing="compact"
              size="68px"
            />
            <Text type="body" size="large" appearance="gray">
              {labelsRecalculateSimulation.description.i18n[lang]}
            </Text>
            <Divider dashed={true} />
            <Stack
              direction="column"
              gap="8px"
              padding={"0 0 0 " + (!isMobile ? "0px" : "20px")}
            >
              <li>
                <Text size="large">
                  {labelsRecalculateSimulation.list.itemOne.i18n[lang]}
                </Text>
              </li>
            </Stack>
          </Stack>
        </BaseModal>
      )}
      {showDeleteModal && (
        <BaseModal
          title={dataEditProspect.deleteTitle.i18n[lang]}
          handleBack={() => setShowDeleteModal(false)}
          handleNext={handleDeleteProspect}
          disabledNext={canEditCreditRequest}
          backButton={dataEditProspect.backButton.i18n[lang]}
          nextButton={dataEditProspect.nextButton.i18n[lang]}
          apparenceNext="danger"
          width={isMobile ? "300px" : "500px"}
          isLoading={isLoadingDelete}
        >
          <Text>{dataEditProspect.deleteDescription.i18n[lang]}</Text>
        </BaseModal>
      )}
    </div>
  );
}

export type { SimulationsUIProps, ProcessedData };
