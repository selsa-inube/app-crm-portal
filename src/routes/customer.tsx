import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { Customer } from "@pages/customer";

function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppPage showNav={false} />}>
        <Route path="/" element={<Customer />} />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { CustomerRoutes };
