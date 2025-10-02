import { useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
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

import { environment } from "./config/environment";
import { AuthProvider } from "./pages/AuthProvider";

function LogOut() {
  localStorage.clear();
  sessionStorage.clear();
  const { logout } = useIAuth();
  logout({ logoutParams: { returnTo: environment.GOOGLE_REDIRECT_URI } });
  return <AppPage />;
}

function FirstPage() {
  const { businessUnitSigla } = useContext(AppContext);
  initializeDataDB(businessUnitSigla);
  if (businessUnitSigla.length === 0) {
    return <Login />;
  }
  return <Navigate to="/credit" replace />;
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
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
