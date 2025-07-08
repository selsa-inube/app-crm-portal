import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { AddProspect } from "@pages/addProspect";

function AddProspectRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />}>
        <Route path="/:customerPublicCode" element={<AddProspect />} />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { AddProspectRoutes };
