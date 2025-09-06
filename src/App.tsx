import { useContext, useEffect, useRef } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { FlagProvider } from "@inubekit/inubekit";
import { jwtDecode } from "jwt-decode";

import { AppContext, AppContextProvider } from "@context/AppContext";
import { usePortalLogic } from "@hooks/usePortalRedirect";
import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { GlobalStyles } from "@styles/global";
import { Login } from "@pages/login";
import { initializeDataDB } from "@mocks/utils/initializeDataDB";
import { LoginRoutes } from "@routes/login";
import { CreditRoutes } from "@routes/CreditRoutes";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";
import { Home } from "@pages/home";
import { CustomerContextProvider } from "@context/CustomerContext";
import { useIAuth } from "@context/AuthContext/useAuthContext";
import { IUsers } from "@context/AppContext/types";
import { CustomerRoutes } from "@routes/customer";

import { usePostUserAccountsData } from "./hooks/usePostUserAccountsData";

function LogOut() {
  const { logout } = useIAuth();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true;
      localStorage.clear();
      sessionStorage.clear();

      logout({
        logoutParams: {
          returnTo: `${window.location.origin}/logout`,
        },
      });
    }
  }, [logout]);

  return <LoadingAppUI />;
}

function FirstPage() {
  const { businessUnitSigla } = useContext(AppContext);
  initializeDataDB(businessUnitSigla);
  return businessUnitSigla.length === 0 ? <Login /> : <AppPage />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="*"
        element={<FirstPage />}
        errorElement={<ErrorPage errorCode={400} />}
      />
      <Route path="login/*" element={<LoginRoutes />} />
      <Route path="credit/*" element={<CreditRoutes />} />
      <Route path="home/*" element={<Home />} />
      <Route path="clients/select-client/*" element={<CustomerRoutes />} />
      <Route path="logout" element={<LogOut />} />
    </>,
  ),
);

function App() {
  const { codeError, loading, businessManager } = usePortalLogic();
  const { setUser } = useIAuth();

  const { data: userAccountsData } = usePostUserAccountsData(
    businessManager.clientId,
    businessManager.clientSecret,
  );

  useEffect(() => {
    if (userAccountsData?.idToken) {
      const decoded = jwtDecode<{
        identificationNumber: string;
        names: string;
        surNames: string;
        userAccount: string;
        consumerApplicationCode: string;
      }>(userAccountsData.idToken);

      const mappedUser: IUsers = {
        id: decoded.identificationNumber,
        username: `${decoded.names} ${decoded.surNames}`,
        nickname: decoded.userAccount,
        company: decoded.consumerApplicationCode,
        urlImgPerfil: "",
      };

      setUser(mappedUser);
    }
  }, [userAccountsData, setUser]);
  if (loading) {
    return <LoadingAppUI />;
  }

  if (codeError) {
    return <ErrorPage errorCode={codeError} />;
  }

  return (
    <AppContextProvider>
      <CustomerContextProvider>
        <CustomerContextProvider>
          <FlagProvider>
            <GlobalStyles />
            <RouterProvider router={router} />
          </FlagProvider>
        </CustomerContextProvider>
      </CustomerContextProvider>
    </AppContextProvider>
  );
}

export default App;
