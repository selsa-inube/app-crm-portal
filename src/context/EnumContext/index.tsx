import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

import { IDomainEnum, TEnumContext } from "@config/enums/types";
import { requirementStatusData } from "@services/enum/requirements";

const EnumContext = createContext<TEnumContext>({} as TEnumContext);

export const EnumProvider = ({ children }: { children: ReactNode }) => {
  const [enums, setEnums] = useState<Record<string, IDomainEnum[]>>({});
  const [language, setLanguage] = useState("es");

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
    },
    [language, enums, getMocks, transformEnumData],
  );

  const contextValue = useMemo(
    () => ({
      enums,
      language,
      getEnums,
    }),
    [enums, language, getEnums],
  );

  return (
    <EnumContext.Provider value={contextValue}>{children}</EnumContext.Provider>
  );
};

export const useEnums = (): TEnumContext => {
  const context = useContext(EnumContext);
  if (!context) {
    return {} as TEnumContext;
  }
  return context;
};
