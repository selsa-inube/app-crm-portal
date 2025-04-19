import { useEffect } from "react";
import { useFlag } from "@inubekit/inubekit";

export const useErrorFlag = (
  flagShown: boolean,
  message?: string,
  title?: string,
  isSuccess = false,
  duration?: number,
) => {
  const { addFlag } = useFlag();

  useEffect(() => {
    if (flagShown) {
      addFlag({
        title: title ?? (isSuccess ? "Éxito" : "Error"),
        description:
          message ??
          (isSuccess ? "Solicitud enviada correctamente." : "Error en la consulta de los datos."),
        appearance: isSuccess ? "success" : "danger",
        duration: duration ?? 5000,
      });
    }
  }, [flagShown, message, title, isSuccess]);
};
