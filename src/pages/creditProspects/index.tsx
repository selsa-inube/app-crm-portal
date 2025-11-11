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
} from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { Fieldset } from "@components/data/Fieldset";
import { getProspectsByCustomerCode } from "@services/prospect/SearchAllProspectsByCustomerCode";
import { ErrorSearchAllProspectsByCustomerCode } from "@services/prospect/SearchAllProspectsByCustomerCode/ErrorSearchAllProspectsByCustomerCode";
import { RemoveProspect } from "@services/prospect/removeProspect";
import { AppContext } from "@context/AppContext";
import { IProspect } from "@services/prospect/types";
import { MoneyDestinationTranslations } from "@services/enum/icorebanking-vi-crediboard/moneyDestination";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";
import { updateProspect } from "@services/prospect/updateProspect";
import { ErrorModal } from "@components/modals/ErrorModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { privilegeCrm } from "@config/privilege";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import userImage from "@assets/images/userImage.jpeg";

import { addConfig, dataCreditProspects } from "./config";
import { StyledArrowBack } from "./styles";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import { CardCreditProspect } from "./components/CardCreditProspect";
import InfoModal from "../prospect/components/InfoModal";

export function CreditProspects() {
  const isMobile = useMediaQuery("(max-width:880px)");

  const { customerData } = useContext(CustomerContext);
  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
    image: customerData.image,
  };

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const [prospectSummaryData, setProspectSummaryData] = useState<IProspect[]>(
    [],
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditMessageModal, setShowEditMessageModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<IProspect | null>(
    null,
  );

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [commentsByProspectId, setCommentsByProspectId] = useState<
    Record<string, string>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [messageSearchResults, setMessageSearchResults] = useState("");

  const navigate = useNavigate();

  const handleDeleteProspect = async () => {
    if (!selectedProspect) return;

    try {
      await RemoveProspect(businessUnitPublicCode, businessManagerCode, {
        removeProspectsRequest: [
          {
            prospectId: selectedProspect.prospectId,
          },
        ],
      });

      setProspectSummaryData((prev) =>
        prev.filter(
          (prospect) => prospect.prospectId !== selectedProspect.prospectId,
        ),
      );

      setShowDeleteModal(false);
      setSelectedProspect(null);
    } catch (error) {
      setErrorModalMessage(
        dataCreditProspects.errorRemoveProspect ||
          "Hubo un error al eliminar el prospecto.",
      );
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProspectsByCustomerCode(
          businessUnitPublicCode,
          businessManagerCode,
          customerData.publicCode,
        );
        if (result && result.length > 0) {
          if (Array.isArray(result)) {
            setProspectSummaryData(result);
          } else {
            setProspectSummaryData([result]);
          }
        }
      } catch (error) {
        setMessageSearchResults(
          ErrorSearchAllProspectsByCustomerCode.NoHaveProspectsAvailable,
        );
      }
    };
    if (customerData?.publicCode && businessUnitPublicCode) {
      fetchData();
    }
  }, [businessUnitPublicCode, customerData?.publicCode]);

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
      const result = await updateProspect(
        businessUnitPublicCode,
        businessManagerCode,
        updatedProspect,
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
    } catch (error) {
      setShowErrorModal(true);
      setErrorModalMessage(dataCreditProspects.errorObservations);
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

  const handleConfirmProspect = () => {
    navigate(`/credit/apply-for-credit/${selectedProspect?.prospectCode}`);
  };
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
        <Breadcrumbs crumbs={addConfig.crumbs} />
        <StyledArrowBack
          $isMobile={isMobile}
          onClick={() => navigate(addConfig.route)}
        >
          <Stack gap="8px" alignItems="center" width="100%">
            <Icon icon={<MdArrowBack />} appearance="dark" size="20px" />
            <Text type="title" size={isMobile ? "small" : "large"}>
              {addConfig.title}
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
                label="Buscar"
                placeholder={dataCreditProspects.keyWord}
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
                <Button
                  iconBefore={<MdAdd />}
                  type="link"
                  path="../simulate-credit"
                  fullwidth={isMobile}
                  disabled={
                    canSimulateCredit ||
                    customerData.generalAssociateAttributes[0].partnerStatus !==
                      "A-Activo"
                  }
                >
                  {dataCreditProspects.simulate}
                </Button>
                {canSimulateCredit && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                )}
              </Grid>
            </Stack>
            <Stack
              wrap="wrap"
              gap="20px"
              justifyContent={isMobile ? "center" : "flex-start"}
            >
              {messageSearchResults ==
                ErrorSearchAllProspectsByCustomerCode.NoHaveProspectsAvailable && (
                <Text type="title" size="small">
                  {messageSearchResults}
                </Text>
              )}
              {filteredProspects.map((prospect) => (
                <CardCreditProspect
                  key={prospect.prospectId}
                  title={truncateTextToMaxLength(
                    MoneyDestinationTranslations.find(
                      (item) =>
                        item.Code === prospect.moneyDestinationAbbreviatedName,
                    )?.Code || prospect.moneyDestinationAbbreviatedName,
                    20,
                  )}
                  borrower={prospect.borrowers[0].borrowerName}
                  numProspect={prospect.prospectCode}
                  date={prospect.timeOfCreation}
                  value={prospect.requestedAmount}
                  iconTitle={
                    MoneyDestinationTranslations.find(
                      (item) =>
                        item.Code === prospect.moneyDestinationAbbreviatedName,
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
                />
              ))}
            </Stack>
          </Stack>
        </Fieldset>
        {showMessageModal && (
          <BaseModal
            title={dataCreditProspects.messageTitle}
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
            nextButton={dataCreditProspects.modify}
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
            backButton={dataCreditProspects.close}
            width={isMobile ? "300px" : "500px"}
          >
            <Stack direction="column" gap="16px">
              <CardGray
                label={dataCreditProspects.moneyDesination}
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
                apparencePlaceHolder="gray"
                placeHolderTag={true}
              />
              <CardGray
                label={dataCreditProspects.clientComments}
                placeHolder={
                  commentsByProspectId[selectedProspect?.prospectId || ""] ||
                  selectedProspect?.clientComments ||
                  ""
                }
                apparencePlaceHolder="gray"
              />
            </Stack>
          </BaseModal>
        )}
        {showEditMessageModal && (
          <BaseModal
            title={dataCreditProspects.messageTitle}
            handleClose={() => setShowEditMessageModal(false)}
            handleNext={handleClientCommentsUpdate}
            nextButton={dataCreditProspects.modify}
            backButton={dataCreditProspects.close}
            width={isMobile ? "300px" : "500px"}
          >
            <Textarea
              id="comments"
              label={dataCreditProspects.preanalysis}
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
            title={dataCreditProspects.confirmTitle}
            handleBack={() => setShowConfirmModal(false)}
            handleNext={handleConfirmProspect}
            backButton="Cancelar"
            nextButton="Confirmar"
            width={isMobile ? "300px" : "500px"}
          >
            <Text>{dataCreditProspects.confirmDescription}</Text>
          </BaseModal>
        )}
        {showDeleteModal && (
          <BaseModal
            title={dataCreditProspects.deleteTitle}
            handleBack={() => setShowDeleteModal(false)}
            handleNext={handleDeleteProspect}
            backButton="Cancelar"
            nextButton="Eliminar"
            apparenceNext="danger"
            width={isMobile ? "300px" : "500px"}
          >
            <Text>{dataCreditProspects.deleteDescription}</Text>
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
          description={privilegeCrm.description}
          nextButtonText={privilegeCrm.nextButtonText}
          isMobile={isMobile}
        />
      ) : (
        <></>
      )}
    </>
  );
}
