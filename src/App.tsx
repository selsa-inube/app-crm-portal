import { useContext, useEffect } from "react";
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
import { GlobalStyles } from "@styles/global";
import { Login } from "@pages/login";
import { initializeDataDB } from "@mocks/utils/initializeDataDB";
import { LoginRoutes } from "@routes/login";
import { CreditRoutes } from "@routes/CreditRoutes";
import { HomeRoutes } from "@routes/home";
import { CustomerContextProvider } from "@context/CustomerContext";
import { CustomerRoutes } from "@routes/customer";

import { EnumProvider } from "./context/EnumContext";
import { AuthProvider } from "./pages/AuthProvider";

function LogOut() {
  sessionStorage.clear();
  const { logout } = useIAuth();
  useEffect(() => {
    localStorage.removeItem("businessUnitSigla");
    logout();
  }, [logout]);
  return null;
}

function FirstPage() {
  const { businessUnitSigla } = useContext(AppContext);
  initializeDataDB(businessUnitSigla);
  if (businessUnitSigla.length === 0) {
    return <Login />;
  }
  return <Navigate to="/clients/select-client" replace />;
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
            <EnumProvider>
              <FlagProvider>
                <GlobalStyles />
                <RouterProvider router={router} />
              </FlagProvider>
            </EnumProvider>
          </CustomerContextProvider>
        </CustomerContextProvider>
      </AppContextProvider>
    </AuthProvider>
  );
}

export default App;
