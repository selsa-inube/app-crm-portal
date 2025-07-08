import { useMediaQuery } from "@inubekit/inubekit";
import { useContext, useEffect, useRef, useState } from "react";

import { AppContext } from "@context/AppContext";
import { CustomerContext } from "@context/CustomerContext";
import { mockData } from "@mocks/home/mockData";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

import { HomeUI } from "./interface";

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

  const dataHeader = {
    name: customerData?.generalAttributeClientNaturalPersons?.[0]?.firstNames,
    status: customerData?.generalAttributeClientNaturalPersons?.[0]?.dateBirth,
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
      mockData={mockData}
    />
  );
};

export { Home };
