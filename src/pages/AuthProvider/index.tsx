import { ReactNode } from "react";
import { IAuthProvider, useIAuth } from "@inube/iauth-react";

import { environment } from "@config/environment";
import { ErrorPage } from "@components/layout/ErrorPage";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";
import { usePortalLogic } from "@hooks/usePortalRedirect";
import { useAuthHandler } from "@hooks/useAuthHandler";

interface IAuthProviderProps {
  children: ReactNode;
}

interface AuthContentProps {
  children: ReactNode;
  authConfig: { clientId: string; clientSecret: string } | null;
  codeError: number | null;
  portalCode: string;
  publicCode: string | null;
}

function AuthContent({
  children,
  authConfig,
  codeError,
  portalCode,
}: AuthContentProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useIAuth();

  const hasAuthError = !authConfig || Boolean(codeError);

  useAuthHandler(authConfig, hasAuthError, portalCode);

  if (isAuthLoading) {
    return <LoadingAppUI />;
  }

  if (!isAuthenticated && !hasAuthError) {
    return <LoadingAppUI />;
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
      <AuthContent
        authConfig={authConfig}
        codeError={codeError}
        portalCode={portalCode}
        publicCode={publicCode}
      >
        {children}
      </AuthContent>
    </IAuthProvider>
  );
}
