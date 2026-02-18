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
  const [hasInitialData, setHasInitialData] = useState(false);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.publicCode;

  const { user } = useIAuth();

  const isMobile = useMediaQuery("(max-width:880px)");

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
          eventData?.user?.identificationDocumentNumber || "",
          {
            clientIdentificationNumber: customerData.publicCode,
            stage: stage,
          },
          eventData.token,
        );
        setCreditRequestData(creditData);

        if (search === "") {
          setHasInitialData(creditData.length > 0);
        }
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

  const showSearchInput = hasInitialData;

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
              {showSearchInput && (
                <Stack justifyContent="space-between" alignItems="center">
                  <Input
                    id="keyWord"
                    placeholder={dataCreditProspects.keyWord.i18n[lang]}
                    type="search"
                    onChange={(event) => handleSearch(event)}
                  />
                </Stack>
              )}
              <Stack wrap="wrap" gap="20px">
                {loading ? (
                  <LoadCard />
                ) : (
                  <>
                    {!hasInitialData && search === "" && (
                      <Stack
                        width="100%"
                        justifyContent="center"
                        padding="30px 0"
                      >
                        <Text size="medium" textAlign="center">
                          {dataError.notCredits.i18n[lang]}
                        </Text>
                      </Stack>
                    )}

                    {hasInitialData &&
                      creditRequestData.length === 0 &&
                      search !== "" && <NoResultsMessage search={search} />}

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
              </Stack>
            </Stack>
          </Fieldset>
        </Stack>
      )}
    </>
  );
}
