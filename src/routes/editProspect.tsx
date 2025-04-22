import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";
import { EditProspect } from "@pages/editProspect";
import { CustomerContextProvider } from "@context/CustomerContext";

function EditProspectRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoadingAppUI />}>
        <Route
          path="/:customerPublicCode/:prospectCode"
          element={
            <CustomerContextProvider>
              <EditProspect />
            </CustomerContextProvider>
          }
        />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { EditProspectRoutes };
