import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { Simulations } from "@pages/simulations";
import { ApplyForCredit } from "@pages/applyForCredit";
import { SimulateCredit } from "@pages/simulateCredit";
import { CreditProspects } from "@pages/creditProspects";
import { CreditApplications } from "@pages/applications";
import { Credit } from "@pages/credit";
import { ProspectCredit } from "@pages/prospectCredit";

function CreditRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />}>
        <Route index path="/" element={<Credit />} />
        <Route path="/simulate-credit" element={<SimulateCredit />} />
        <Route path="/prospects" element={<CreditProspects />} />
        <Route path="/credit-requests" element={<CreditApplications />} />
        <Route path="/processed-credit-requests" element={<ProspectCredit />} />
        <Route path="/prospects/:prospectCode" element={<Simulations />} />
        <Route
          path="/apply-for-credit/:prospectCode"
          element={<ApplyForCredit />}
        />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { CreditRoutes };
