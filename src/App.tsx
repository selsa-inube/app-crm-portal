import { useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useIAuth } from "@inube/iauth-react";
import { FlagProvider } from "@inubekit/inubekit";

import { AppContext, AppContextProvider } from "@context/AppContext";
import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { GlobalStyles } from "@styles/global";
import { Login } from "@pages/login";
import { initializeDataDB } from "@mocks/utils/initializeDataDB";
import { LoginRoutes } from "@routes/login";
import { CreditRoutes } from "@routes/CreditRoutes";
import { HomeRoutes } from "@routes/home";
import { CustomerContextProvider } from "@context/CustomerContext";
import { CustomerRoutes } from "@routes/customer";

import { AuthProviderWrapper } from "./pages/AuthWrapper";

function LogOut() {
  localStorage.clear();
  sessionStorage.clear();
  const { logout } = useIAuth();
  logout();
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
      <Route path="credit/*" element={<CreditRoutes />} />
      <Route path="home/*" element={<HomeRoutes />} />
      <Route path="clients/select-client/*" element={<CustomerRoutes />} />
      <Route path="logout" element={<LogOut />} />
    </>,
  ),
);

function App() {
  return (
    <AuthProviderWrapper>
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
    </AuthProviderWrapper>
  );
}

export default App;
