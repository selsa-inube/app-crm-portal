import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { Simulations } from "@pages/simulations";
import { ApplyForCredit } from "@pages/applyForCredit";
import { SimulateCredit } from "@pages/simulateCredit";
import { CreditProspects } from "@pages/creditProspects";

function CreditRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />}>
        <Route path="/simulate-credit" element={<SimulateCredit />} />
        <Route path="/simulations" element={<CreditProspects />} />
        <Route path="/simulations/:prospectCode" element={<Simulations />} />
        <Route
          path="/apply-for-credit/:prospectCode"
          element={<ApplyForCredit />}
        />
        {/* <Route path="/credit-applications" element={<CreditApplications />} /> */}
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { CreditRoutes };
