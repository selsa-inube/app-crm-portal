import { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { AppContext } from "@context/AppContext";
import { validateBusinessUnits } from "@pages/login/utils";

const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventData, setBusinessUnitsToTheStaff } = useContext(AppContext);
  const [hasError, setHasError] = useState(false);
  const [codeError, setCodeError] = useState<number>();
  const userIdentifier = eventData?.user?.identificationDocumentNumber;

  useEffect(() => {
    if (eventData.portal.publicCode) {
      validateBusinessUnits(
        eventData.portal.publicCode,
        userIdentifier || "",
      ).then((data) => {
        setBusinessUnitsToTheStaff(data);
        if (!setBusinessUnitsToTheStaff) {
          setHasError(true);
          return;
        }
      });
      if (hasError) {
        setCodeError(1003);
        return;
      }
    }
  }, [
    eventData.portal.publicCode,
    userIdentifier,
    hasError,
    setBusinessUnitsToTheStaff,
  ]);

  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/login/" ||
      location.pathname === "/"
    ) {
      navigate(`/login/${eventData.user.userAccount}/checking-credentials/`);
    }
  }, [location, navigate, userIdentifier]);

  return { eventData, codeError, hasError };
};

export { useLogin };
