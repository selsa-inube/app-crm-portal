import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AppPage } from "@components/layout/AppPage";

import { useAppContext } from "./context/AppContext/useAppContext";

interface ProtectedAppPageProps {
  withNav?: boolean;
  withBanner?: boolean;
}

function ProtectedAppPage(props: ProtectedAppPageProps) {
  const { withNav = true, withBanner = true } = props;
  const { selectedClient } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedClient) {
      navigate("/login", { replace: true });
    }
  }, [selectedClient, navigate]);

  return <AppPage withNav={withNav} withBanner={withBanner} />;
}

export { ProtectedAppPage };
