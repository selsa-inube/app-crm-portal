import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { Board } from "@pages/board";
import { SubmitCreditApplication } from "@pages/SubmitCreditApplication";
import { CustomerContextProvider } from "@context/CustomerContext";

function SubmitCreditApplicationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Board />}>
        <Route
          path="/:customerPublicCode/:prospectCode"
          element={
            <CustomerContextProvider>
              <SubmitCreditApplication />
            </CustomerContextProvider>
          }
        />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { SubmitCreditApplicationRoutes };
