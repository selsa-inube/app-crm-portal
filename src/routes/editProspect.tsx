import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { EditProspect } from "@pages/editProspect";

function EditProspectRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />}>
        <Route
          path="/:customerPublicCode/:prospectCode"
          element={<EditProspect />}
        />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { EditProspectRoutes };
