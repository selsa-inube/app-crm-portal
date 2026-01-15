import { ReactNode } from "react";
import { IAuthProvider } from "@inube/iauth-react";

import { environment } from "@config/environment";
import { ErrorPage } from "@components/layout/ErrorPage";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";
import { usePortalLogic } from "@hooks/usePortalRedirect";
import { useAuthHandler } from "@hooks/useAuthHandler";

interface IAuthProviderProps {
  children: ReactNode;
}

function AuthContent({ children }: { children: ReactNode }) {
  const {
    codeError,
    authConfig,
    loading,
    hasAuthError,
    portalCode,
    publicCode,
  } = usePortalLogic();

  useAuthHandler(authConfig, hasAuthError, portalCode);

  if (loading) {
    return <LoadingAppUI />;
  }

  if (!portalCode || !publicCode) {
    return <ErrorPage errorCode={1000} />;
  }

  if (codeError || !authConfig) {
    return <ErrorPage errorCode={codeError ?? 1000} />;
  }

  return <>{children}</>;
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const { codeError, authConfig, loading, portalCode, publicCode } =
    usePortalLogic();

  if (loading) {
    return <LoadingAppUI />;
  }

  if (!portalCode || !publicCode) {
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
      serviceUrl={environment.IAUTH_SERVICE_URL}
      codeVerifier={environment.CODE_VERIFIER}
      codeChallenge={environment.CODE_CHALLENGE}
      state={environment.STATE}
      applicationName={publicCode}
      originatorCode={environment.ORIGINATOR_CODE}
    >
      <AuthContent>{children}</AuthContent>
    </IAuthProvider>
  );
}
