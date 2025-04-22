import { Route, Routes } from "react-router-dom";
import { useContext } from "react";

import { ErrorPage } from "@components/layout/ErrorPage";
import { Login } from "@pages/login";
import { CheckingCredentials } from "@pages/login/outlets/CheckingCredentials";
import { ErrorNotAvailable } from "@pages/login/errors/ErrorNotAvailable";
import { ErrorNotClient } from "@pages/login/errors/ErrorNotClient";
import { LoadingApp } from "@pages/login/outlets/LoadingApp";
import { AppContext } from "@context/AppContext";
import { BusinessUnits } from "@pages/login/outlets/Clients";

function LoginRoutes() {
  const { businessUnitsToTheStaff } = useContext(AppContext);
  const business = businessUnitsToTheStaff;
  return (
    <Routes>
      <Route path="/" element={<Login />}>
        <Route
          path="/:user_id/checking-credentials"
          element={<CheckingCredentials businessUnits={business} />}
        />
        <Route
          path="/:user_id/clients"
          element={<BusinessUnits businessUnits={business} />}
        />
        <Route path="loading-app" element={<LoadingApp />} />
      </Route>
      <Route path="error/not-available" element={<ErrorNotAvailable />} />
      <Route path="error/not-related-clients" element={<ErrorNotClient />} />
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { LoginRoutes };
