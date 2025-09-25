import { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIAuth } from "@inube/iauth-react";

import { AppContext } from "@context/AppContext";
import { validateBusinessUnits } from "@pages/login/utils";

const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useIAuth();
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
      !isLoading &&
      isAuthenticated &&
      eventData.user.userAccount &&
      (location.pathname === "/login" ||
        location.pathname === "/login/" ||
        location.pathname === "/")
    ) {
      navigate(`/login/${eventData.user.userAccount}/checking-credentials/`);
    }
  }, [
    location.pathname,
    navigate,
    eventData.user.userAccount,
    isAuthenticated,
    isLoading,
  ]);

  return { eventData, codeError, hasError };
};

export { useLogin };
