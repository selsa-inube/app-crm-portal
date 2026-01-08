/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { AppContext } from "../AppContext";

interface EnumProviderProps {
  children: React.ReactNode;
}
export interface EnumContextType {
  lang: "es" | "en";
}

export const EnumContext = createContext<EnumContextType | undefined>(
  undefined,
);

export function EnumProvider(props: EnumProviderProps) {
  const { children } = props;
  const [lang, setLang] = useState<"es" | "en">("es");
  const { eventData } = useContext(AppContext);

  useEffect(() => {
    const browserLang = eventData.businessUnit.languageiso;
    setLang(browserLang === "en" ? "en" : "es");
  }, [eventData.businessUnit.languageiso]);

  return (
    <EnumContext.Provider value={{ lang }}>{children}</EnumContext.Provider>
  );
}
