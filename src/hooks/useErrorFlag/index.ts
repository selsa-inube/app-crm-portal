import { useEffect } from "react";

import { useFlag } from "@inubekit/inubekit";

export const useErrorFlag = (
  flagShown: boolean,
  message?: string,
  title?: string,
  isSuccess = false,
  duration?: number,
) => {
  let addFlag;

  try {
    const flagContext = useFlag();
    addFlag = flagContext.addFlag;
  } catch (error) {
    console.warn("useErrorFlag must be used within a FlagProvider");
    return;
  }

  useEffect(() => {
    if (flagShown && addFlag) {
      addFlag({
        title: title ?? (isSuccess ? "Éxito" : "Error"),
        description:
          message ??
          (isSuccess
            ? "Solicitud enviada correctamente."
            : "Error en la consulta de los datos."),
        appearance: isSuccess ? "success" : "danger",
        duration: duration ?? 10000,
      });
    }
  }, [flagShown, message, title, isSuccess, addFlag]);
};
