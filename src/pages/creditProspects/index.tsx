import { useContext, useEffect, useState } from "react";
import { MdAdd, MdArrowBack } from "react-icons/md";
import {
  Breadcrumbs,
  Button,
  Icon,
  Input,
  Stack,
  Text,
  useFlag,
  useMediaQuery,
} from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { Fieldset } from "@components/data/Fieldset";
import { TableCreditProspects } from "@pages/prospect/components/TableCreditProspects";
import { getProspectsByCustomerCode } from "@services/prospects/ProspectsByCustomerCode";
import { AppContext } from "@context/AppContext";
import { IProspect } from "@services/prospects/ProspectsByCustomerCode/types";

import { addConfig, dataCreditProspects } from "./config";
import { StyledArrowBack } from "./styles";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, customerData?.publicCode]);

  return (
    <Stack
      margin="20px auto"
      width={isMobile ? "-webkit-fill-available" : "min(100%,1064px)"}
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
      <StyledArrowBack>
        <Stack gap="8px" alignItems="center" width="100%">
          <Icon icon={<MdArrowBack />} appearance="dark" size="20px" />
          <Text type="title" size={isMobile ? "small" : "large"}>
            {addConfig.title}
          </Text>
        </Stack>
      </StyledArrowBack>
      <Fieldset>
        <Stack direction="column" gap="20px">
          <Stack justifyContent="space-between" alignItems="center">
            <Input
              id="keyWord"
              label="Buscar"
              placeholder={dataCreditProspects.keyWord}
              type="search"
            />
            <Button iconBefore={<MdAdd />}>
              {dataCreditProspects.simulate}
            </Button>
          </Stack>
          <TableCreditProspects prospectData={prospectSummaryData} />
        </Stack>
      </Fieldset>
    </Stack>
  );
}
