import { MdOutlineVisibility, MdDeleteOutline } from "react-icons/md";

import { formatDate } from "@utils/date";
import { EStatus, HumanResourceRequest } from "@ptypes/humanResourcesRequest.types";

import { VacationType } from "./enums";

export const formatHolidaysData = (holidays: HumanResourceRequest[]) =>
  holidays.map((holiday) => ({
    description: {
      value:
        VacationType[holiday.humanResourceRequestData.typeOfRequest as keyof typeof VacationType],
    },
    date: { value: formatDate(holiday.humanResourceRequestDate) },
    days: { value: Number(holiday.humanResourceRequestData.daysEnjoyed ?? 0) },
    status: {
      value: EStatus[holiday.humanResourceRequestStatus as unknown as keyof typeof EStatus],
    },
    details: {
      value: <MdOutlineVisibility />,
      type: "icon" as const,
      onClick: () => console.log(`Ver detalles de la solicitud ${holiday.humanResourceRequestId}`),
    },
    delete: {
      value: <MdDeleteOutline />,
      type: "icon" as const,
      onClick: () => console.log(`Eliminar solicitud ${holiday.humanResourceRequestId}`),
    },
    dataDetails: {
      value: {
        ...holiday.humanResourceRequestData,
        startDate: holiday.humanResourceRequestData?.startDate
          ? formatDate(holiday.humanResourceRequestData.startDate)
          : "",
        description: holiday.humanResourceRequestDescription,
      },
    },
  }));
