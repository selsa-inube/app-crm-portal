import { useState, useEffect } from "react";
import { IOption } from "@inubekit/inubekit";

import { getRemunerationProfiles } from "@services/catalogs/getRemunerationProfiles";
import { useErrorFlag } from "@hooks/useErrorFlag";

import { mapProfilesToOptions } from "../utils/mappers";

export const useAssignmentOptions = () => {
  const [assignmentOptions, setAssignmentOptions] = useState<IOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<number | null>(null);
  const [flagShown, setFlagShown] = useState(false);

  useErrorFlag(flagShown, "Error obteniendo las opciones de asignación");

  useEffect(() => {
    const fetchAssignmentOptions = async () => {
      setIsLoading(true);
      setHasError(null);
      setFlagShown(false);

      try {
        const remunerationProfiles = await getRemunerationProfiles();
        setAssignmentOptions(mapProfilesToOptions(remunerationProfiles));
      } catch (err) {
        setHasError(500);
        setFlagShown(true);
        console.error("Error fetching assignment options:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignmentOptions();
  }, []);

  return { assignmentOptions, isLoading, hasError };
};
