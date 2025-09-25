import { ReactNode } from "react";
import { IAuthProvider } from "@inube/iauth-react";

import { environment } from "@config/environment";
import { decrypt } from "@utils/encrypt/encrypt";
import { ErrorPage } from "@components/layout/ErrorPage";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";
import { usePortalLogic } from "@hooks/usePortalRedirect";
import { useAuthHandler } from "@hooks/useAuthHandler";

interface IAuthProvider {
  children: ReactNode;
}

function AuthContent({ children }: { children: ReactNode }) {
  const { codeError, authConfig, loading, hasAuthError, portalCode } =
    usePortalLogic();

  useAuthHandler(authConfig, hasAuthError, portalCode);

  if (loading) {
    return <LoadingAppUI />;
  }

  if (!portalCode) {
    return <ErrorPage errorCode={1000} />;
  }

  if (codeError || !authConfig) {
    return <ErrorPage errorCode={codeError ?? 1000} />;
  }

  return <>{children}</>;
}

export function AuthProvider({ children }: IAuthProvider) {
  const { codeError, authConfig, loading, portalCode } = usePortalLogic();
  if (loading) {
    return <LoadingAppUI />;
  }

  if (!portalCode) {
    return <ErrorPage errorCode={1000} />;
  }

  if (codeError || !authConfig) {
    return <ErrorPage errorCode={codeError ?? 1000} />;
  }

  return (
    <IAuthProvider
      originatorId={environment.ORIGINATOR_ID}
      callbackUrl={environment.REDIRECT_URI}
      iAuthUrl={environment.IAUTH_URL}
      clientId={decrypt(authConfig.clientId)}
      clientSecret={decrypt(authConfig.clientSecret)}
    >
      <AuthContent>{children}</AuthContent>
    </IAuthProvider>
  );
}
