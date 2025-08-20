import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdArrowBack } from "react-icons/md";
import {
  Breadcrumbs,
  Button,
  Icon,
  Input,
  Stack,
  Tag,
  Text,
  useFlag,
  useMediaQuery,
} from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { Fieldset } from "@components/data/Fieldset";
import { getProspectsByCustomerCode } from "@services/prospect/SearchAllProspectsByCustomerCode";
import { AppContext } from "@context/AppContext";
import { IProspect } from "@services/prospect/types";
import { MoneyDestinationTranslations } from "@services/enum/icorebanking-vi-crediboard/moneyDestination";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";

import { addConfig, dataCreditProspects } from "./config";
import { StyledArrowBack } from "./styles";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import { CardCreditProspect } from "./components/CardCreditProspect";

export function CreditProspects() {
  const isMobile = useMediaQuery("(max-width:880px)");

  const { customerData } = useContext(CustomerContext);
  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };
  const { addFlag } = useFlag();
  const { businessUnitSigla } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [prospectSummaryData, setProspectSummaryData] = useState<IProspect[]>(
    [],
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<IProspect | null>(
    null,
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProspectsByCustomerCode(
          businessUnitPublicCode,
          customerData.publicCode,
        );
        if (result) {
          if (Array.isArray(result)) {
            setProspectSummaryData(result);
          } else {
            setProspectSummaryData([result]);
          }
        }
      } catch (error: unknown) {
        const err = error as {
          message?: string;
          status?: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + (err?.message || "") + (err?.data?.description || "");

        addFlag({
          title: "Error al cargar datos",
          description,
          appearance: "danger",
          duration: 5000,
        });
        setProspectSummaryData([]);
      }
    };
    if (customerData?.publicCode && businessUnitPublicCode) {
      fetchData();
    }
  }, [businessUnitPublicCode, customerData?.publicCode]);

  return (
    <Stack
      margin="20px auto"
      width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
      direction="column"
      gap="24px"
    >
      <GeneralHeader
        buttonText="Agregar vinculación"
        descriptionStatus={dataHeader.status}
        name={dataHeader.name}
        profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
      />
      <Breadcrumbs crumbs={addConfig.crumbs} />
      <StyledArrowBack $isMobile={isMobile}>
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
            />
            <Button
              iconBefore={<MdAdd />}
              type="link"
              path="../simulate-credit"
              fullwidth={isMobile}
            >
              {dataCreditProspects.simulate}
            </Button>
          </Stack>
          <Stack
            wrap="wrap"
            gap="20px"
            justifyContent={isMobile ? "center" : "flex-start"}
          >
            {prospectSummaryData.map((prospect) => (
              <CardCreditProspect
                key={prospect.prospectId}
                title={
                  MoneyDestinationTranslations.find(
                    (item) =>
                      item.Code === prospect.moneyDestinationAbbreviatedName,
                  )?.Name || prospect.moneyDestinationAbbreviatedName
                }
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
                handleSend={() => setShowConfirmModal(true)}
                handleEdit={() =>
                  navigate(`/credit/prospects/${prospect.prospectCode}`)
                }
                handleDelete={() => setShowDeleteModal(true)}
              />
            ))}
          </Stack>
        </Stack>
      </Fieldset>
      {showMessageModal && (
        <BaseModal
          title={dataCreditProspects.messageTitle}
          handleClose={() => setShowMessageModal(false)}
          handleNext={() => setShowMessageModal(false)}
          nextButton={dataCreditProspects.understand}
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
                    )?.Name ||
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
              label={dataCreditProspects.observationProspect}
              placeHolder={
                selectedProspect?.selectedRegularPaymentSchedule || ""
              }
              apparencePlaceHolder="gray"
            />
          </Stack>
        </BaseModal>
      )}
      {showConfirmModal && (
        <BaseModal
          title={dataCreditProspects.confirmTitle}
          handleBack={() => setShowConfirmModal(false)}
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
          backButton="Cancelar"
          nextButton="Eliminar"
          apparenceNext="danger"
          width={isMobile ? "300px" : "500px"}
        >
          <Text>{dataCreditProspects.deleteDescription}</Text>
        </BaseModal>
      )}
    </Stack>
  );
}
