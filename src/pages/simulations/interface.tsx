import {
  Breadcrumbs,
  Button,
  Divider,
  Icon,
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

import { RequirementsModal } from "../prospect/components/modals/RequirementsModal";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import { CreditProspect } from "../prospect/components/CreditProspect";
import {
  StyledArrowBack,
  StyledMarginPrint,
  StyledPrint,
  StyledScrollPrint,
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
}

export function SimulationsUI(props: SimulationsUIProps) {
  const {
    dataHeader,
    isMobile,
    prospectCode,
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
                    ...addConfig.crumbs.slice(0, 3),
                    {
                      path: `/credit/prospects/${prospectCode}`,
                      label: `Prospecto #${prospectCode}`,
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
                        {addConfig.title}
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
                          isMobile ? "" : labelsRecalculateSimulation.button
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
                              {dataEditProspect.creditProspect}
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
                              <Icon
                                icon={<MdOutlineBeachAccess />}
                                appearance="dark"
                                size="28px"
                              />
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
                                  <Text type="title" size="large">
                                    {processedData.destinationName}
                                  </Text>
                                  <Text
                                    type="body"
                                    size="small"
                                    appearance="gray"
                                  >
                                    {dataEditProspect.destination}
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
                            <Text type="title" size="large" textAlign="center">
                              {processedData.mainBorrowerName}
                            </Text>
                            <Text type="body" size="small" appearance="gray">
                              Cliente
                            </Text>
                          </Stack>
                          <Stack
                            direction="column"
                            alignItems="center"
                            gap="8px"
                            width="30%"
                          >
                            <Stack gap="8px">
                              <Text
                                type="headline"
                                weight="bold"
                                size="large"
                                appearance="primary"
                              >
                                {currencyFormat(
                                  prospectSummaryData?.netAmountToDisburse || 0,
                                )}
                              </Text>
                            </Stack>
                            <Text type="body" size="small" appearance="gray">
                              {dataEditProspect.value}
                            </Text>
                          </Stack>
                        </Stack>
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
                          setShowRequirements={setShowRequirements}
                          validateRequirements={validateRequirements}
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
                            {dataEditProspect.delete}
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
                            {dataEditProspect.confirm}
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
                  title={titlesModal.title}
                  nextButton={titlesModal.textButtonNext}
                  handleNext={() => setIsModalOpen(false)}
                  handleClose={() => setIsModalOpen(false)}
                  width={isMobile ? "290px" : "400px"}
                >
                  <Stack gap="16px" direction="column">
                    <Text weight="bold" size="large">
                      {titlesModal.subTitle}
                    </Text>
                    <Stack direction="column" gap="8px">
                      <ul>
                        <li>
                          <Text weight="normal" size="medium" appearance="gray">
                            {titlesModal.titlePrivileges}
                          </Text>
                        </li>
                        {dataProspect?.state === "Submitted" && (
                          <li>
                            <Text
                              weight="normal"
                              size="medium"
                              appearance="gray"
                            >
                              {titlesModal.titleSubmitted}
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
                  title={titlesModal.title}
                  nextButton={titlesModal.textButtonNext}
                  handleNext={() => setShowCreditRequest(false)}
                  handleClose={() => setShowCreditRequest(false)}
                  width={isMobile ? "290px" : "400px"}
                >
                  <Text>{titlesModal.titleRequest + prospectCode}</Text>
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
            validateRequirements: validateRequirements?.length > 0,
          }}
        />
      )}
      {showRecalculateSimulation && (
        <BaseModal
          title={labelsRecalculateSimulation.title}
          handleBack={() => setShowRecalculateSimulation(false)}
          handleNext={handleRecalculateSimulation}
          disabledNext={canEditCreditRequest}
          backButton={labelsRecalculateSimulation.cancel}
          nextButton={labelsRecalculateSimulation.recalculate}
          width={isMobile ? "300px" : "480px"}
        >
          <Stack direction="column" gap="16px" alignItems="center">
            <Icon
              icon={<MdBolt />}
              appearance="primary"
              spacing="compact"
              size="68px"
            />
            <Text type="body" size="large" appearance="gray">
              {labelsRecalculateSimulation.description}
            </Text>
            <Divider dashed={true} />
            <Stack
              direction="column"
              gap="8px"
              padding={"0 0 0 " + (!isMobile ? "0px" : "20px")}
            >
              <li>
                <Text size="large">
                  {labelsRecalculateSimulation.list.itemOne}
                </Text>
              </li>
            </Stack>
          </Stack>
        </BaseModal>
      )}
      {showDeleteModal && (
        <BaseModal
          title={dataEditProspect.deleteTitle}
          handleBack={() => setShowDeleteModal(false)}
          handleNext={handleDeleteProspect}
          disabledNext={canEditCreditRequest}
          backButton={dataEditProspect.backButton}
          nextButton={dataEditProspect.nextButton}
          apparenceNext="danger"
          width={isMobile ? "300px" : "500px"}
        >
          <Text>{dataEditProspect.deleteDescription}</Text>
        </BaseModal>
      )}
    </div>
  );
}

export type { SimulationsUIProps, ProcessedData };
