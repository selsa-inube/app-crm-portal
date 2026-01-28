import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdArrowBack, MdOutlineInfo } from "react-icons/md";
import {
  Breadcrumbs,
  Button,
  Icon,
  Input,
  Stack,
  Tag,
  Text,
  Textarea,
  useMediaQuery,
  Grid,
  SkeletonLine,
  useFlag,
} from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { checkSimulationPrerequisites } from "@services/prospect/checkSimulationPrerequisites";
import { Fieldset } from "@components/data/Fieldset";
import { getProspectsByCustomerCode } from "@services/prospect/SearchAllProspectsByCustomerCode";
import { cancelProspect } from "@services/prospect/cancelProspect";
import { AppContext } from "@context/AppContext";
import { IProspect } from "@services/prospect/types";
import { MoneyDestinationTranslations } from "@services/enum/icorebanking-vi-crediboard/moneyDestination";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";
import { updateProspect } from "@services/prospect/updateProspect";
import { ErrorModal } from "@components/modals/ErrorModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { privilegeCrm } from "@config/privilege";
import { useEnum } from "@hooks/useEnum/useEnum";
import userImage from "@assets/images/userImage.jpeg";
import { validatePrerequisitesForCreditApplication } from "@services/prospect/validatePrerequisitesForCreditApplication";

import {
  addConfig,
  dataCreditProspects,
  amountLineOnSkeletons,
  amountContainerOnSkeletons,
  notFound,
} from "./config";
import { StyledArrowBack } from "./styles";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import { CardCreditProspect } from "./components/CardCreditProspect";
import InfoModal from "../prospect/components/InfoModal";
import { StyledContainer } from "./components/CardCreditProspect/styles";

