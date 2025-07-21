import { useMediaQuery } from "@inubekit/inubekit";
import { useContext, useEffect, useRef, useState } from "react";

import { AppContext } from "@context/AppContext";
import { CustomerContext } from "@context/CustomerContext";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

import { HomeUI } from "./interface";
import { IOptionStaff } from "@src/services/staffs/searchOptionForStaff/types";
import { getSearchOptionForStaff } from "@src/services/staffs/searchOptionForStaff";

const Home = () => {
  const { eventData, businessUnitsToTheStaff, setBusinessUnitSigla } =
    useContext(AppContext);
  const { customerData } = useContext(CustomerContext);

  const smallScreen = useMediaQuery("(max-width: 532px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 880px)");
  const username = eventData.user.userName.split(" ")[0];

  const [collapse, setCollapse] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>(
    eventData.businessUnit.abbreviatedName,
  );
  const [loading, setLoading] = useState(true);

  const collapseMenuRef = useRef<HTMLDivElement>(null);
  const businessUnitChangeRef = useRef<HTMLDivElement>(null);

  const [dataStaff, setDataStaff] = useState<IOptionStaff[]>([]);

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData?.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const handleLogoClick = (businessUnit: IBusinessUnitsPortalStaff) => {
    const selectJSON = JSON.stringify(businessUnit);
    setBusinessUnitSigla(selectJSON);
    setSelectedClient(businessUnit.abbreviatedName);
    setCollapse(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const fectchCreditCards = async () => {
    try {
      const result = await getSearchOptionForStaff(
        "Crm-portal", //businessUnitPublicCode,
        "test", //prospectCode!,
        "ca.rincon97@gmail.co",
      );
      setDataStaff(result);
    } catch (error) {
      console.error("Error fetching credit cards:", error);
    }
  };

  useEffect(() => {
    fectchCreditCards();
  }, []);

  return (
    <HomeUI
      smallScreen={smallScreen}
      isTablet={isTablet}
      isMobile={isMobile}
      username={username}
      eventData={eventData}
      collapse={collapse}
      setCollapse={setCollapse}
      collapseMenuRef={collapseMenuRef}
      businessUnitChangeRef={businessUnitChangeRef}
      businessUnitsToTheStaff={businessUnitsToTheStaff}
      selectedClient={selectedClient}
      handleLogoClick={handleLogoClick}
      dataHeader={dataHeader}
      loading={loading}
      dataOptions={dataStaff}
    />
  );
};

export { Home };
