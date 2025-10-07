import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import {
  Breadcrumbs,
  Icon,
  Input,
  Stack,
  Text,
  useMediaQuery,
} from "@inubekit/inubekit";

import { ICreditRequest } from "@services/creditRequest/types";
import { getCreditRequestByCode } from "@services/creditRequest/getCreditRequestByCode";
import { BaseModal } from "@components/modals/baseModal/index.tsx";
import { AppContext } from "@context/AppContext";
import { CustomerContext } from "@context/CustomerContext";
import { Fieldset } from "@components/data/Fieldset";
import { ErrorPage } from "@components/layout/ErrorPage";
import { environment } from "@config/environment";

import { SummaryCard } from "../prospect/components/SummaryCard";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import { StyledArrowBack } from "./styles";
import { addConfig, dataCreditProspects, dataError } from "./config";
import { NoResultsMessage } from "../login/outlets/Clients/interface.tsx";

export function CreditApplications() {
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [creditRequestData, setCreditRequestData] = useState<ICreditRequest[]>(
    [],
  );
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedRequestCode, setSelectedRequestCode] = useState<string | null>(
    null,
  );

  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const isMobile = useMediaQuery("(max-width:880px)");

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!customerData.publicCode) return;

    const fetchCreditRequest = async () => {
      try {
        const creditData = await getCreditRequestByCode(
          businessUnitPublicCode,
          businessManagerCode,
          userAccount,
          {
            clientIdentificationNumber: customerData.publicCode,
            textInSearch: search,
          },
        );
        setCreditRequestData(creditData);
      } catch {
        setCodeError(1022);
        setAddToFix([dataCreditProspects.errorCreditRequest]);
      }
    };

    fetchCreditRequest();
  }, [customerData.publicCode, search]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <>
      {codeError ? (
        <ErrorPage
          onClick={() => navigate("/home")}
          errorCode={codeError}
          addToFix={addToFix}
        />
      ) : (
        <Stack
          margin={`20px auto ${isMobile ? "100px" : "60px"} auto`}
          width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
          direction="column"
          gap="24px"
        >
          <GeneralHeader
            descriptionStatus={dataHeader.status}
            name={dataHeader.name}
            profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
          />
          <Breadcrumbs crumbs={addConfig.crumbs} />
          <StyledArrowBack onClick={() => navigate(addConfig.route)}>
            <Stack gap="8px" alignItems="center" width="100%">
              <Icon icon={<MdArrowBack />} appearance="dark" size="20px" />
              <Text type="title" size={isMobile ? "small" : "large"}>
                {addConfig.title}
              </Text>
            </Stack>
          </StyledArrowBack>
          <Fieldset>
            <Stack direction="column" gap="20px" padding="8px 16px">
              <Stack justifyContent="space-between" alignItems="center">
                <Input
                  id="keyWord"
                  placeholder={dataCreditProspects.keyWord}
                  type="search"
                  onChange={(event) => handleSearch(event)}
                />
              </Stack>
              <Stack wrap="wrap" gap="20px">
                {creditRequestData.length === 0 && (
                  <NoResultsMessage search={search} />
                )}
                {creditRequestData.map((creditRequest) => (
                  <SummaryCard
                    key={creditRequest.creditRequestId}
                    rad={creditRequest.creditRequestCode}
                    date={creditRequest.creditRequestDateOfCreation}
                    name={creditRequest.clientName}
                    destination={creditRequest.moneyDestinationAbreviatedName}
                    value={creditRequest.loanAmount}
                    toDo={creditRequest.taskToBeDone}
                    hasMessage={creditRequest.unreadNovelties === "Y"}
                    onCardClick={() => {
                      setSelectedRequestCode(creditRequest.creditRequestCode);
                      setIsShowModal(true);
                    }}
                  />
                ))}
                {creditRequestData.length === 0 && (
                  <Text type="title" size="large" margin="30px 2px">
                    {dataError.notCredits}
                  </Text>
                )}
              </Stack>
            </Stack>
          </Fieldset>
          {isShowModal && (
            <BaseModal
              title={dataCreditProspects.creditApplication}
              nextButton={dataCreditProspects.accept}
              backButton={dataCreditProspects.cancel}
              handleBack={() => setIsShowModal(false)}
              handleNext={() => {
                window.location.href = `${environment.VITE_CREDIBOARD_URL}/extended-card/${selectedRequestCode}`;
              }}
            >
              <Text>{dataCreditProspects.sure}</Text>
            </BaseModal>
          )}
        </Stack>
      )}
    </>
  );
}