export function CreditProspects() {
  const isMobile = useMediaQuery("(max-width:880px)");
  const { addFlag } = useFlag();

  const { customerData } = useContext(CustomerContext);
  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
    image: customerData.image,
  };

  const { lang } = useEnum();

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const [prospectSummaryData, setProspectSummaryData] = useState<IProspect[]>(
    [],
  );
  const [isLoading, setLoading] = useState(true);
  const [isLoadingConfirm, setLoadingConfirm] = useState(false);
  const [isLoadingComments, setLoadingComments] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditMessageModal, setShowEditMessageModal] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);
  const [canPerformSimulations, setCanPerformSimulations] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<IProspect | null>(
    null,
  );

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [commentsByProspectId, setCommentsByProspectId] = useState<
    Record<string, string>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const navigate = useNavigate();

  const handleDeleteProspect = async () => {
    if (!selectedProspect) return;

    try {
      setIsLoadingDelete(true);

      await cancelProspect(
        businessUnitPublicCode,
        businessManagerCode,
        {
          cancelProspectsRequest: [
            {
              prospectId: selectedProspect.prospectId,
              prospectCode: selectedProspect.prospectCode,
              clientIdentificationNumber: customerData.publicCode,
            },
          ],
        },
        eventData.token,
      );

      setProspectSummaryData((prev) =>
        prev.filter(
          (prospect) => prospect.prospectId !== selectedProspect.prospectId,
        ),
      );

      setIsLoadingDelete(false);
      setShowDeleteModal(false);
      setSelectedProspect(null);
      addFlag({
        title: dataCreditProspects.titleFlagDelete.i18n[lang],
        description: dataCreditProspects.descriptionFlagDelete.i18n[lang],
        appearance: "success",
        duration: 5000,
      });
    } catch (error) {
      setIsLoadingDelete(false);
      setErrorModalMessage(
        dataCreditProspects.errorRemoveProspect.i18n[lang] ||
          "Hubo un error al eliminar el prospecto.",
      );
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await getProspectsByCustomerCode(
          businessUnitPublicCode,
          businessManagerCode,
          customerData.publicCode,
          "Created",
          eventData.token,
        );

        if (result && result.length > 0) {
          if (Array.isArray(result)) {
            setProspectSummaryData(result);
          } else {
            setProspectSummaryData([result]);
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (customerData?.publicCode && businessUnitPublicCode) {
      fetchData();
    }
  }, [businessUnitPublicCode, customerData?.publicCode]);

  useEffect(() => {
    const checkIfClientCanSimulate = async () => {
      try {
        setIsLoadingCheck(true);

        const data = await checkSimulationPrerequisites(
          businessUnitPublicCode,
          customerData.publicCode,
          eventData.token,
        );

        if (data?.canSimulate === "Y") setCanPerformSimulations(true);
      } catch (error) {
        setShowErrorModal(true);
        setErrorModalMessage(
          `${dataCreditProspects.errorCheckIfSimulationIsAllowed.i18n[lang]}`,
        );
      } finally {
        setIsLoadingCheck(false);
      }
    };

    checkIfClientCanSimulate();
  }, []);

  const handleCloseModalNotExistProspect = () => {
    setShowErrorModal(false);
    navigate("/credit");
  };

  const filteredProspects = prospectSummaryData.filter((prospect) => {
    const borrowerName =
      prospect.borrowers[0]?.borrowerName?.toLowerCase() || "";
    const prospectCode = prospect.prospectCode?.toLowerCase() || "";
    const creationDate = prospect.timeOfCreation
      ? new Date(prospect.timeOfCreation)
          .toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .toLowerCase()
      : "";
    const requestedAmount = String(
      prospect.requestedAmount || "",
    ).toLowerCase();
    const term = searchTerm.toLowerCase();

    return (
      borrowerName.includes(term) ||
      prospectCode.includes(term) ||
      creationDate.includes(term) ||
      requestedAmount.includes(term)
    );
  });

  const handleClientCommentsUpdate = async () => {
    if (!selectedProspect) return;

    const updatedComment =
      commentsByProspectId[selectedProspect.prospectId] || "";

    const updatedProspect = {
      ...selectedProspect,
      clientComments: updatedComment,
    };

    try {
      setLoadingComments(true);

      const result = await updateProspect(
        businessUnitPublicCode,
        businessManagerCode,
        updatedProspect,
        eventData.token,
      );

      setProspectSummaryData((prev) =>
        prev.map((prospect) =>
          prospect.prospectId === selectedProspect.prospectId
            ? { ...prospect, clientComments: updatedComment }
            : prospect,
        ),
      );

      setShowEditMessageModal(false);
      setShowMessageModal(false);
      setSelectedProspect(result || updatedProspect);
      setLoadingComments(false);
      addFlag({
        title: dataCreditProspects.titleFlagComment.i18n[lang],
        description: dataCreditProspects.descriptionFlagComment.i18n[lang],
        appearance: "success",
        duration: 5000,
      });
    } catch (error) {
      setLoadingComments(false);
      setShowErrorModal(true);
      setErrorModalMessage(dataCreditProspects.errorObservations.i18n[lang]);
    }
  };
  const { disabledButton: canSimulateCredit } = useValidateUseCase({
    useCase: getUseCaseValue("canSimulateCredit"),
  });
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmProspect = async () => {
    if (!selectedProspect) return;

    try {
      setLoadingConfirm(true);

      const validationResult = await validatePrerequisitesForCreditApplication(
        businessUnitPublicCode,
        selectedProspect.prospectCode,
        eventData.token,
      );

      if (
        !validationResult ||
        validationResult.isCreditSetupCompleteForCreditRequest === "N"
      ) {
        setShowConfirmModal(false);
        setErrorModalMessage(
          dataCreditProspects.prerequisitesNotMet.i18n[lang],
        );
        setShowErrorModal(true);
        setLoadingConfirm(false);
        return;
      }
      navigate(`/credit/apply-for-credit/${selectedProspect.prospectCode}`);
    } catch (error) {
      setShowConfirmModal(false);
      setErrorModalMessage(
        dataCreditProspects.errorValidatePrerequisites.i18n[lang],
      );
      setShowErrorModal(true);
    } finally {
      setLoadingConfirm(false);
    }
  };

  const simulationIsDisabled = canSimulateCredit || !canPerformSimulations;

  return (
    <>
      <Stack
        margin={`20px auto ${isMobile ? "100px" : "50px"} auto`}
        width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
        direction="column"
        gap="24px"
      >
        <GeneralHeader
          buttonText="Agregar vinculación"
          descriptionStatus={dataHeader.status}
          name={dataHeader.name}
          profileImageUrl={dataHeader.image || userImage}
        />
        <Breadcrumbs
          crumbs={addConfig.crumbs.map((crumb) => ({
            ...crumb,
            label: crumb.label.i18n[lang],
          }))}
        />
        <StyledArrowBack
          $isMobile={isMobile}
          onClick={() => navigate(addConfig.route)}
        >
          <Stack gap="8px" alignItems="center" width="100%">
            <Icon icon={<MdArrowBack />} appearance="dark" size="20px" />
            <Text type="title" size={isMobile ? "small" : "large"}>
              {addConfig.title.i18n[lang]}
            </Text>
          </Stack>
        </StyledArrowBack>
        <Fieldset>
          <Stack direction="column" gap="20px" padding="8px 16px">
            <Stack
              justifyContent="space-between"
              alignItems="center"
              direction={isMobile ? "column" : "row"}
              gap="8px"
            >
              <Input
                id="keyWord"
                label={dataCreditProspects.search.i18n[lang]}
                placeholder={dataCreditProspects.keyWord.i18n[lang]}
                type="search"
                fullwidth={isMobile}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <Grid
                templateColumns={canSimulateCredit ? "95% 4%" : "100%"}
                gap="8px"
                alignItems="center"
                width={isMobile ? "100%" : "auto"}
                justifyItems={isMobile ? "inherit" : "flex-end"}
              >
                {isLoadingCheck ? (
                  <SkeletonLine width="155px" height="40px" animated />
                ) : (
                  <Stack
                    gap="8px"
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                  >
                    <Button
                      iconBefore={<MdAdd />}
                      type="link"
                      path="../simulate-credit"
                      fullwidth={isMobile}
                      disabled={
                        simulationIsDisabled ||
                        customerData.generalAssociateAttributes[0]
                          .partnerStatus !== "A-Activo"
                      }
                    >
                      {dataCreditProspects.simulate.i18n[lang]}
                    </Button>
                    {simulationIsDisabled && (
                      <Icon
                        icon={<MdOutlineInfo />}
                        appearance="primary"
                        size="16px"
                        cursorHover
                        onClick={handleInfo}
                      />
                    )}
                  </Stack>
                )}
              </Grid>
            </Stack>
            <Stack
              wrap="wrap"
              gap="20px"
              justifyContent={isMobile ? "center" : "flex-start"}
            >
              {!isLoading &&
                filteredProspects.map((prospect) => (
                  <CardCreditProspect
                    key={prospect.prospectId}
                    title={
                      MoneyDestinationTranslations.find(
                        (item) =>
                          item.Code ===
                          prospect.moneyDestinationAbbreviatedName,
                      )?.Code || prospect.moneyDestinationAbbreviatedName
                    }
                    borrower={
                      prospect.clientManagerName ||
                      dataCreditProspects.none.i18n[lang]
                    }
                    numProspect={prospect.prospectCode}
                    date={prospect.timeOfCreation}
                    value={prospect.requestedAmount}
                    iconTitle={
                      MoneyDestinationTranslations.find(
                        (item) =>
                          item.Code ===
                          prospect.moneyDestinationAbbreviatedName,
                      )?.Value || "DM_ENUM_EMONEYDESTINATION"
                    }
                    isMobile={isMobile}
                    hasMessage={true}
                    handleMessage={() => {
                      setSelectedProspect(prospect);
                      setShowMessageModal(true);
                    }}
                    handleSend={() => {
                      setShowConfirmModal(true);
                      setSelectedProspect(prospect);
                    }}
                    handleEdit={() =>
                      navigate(`/credit/prospects/${prospect.prospectCode}`)
                    }
                    handleDelete={() => {
                      setSelectedProspect(prospect);
                      setShowDeleteModal(true);
                    }}
                    lang={lang}
                  />
                ))}

              {!isLoading && filteredProspects.length === 0 && (
                <Stack
                  height="30%"
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  alignContent="center"
                >
                  <Text type="title" size="small" textAlign="center">
                    {notFound}
                  </Text>
                </Stack>
              )}
              {isLoading && (
                <>
                  {Array(amountContainerOnSkeletons)
                    .fill(0)
                    .map((_, indexContainer) => (
                      <StyledContainer key={indexContainer} display>
                        <Stack
                          direction="row"
                          padding="10px 16px"
                          gap="12px"
                          margin="10px 0 0 0"
                        >
                          <SkeletonLine width="90%" height="40px" animated />
                          <SkeletonLine height="40px" width="25%" animated />
                        </Stack>
                        {Array(amountLineOnSkeletons)
                          .fill(0)
                          .map((_, index) => (
                            <Stack
                              key={index}
                              direction="column"
                              padding="10px 16px"
                              gap="12px"
                            >
                              <SkeletonLine
                                width="100%"
                                height="20px"
                                animated
                              />
                            </Stack>
                          ))}
                      </StyledContainer>
                    ))}
                </>
              )}
            </Stack>
          </Stack>
        </Fieldset>
        {showMessageModal && (
          <BaseModal
            title={dataCreditProspects.messageTitle.i18n[lang]}
            handleClose={() => setShowMessageModal(false)}
            handleNext={() => {
              if (selectedProspect) {
                setCommentsByProspectId((prev) => ({
                  ...prev,
                  [selectedProspect.prospectId]:
                    selectedProspect.clientComments || "",
                }));
              }
              setShowEditMessageModal(true);
              setShowMessageModal(false);
            }}
            nextButton={dataCreditProspects.modify.i18n[lang]}
            disabledNext={canEditCreditRequest}
            iconAfterNext={
              canEditCreditRequest ? (
                <Icon
                  icon={<MdOutlineInfo />}
                  appearance="primary"
                  size="16px"
                  cursorHover
                  onClick={handleInfo}
                />
              ) : undefined
            }
            backButton={dataCreditProspects.close.i18n[lang]}
            width={isMobile ? "300px" : "500px"}
            isLoading={isLoadingComments}
          >
            <Stack direction="column" gap="16px">
              <CardGray
                label={dataCreditProspects.moneyDesination.i18n[lang]}
                placeHolder={
                  <Tag
                    label={
                      MoneyDestinationTranslations.find(
                        (item) =>
                          item.Code ===
                          selectedProspect?.moneyDestinationAbbreviatedName,
                      )?.Code ||
                      selectedProspect?.moneyDestinationAbbreviatedName ||
                      ""
                    }
                    appearance="gray"
                  />
                }
                appearancePlaceHolder="gray"
                placeHolderTag={true}
              />
              <CardGray
                label={dataCreditProspects.preApproval.i18n[lang]}
                placeHolder={
                  selectedProspect?.clientManagerObservation ||
                  dataCreditProspects.notHaveComments.i18n[lang]
                }
                appearancePlaceHolder="gray"
              />
              <CardGray
                label={dataCreditProspects.clientComments.i18n[lang]}
                placeHolder={
                  commentsByProspectId[selectedProspect?.prospectId || ""] ||
                  selectedProspect?.clientComments ||
                  dataCreditProspects.notHaveObservations.i18n[lang]
                }
                appearancePlaceHolder="gray"
              />
            </Stack>
          </BaseModal>
        )}
        {showEditMessageModal && (
          <BaseModal
            title={dataCreditProspects.messageTitle.i18n[lang]}
            handleClose={() => setShowEditMessageModal(false)}
            handleNext={handleClientCommentsUpdate}
            nextButton={dataCreditProspects.modify.i18n[lang]}
            backButton={dataCreditProspects.close.i18n[lang]}
            width={isMobile ? "300px" : "500px"}
            isLoading={isLoadingComments}
          >
            <Textarea
              id="comments"
              label={dataCreditProspects.preanalysis.i18n[lang]}
              value={
                commentsByProspectId[selectedProspect?.prospectId || ""] || ""
              }
              onChange={(e) =>
                setCommentsByProspectId((prev) => ({
                  ...prev,
                  [selectedProspect?.prospectId || ""]: e.target.value,
                }))
              }
              maxLength={120}
            />
          </BaseModal>
        )}
        {showConfirmModal && (
          <BaseModal
            title={dataCreditProspects.confirmTitle.i18n[lang]}
            handleBack={() => setShowConfirmModal(false)}
            handleNext={handleConfirmProspect}
            backButton={dataCreditProspects.cancel.i18n[lang]}
            nextButton={dataCreditProspects.confirm.i18n[lang]}
            width={isMobile ? "300px" : "500px"}
            isLoading={isLoadingConfirm}
          >
            <Text>{dataCreditProspects.confirmDescription.i18n[lang]}</Text>
          </BaseModal>
        )}
        {showDeleteModal && (
          <BaseModal
            title={dataCreditProspects.deleteTitle.i18n[lang]}
            handleBack={() => setShowDeleteModal(false)}
            handleNext={handleDeleteProspect}
            backButton={dataCreditProspects.cancel.i18n[lang]}
            nextButton={dataCreditProspects.titleFlagDelete.i18n[lang]}
            apparenceNext="danger"
            width={isMobile ? "300px" : "500px"}
            isLoading={isLoadingDelete}
          >
            <Text>{dataCreditProspects.deleteDescription.i18n[lang]}</Text>
          </BaseModal>
        )}
      </Stack>
      {showErrorModal && (
        <ErrorModal
          handleClose={handleCloseModalNotExistProspect}
          isMobile={isMobile}
          message={errorModalMessage}
        />
      )}

      {isModalOpen ? (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrm.title}
          subtitle={privilegeCrm.subtitle}
          description={
            !canPerformSimulations
              ? dataCreditProspects.requirementsNotMet.i18n[lang]
              : privilegeCrm.description
          }
          nextButtonText={privilegeCrm.nextButtonText}
          isMobile={isMobile}
        />
      ) : (
        <></>
      )}
    </>
  );
}
