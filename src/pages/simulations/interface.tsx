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
import {
  IProspect,
  IExtraordinaryInstallments,
} from "@services/prospect/types";
import { IPaymentChannel } from "@services/creditRequest/types";
import { currencyFormat } from "@utils/formatData/currency";
import { MoneyDestinationTranslations } from "@services/enum/icorebanking-vi-crediboard/moneyDestination";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
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
  showRestoreSimulation: boolean;
  setShowRestoreSimulation: React.Dispatch<React.SetStateAction<boolean>>;
  handleRestoreSimulation: () => void;
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
    data,
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
    showRestoreSimulation,
    setShowRestoreSimulation,
    handleRestoreSimulation,
    showRequirements,
    setShowRequirements,
    validateRequirements,
  } = props;

  const getDestinationName = (code?: string) => {
    if (!code) return "";
    const found = MoneyDestinationTranslations.find(
      (item) => item.Code === code,
    );
    return found?.Code || code;
  };
  const { disabledButton: canRequestCredit } = useValidateUseCase({
    useCase: getUseCaseValue("canRequestCredit"),
  });
  const { disabledButton: canDeleteCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canDeleteCreditRequest"),
  });
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });

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
                  profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
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
                  <Stack direction="row-reverse" width="100%">
                    <Button
                      width="189px"
                      iconBefore={<MdBolt />}
                      children={labelsRecalculateSimulation.button}
                      variant="outlined"
                      spacing="compact"
                      onClick={() => setShowRestoreSimulation(true)}
                    ></Button>
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
                              onClick={() => generateAndSharePdf()}
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
                          >
                            <Stack gap="8px">
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
                                >
                                  <Text type="title" size="large">
                                    {getDestinationName(
                                      data?.moneyDestinationAbbreviatedName,
                                    )}
                                  </Text>
                                </Stack>
                              </Stack>
                            </Stack>
                            <Text type="body" size="small" appearance="gray">
                              {dataEditProspect.destination}
                            </Text>
                          </Stack>
                          <Stack
                            direction="column"
                            alignItems="center"
                            gap="8px"
                          >
                            <Text type="title" size="large" textAlign="center">
                              {
                                data?.borrowers.find(
                                  (b) => b.borrowerType === "MainBorrower",
                                )?.borrowerName
                              }
                            </Text>
                            <Text type="body" size="small" appearance="gray">
                              Cliente
                            </Text>
                          </Stack>
                          <Stack
                            direction="column"
                            alignItems="center"
                            gap="8px"
                          >
                            <Stack gap="8px">
                              <Text
                                type="headline"
                                weight="bold"
                                size="large"
                                appearance="primary"
                              ></Text>
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
                <>
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
                          {
                            <li>
                              <Text
                                weight="normal"
                                size="medium"
                                appearance="gray"
                              >
                                {titlesModal.titlePrivileges}
                              </Text>
                            </li>
                          }
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
                </>
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
      {showRestoreSimulation && (
        <BaseModal
          title={labelsRecalculateSimulation.title}
          handleBack={() => setShowRestoreSimulation(false)}
          handleNext={handleRestoreSimulation}
          disabledNext={canEditCreditRequest}
          backButton={labelsRecalculateSimulation.cancel}
          nextButton={labelsRecalculateSimulation.restore}
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
