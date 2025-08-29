import { useContext, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { FlagProvider } from "@inubekit/inubekit";

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
import { CustomerRoutes } from "@routes/customer";
import { useIAuth } from "./context/authContext";

function LogOut() {
  const { logout } = useIAuth();
  useEffect(() => {
    localStorage.clear();
    logout({
      logoutParams: {
        returnTo: `${window.location.origin}/error`,
      },
    });
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
  const { codeError, loading } = usePortalLogic();

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
