import { useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect } from "react";
import { useIAuth } from "@inube/iauth-react";

import { AppContext } from "@context/AppContext";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

import { CheckingCredentialsUI } from "./interface";

function CheckingCredentials({
  businessUnits,
}: {
  businessUnits: IBusinessUnitsPortalStaff[];
}) {
  const navigate = useNavigate();
  const { eventData, setBusinessUnitSigla } = useContext(AppContext);
  const { user } = useIAuth();
  console.log(user, "user");
  console.log(eventData, "eventData");
  const checkCredentials = useCallback(async () => {
    try {
      if (!eventData) {
        return;
      }

      if (!businessUnits || businessUnits.length === 0) {
        navigate("/login/error/not-related-businessUnits");
      } else if (businessUnits.length === 1) {
        const selectedBusinessUnit = businessUnits[0];
        const selectJSON = JSON.stringify(selectedBusinessUnit);
        setBusinessUnitSigla(selectJSON);

        navigate("/login/loading-app");
      } else {
        navigate(`/login/${user.username}/business-units/select-business-unit`);
      }
    } catch (error) {
      navigate("/login/error/not-available");
    }
  }, [eventData, navigate, businessUnits, setBusinessUnitSigla]);

  useEffect(() => {
    const timer = setTimeout(checkCredentials, 2000);
    return () => clearTimeout(timer);
  }, [checkCredentials]);

  return <CheckingCredentialsUI />;
}

export { CheckingCredentials };
