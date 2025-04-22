import { createContext } from "react";

import { useAppContext } from "@hooks/useAppContext";

import { IAppContext } from "./types";

const AppContext = createContext<IAppContext>({} as IAppContext);

interface IProviderProps {
  children: React.ReactNode;
}

function AppContextProvider(props: IProviderProps) {
  const { children } = props;
  const appContext = useAppContext();

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}

export { AppContext, AppContextProvider };
