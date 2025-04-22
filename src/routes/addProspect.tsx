import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";
import { AddProspect } from "@pages/addProspect";
import { CustomerContextProvider } from "@context/CustomerContext";

function AddProspectRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoadingAppUI />}>
        <Route
          path="/:customerPublicCode"
          element={
            <CustomerContextProvider>
              <AddProspect />
            </CustomerContextProvider>
          }
        />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { AddProspectRoutes };
