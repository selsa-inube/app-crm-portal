import { Route, Routes } from "react-router-dom";

import { SelectBusinessUnit } from "@pages/login/outlets/SelectBusinessUnit";
import { Clients } from "@pages/login/outlets/Clients";
import { LoadingApp } from "@pages/login/outlets/LoadingApp";
import { ErrorPage } from "@components/layout/ErrorPage";
import { Login } from "@pages/login";
import { IClient } from "@context/AppContext/types";

export interface IClients {
  clients: IClient[];
}
function LoginRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />}>
        <Route path=":user_id/checking-credentials" element={<SelectBusinessUnit />} />
        <Route path=":user_id/clients" element={<Clients />} />
        <Route path="loading-app" element={<LoadingApp />} />
      </Route>
      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
}

export { LoginRoutes };
