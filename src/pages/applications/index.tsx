import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdArrowBack } from "react-icons/md";
import {
  Breadcrumbs,
  Button,
  Icon,
  Input,
  Stack,
  Text,
  useMediaQuery,
} from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { Fieldset } from "@components/data/Fieldset";
import { ErrorPage } from "@components/layout/ErrorPage";
import { mockCreditApplication } from "@mocks/creditApplication/creditApplication.mock";

import { SummaryCard } from "../prospect/components/SummaryCard";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import { StyledArrowBack } from "./styles";
import { addConfig, dataCreditProspects } from "./config";

export function CreditApplications() {
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);

  const isMobile = useMediaQuery("(max-width:880px)");

  const { customerData } = useContext(CustomerContext);
  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const navigate = useNavigate();

  const pruebaError = () => {
    //borrar cuando se integre el servicio
    setCodeError(1022);
    setAddToFix([dataCreditProspects.errorCreditRequest]);
  };

  useEffect(() => {
    //borrar cuando se integre el servicio
    if (!customerData?.publicCode) {
      pruebaError();
    }
  }, [customerData]);

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
          margin="20px auto"
          width={isMobile ? "-webkit-fill-available" : "min(100%,1064px)"}
          direction="column"
          gap="24px"
        >
          <GeneralHeader
            descriptionStatus={dataHeader.status}
            name={dataHeader.name}
            profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
          />
          <Breadcrumbs crumbs={addConfig.crumbs} />
          <StyledArrowBack>
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
                />
                <Button
                  iconBefore={<MdAdd />}
                  type="link"
                  path="../simulate-credit"
                >
                  {dataCreditProspects.applyCredit}
                </Button>
              </Stack>
              <Stack wrap="wrap" gap="20px">
                {mockCreditApplication.map((creditRequest) => (
                  <SummaryCard
                    key={creditRequest.creditRequestId}
                    rad={creditRequest.creditRequestCode}
                    date={creditRequest.timeOfCreation}
                    name={creditRequest.preferredPaymentChannelAbbreviatedName}
                    destination={creditRequest.moneyDestinationAbbreviatedName}
                    value={creditRequest.value}
                    toDo={creditRequest.selectedRegularPaymentSchedule}
                    path={`https://crediboard.inube.online/extended-card/${creditRequest.creditRequestCode}`}
                  />
                ))}
              </Stack>
            </Stack>
          </Fieldset>
        </Stack>
      )}
    </>
  );
}
