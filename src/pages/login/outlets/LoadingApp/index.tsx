import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { LoadingAppUI } from "./interface";

function LoadingApp() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/clients/select-client");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <LoadingAppUI />;
}

export { LoadingApp };
