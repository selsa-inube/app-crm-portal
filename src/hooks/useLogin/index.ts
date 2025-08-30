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
  console.log(eventData.portal.publicCode);
  useEffect(() => {
    if (eventData.portal.publicCode) {
      validateBusinessUnits(
        eventData.portal.publicCode,
        "ossalincon422@gmail.",
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
    "ossalincon422@gmail.",
    hasError,
    setBusinessUnitsToTheStaff,
  ]);

  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/login/" ||
      location.pathname === "/"
    ) {
      navigate(`/login/username/checking-credentials/`);
    }
  }, [location, navigate, "ossalincon422@gmail."]);

  return { eventData, codeError, hasError };
};

export { useLogin };
