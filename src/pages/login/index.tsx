import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppContext } from "@context/AppContext/useAppContext";

import { LoginUI } from "./interface";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppContext();

  useEffect(() => {
    if ((location.pathname === "/login" || location.pathname === "/login/") && user) {
      navigate(`/login/${user.id}/checking-credentials/`);
    }
  }, [location, navigate, user]);

  return <LoginUI />;
}

export { Login };
