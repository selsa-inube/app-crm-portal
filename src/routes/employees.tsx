import { Routes, Route } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { SelectEmployeePage } from "@pages/Employees/SelectEmployee";
import { NewEmployee } from "@pages/Employees/NewEmployee";

function EmployeesRoutes() {
  return (
    <Routes>
      <Route path="select-employee" element={<SelectEmployeePage />} />
      <Route path="new-employee" element={<NewEmployee />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export { EmployeesRoutes };
