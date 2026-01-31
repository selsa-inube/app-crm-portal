import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import {
  Breadcrumbs,
  Icon,
  Input,
  Stack,
  Text,
  useMediaQuery,
} from "@inubekit/inubekit";
import { useIAuth } from "@inube/iauth-react";

import { ICreditRequest } from "@services/creditRequest/types";
import { getCreditRequestByCode } from "@services/creditRequest/getCreditRequestByCode";
import { AppContext } from "@context/AppContext";
import { CustomerContext } from "@context/CustomerContext";
import { Fieldset } from "@components/data/Fieldset";
import { ErrorPage } from "@components/layout/ErrorPage";
import { useEnum } from "@hooks/useEnum/useEnum.ts";

import { SummaryCard } from "../prospect/components/SummaryCard";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import { StyledArrowBack } from "./styles";
import { addConfig, dataCreditProspects, dataError } from "./config";
import { NoResultsMessage } from "../login/outlets/Clients/interface.tsx";
import { LoadCard } from "../prospect/components/loadCard/index.tsx";

export function ProspectCredit() {
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [creditRequestData, setCreditRequestData] = useState<ICreditRequest[]>(
    [],
  );
  const { lang } = useEnum();

  const [searchParams] = useSearchParams();
  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.publicCode;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;
  const { user } = useIAuth();

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
      setLoading(true);
      try {
        const stage = "TRAMITADA";

        const creditData = await getCreditRequestByCode(
          businessUnitPublicCode,
          businessManagerCode,
          userAccount,
          {
            clientIdentificationNumber: customerData.publicCode,
            stage: stage,
          },
          eventData.token,
        );
        setCreditRequestData(creditData);
      } catch {
        setCodeError(1022);
        setAddToFix([dataCreditProspects.errorCreditRequest.i18n[lang]]);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditRequest();
  }, [customerData.publicCode, search, searchParams]);

  useEffect(() => {
    let error = null;
    const messages: string[] = [];

    if (eventData.businessManager.abbreviatedName.length === 0) {
      error = 1003;
      messages.push(dataError.noBusinessUnit.i18n[lang]);
    }
    if (customerData.fullName.length === 0) {
      error = 1016;
      messages.push(dataError.noSelectClient.i18n[lang]);
    }

    setCodeError(error);
    setAddToFix(messages);
  }, [customerData, eventData, loading]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleNavigate = () => {
    if (codeError === 1003) {
      navigate(`/login/${user.username}/business-units/select-business-unit`);
    } else if (codeError === 1016) {
      navigate("/clients/select-client/");
    } else {
      navigate("/credit");
    }
  };

  return (
    <>
      {codeError ? (
        <ErrorPage
          onClick={handleNavigate}
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
          <Breadcrumbs
            crumbs={addConfig.crumbs.map((crumb) => ({
              ...crumb,
              label: crumb.label.i18n[lang as keyof typeof crumb.label.i18n],
            }))}
          />
          <StyledArrowBack onClick={() => navigate(addConfig.route.i18n[lang])}>
            <Stack gap="8px" alignItems="center" width="100%">
              <Icon icon={<MdArrowBack />} appearance="dark" size="20px" />
              <Text type="title" size={isMobile ? "small" : "large"}>
                {addConfig.title.i18n[lang]}
              </Text>
            </Stack>
          </StyledArrowBack>
          <Fieldset>
            <Stack direction="column" gap="20px" padding="8px 16px">
              <Stack justifyContent="space-between" alignItems="center">
                <Input
                  id="keyWord"
                  placeholder={dataCreditProspects.keyWord.i18n[lang]}
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
                          navigate(
                            `/credit/processed-credit-requests/extended-card/${creditRequest.creditRequestCode}`,
                          );
                        }}
                        lang={lang}
                      />
                    ))}
                  </>
                )}
                {creditRequestData.length === 0 && !loading && (
                  <Text type="title" size="large" margin="30px 2px">
                    {dataError.notCredits.i18n[lang]}
                  </Text>
                )}
              </Stack>
            </Stack>
          </Fieldset>
        </Stack>
      )}
    </>
  );
}
