import { useState, useEffect } from "react";

import { useAppContext } from "@context/AppContext/useAppContext";
import { useErrorFlag } from "@hooks/useErrorFlag";
import { getHumanResourceRequests } from "@services/humanResourcesRequest/getHumanResourcesRequest";

import { holidaysNavConfig } from "./config/nav.config";
import { HolidaysOptionsUI } from "./interface";
import { IHolidaysTable } from "./components/HolidaysTable/types";
import { formatHolidaysData } from "./config/table.config";

function HolidaysOptions() {
  const [tableData, setTableData] = useState<IHolidaysTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flagShown, setFlagShown] = useState(false);
  const { user } = useAppContext();

  useErrorFlag(flagShown, "Error en la consulta las solicitudes en tramite");

  useEffect(() => {
    const fetchHolidays = async () => {
      setIsLoading(true);
      try {
        if (!user?.id) return;

        const holidays = await getHumanResourceRequests("vacations", user.id);
        const formattedData = formatHolidaysData(holidays || []);

        setTableData(formattedData);
      } catch (error) {
        console.error("Error al obtener las vacaciones:", error);
        setFlagShown(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchHolidays();
    }
  }, [user?.id]);

  return (
    <HolidaysOptionsUI
      appName={holidaysNavConfig[0].label}
      appRoute={holidaysNavConfig[0].crumbs}
      navigatePage={holidaysNavConfig[0].url}
      tableData={tableData}
      isLoading={isLoading}
    />
  );
}

export { HolidaysOptions };
