import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { Home } from "@pages/home";

function HomeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppPage showNav={false} />}>
        <Route index path="/" element={<Home />} />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { HomeRoutes };
