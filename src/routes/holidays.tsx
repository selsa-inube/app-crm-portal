import { Route, Routes } from "react-router-dom";

import { HolidaysOptions } from "@pages/holidays";
import { RequestEnjoyment } from "@pages/holidays/RequestEnjoyment";
import { RequestPayment } from "@pages/holidays/RequestPayment";

function HolidaysRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HolidaysOptions />} />
      <Route path="/request-payment" element={<RequestPayment />} />
      <Route path="/request-enjoyment" element={<RequestEnjoyment />} />
    </Routes>
  );
}

export { HolidaysRoutes };
