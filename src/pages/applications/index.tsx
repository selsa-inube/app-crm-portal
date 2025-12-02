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
import userImage from "@assets/images/userImage.jpeg";

import { SummaryCard } from "../prospect/components/SummaryCard";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import { StyledArrowBack } from "./styles";
import { addConfig, dataCreditProspects, dataError } from "./config";
import { NoResultsMessage } from "../login/outlets/Clients/interface.tsx";
import { LoadCard } from "../prospect/components/loadCard/index.tsx";

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
  const [loading, setLoading] = useState(true);

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
    image: customerData.image,
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!customerData.publicCode) return;

    const fetchCreditRequest = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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
          onClick={() => navigate("/credit")}
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
            profileImageUrl={dataHeader.image || userImage}
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
                {creditRequestData.length === 0 && !loading && (
                  <NoResultsMessage search={search} />
                )}
                {loading ? (
                  <LoadCard />
                ) : (
                  <>
                    {creditRequestData.map((creditRequest) => (
                      <SummaryCard
                        key={creditRequest.creditRequestId}
                        rad={creditRequest.creditRequestCode}
                        date={creditRequest.creditRequestDateOfCreation}
                        name={creditRequest.clientName}
                        destination={
                          creditRequest.moneyDestinationAbreviatedName
                        }
                        value={creditRequest.loanAmount}
                        toDo={creditRequest.taskToBeDone}
                        hasMessage={creditRequest.unreadNovelties === "Y"}
                        onCardClick={() => {
                          setSelectedRequestCode(
                            creditRequest.creditRequestCode,
                          );
                          setIsShowModal(true);
                        }}
                      />
                    ))}
                  </>
                )}
                {creditRequestData.length === 0 && !loading && (
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
              width="400px"
            >
              <Text>{dataCreditProspects.sure}</Text>
            </BaseModal>
          )}
        </Stack>
      )}
    </>
  );
}
