import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

import {
  IDomainEnum,
  IEnumContextState,
  IEnumContextActions,
  TEnumContext,
} from "@config/enums/types";
import { requirementStatusData } from "@services/enum/requirements";

const EnumContext = createContext<TEnumContext>({} as TEnumContext);

export const EnumProvider = ({ children }: { children: ReactNode }) => {
  const [enums, setEnums] = useState<Record<string, IDomainEnum[]>>({});
  const [language, setLanguage] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.language) {
      const browserLanguage = navigator.language.split("-")[0];
      setLanguage(browserLanguage);
    }
  }, []);

  const transformEnumData = useCallback(
    (rawData: IDomainEnum[]): IDomainEnum[] => {
      return rawData.map((item) => ({
        ...item,
        value: item.i18n?.[language] || item.value,
      }));
    },
    [language],
  );

  const getMocks = useCallback((enumName: string): IDomainEnum[] | null => {
    const hardcodedEnums: Record<string, IDomainEnum[]> = {
      requirementStatus: requirementStatusData,
    };

    return hardcodedEnums[enumName] || null;
  }, []);

  const getEnums = useCallback(
    async (enumName: string) => {
      if (enums[enumName]?.length > 0) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let rawData: IDomainEnum[] | null = null;

        rawData = getMocks(enumName);

        if (!rawData) {
          return;
        }

        const translatedData = transformEnumData(rawData);

        setEnums((prevEnums) => ({
          ...prevEnums,
          [enumName]: translatedData,
        }));

        console.log(`✅ Enum '${enumName}' cargado exitosamente`);
      } catch (err) {
        const errorMsg = `Error al cargar el enum '${enumName}': ${err}`;
        console.error(errorMsg);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [language, enums, getMocks, transformEnumData],
  );

  const clearEnums = useCallback(() => {
    setEnums({});
    setError(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      enums,
      language,
      isLoading,
      error,
      getEnums,
      clearEnums,
    }),
    [enums, language, isLoading, error, getEnums, clearEnums],
  );

  return (
    <EnumContext.Provider value={contextValue}>{children}</EnumContext.Provider>
  );
};

export const useEnums = (): TEnumContext => {
  const context = useContext(EnumContext);
  if (!context) {
    throw new Error("useEnums debe ser usado dentro de un EnumProvider");
  }
  return context;
};
