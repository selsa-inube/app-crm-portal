import { createContext } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import { ErrorModal } from "@components/modals/ErrorModal";
import { useAppContext } from "@hooks/useAppContext";

import { IAppContext } from "./types";

const AppContext = createContext<IAppContext>({} as IAppContext);

interface IProviderProps {
  children: React.ReactNode;
}

function AppContextProvider(props: IProviderProps) {
  const { children } = props;
  const appContext = useAppContext();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <AppContext.Provider value={appContext}>
      {children}

      {appContext.showErrorModal && (
        <ErrorModal
          handleClose={() => appContext.setShowErrorModal(false)}
          isMobile={isMobile}
          message={appContext.messageError}
        />
      )}
    </AppContext.Provider>
  );
}

export { AppContext, AppContextProvider };
