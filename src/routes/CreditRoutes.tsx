import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { Simulations } from "@pages/simulations";
import { ApplyForCredit } from "@pages/applyForCredit";
import { SimulateCredit } from "@pages/simulateCredit";
import { CreditProspects } from "@pages/creditProspects";
import { CreditApplications } from "@pages/applications";
import { Credit } from "@pages/credit";
import { FinancialReporting } from "@pages/financialReporting";
import { ProspectCredit } from "@pages/prospectCredit";

import { Payroll } from "@src/pages/payrollOrnBonus/payRoll";
import { Bonus } from "@src/pages/payrollOrnBonus/bunus";

function CreditRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />}>
        <Route index path="/" element={<Credit />} />
        <Route path="/simulate-credit" element={<SimulateCredit />} />
        <Route path="/bonus" element={<Bonus />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/prospects" element={<CreditProspects />} />
        <Route path="/credit-requests" element={<CreditApplications />} />
        <Route path="/prospects/:prospectCode" element={<Simulations />} />
        <Route
          path="/apply-for-credit/:prospectCode"
          element={<ApplyForCredit />}
        />
        <Route path="/processed-credit-requests" element={<ProspectCredit />} />
        <Route
          path="/processed-credit-requests/extended-card/:creditRequestCode"
          element={<FinancialReporting />}
        />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { CreditRoutes };
