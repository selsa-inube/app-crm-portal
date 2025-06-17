import { useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FlagProvider } from "@inubekit/inubekit";

import { AppContext, AppContextProvider } from "@context/AppContext";
import { usePortalLogic } from "@hooks/usePortalRedirect";
import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { GlobalStyles } from "@styles/global";
import { Login } from "@pages/login";
import { environment } from "@config/environment";
import { initializeDataDB } from "@mocks/utils/initializeDataDB";
import { LoginRoutes } from "@routes/login";
import { AddProspectRoutes } from "@routes/addProspect";
import { EditProspectRoutes } from "@routes/editProspect";
import { SubmitCreditApplicationRoutes } from "@routes/SubmitCreditApplication";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";

function LogOut() {
  localStorage.clear();
  const { logout } = useAuth0();
  logout({ logoutParams: { returnTo: environment.GOOGLE_REDIRECT_URI } });
  return <AppPage />;
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
      <Route path="credit/simulate-credit/*" element={<AddProspectRoutes />} />
      <Route path="credit/edit-prospect/*" element={<EditProspectRoutes />} />
      <Route
        path="credit/submit-credit-application/*"
        element={<SubmitCreditApplicationRoutes />}
      />
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
      <FlagProvider>
        <GlobalStyles />
        <RouterProvider router={router} />
      </FlagProvider>
    </AppContextProvider>
  );
}

export default App;
