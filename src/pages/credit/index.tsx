import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { useAppContext } from "@hooks/useAppContext";
import { CustomerContext } from "@context/CustomerContext";

import { CreditUI } from "./interface";

const Credit = () => {
  const isMobile = useMediaQuery("(max-width: 880px)");
  const { optionStaffData } = useAppContext();
  const { customerData } = useContext(CustomerContext);

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const navigate = useNavigate();

  return (
    <CreditUI
      isMobile={isMobile}
      dataOptions={optionStaffData}
      dataHeader={dataHeader}
      navigate={navigate}
    />
  );
};

export { Credit };
