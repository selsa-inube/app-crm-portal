import { useContext } from "react";
import { useMediaQueries } from "@inubekit/inubekit";

import { AppContext } from "@context/AppContext";
import { useLogin } from "@hooks/useLogin";

import { LoginUI } from "./interface";

function Login() {
  const { eventData } = useContext(AppContext);
  useLogin();

  const {
    "(max-width: 768px)": screenMobile,
    "(min-width: 993px) and (max-width: 2200px)": screenDesktop,
  }: { [key: string]: boolean } = useMediaQueries([
    "(max-width: 768px)",
    "(min-width: 993px) and (max-width: 2200px)",
  ]);

  return (
    <LoginUI
      eventData={eventData}
      screenMobile={screenMobile}
      screenDesktop={screenDesktop}
    />
  );
}

export { Login };
