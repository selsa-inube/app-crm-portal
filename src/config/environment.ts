const IS_PRODUCTION: boolean = import.meta.env.PROD;
const AUTH_REDIRECT_URI: string = import.meta.env.VITE_AUTH0_REDIRECT_URI as string;
const GOOGLE_REDIRECT_URI: string = import.meta.env.VITE_GOOGLE_REDIRECT_URI as string;

const maxRetriesServices = 5;
const fetchTimeoutServices = 3000;

const secretKeyPortalId = import.meta.env.VITE_SECRET_KEY_PORTAL_ID as string;

interface Environment {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  AUTH0_DOMAIN: string;
  REDIRECT_URI: string;
  GOOGLE_REDIRECT_URI: string;
  VITE_ISAAS_QUERY_PROCESS_SERVICE: string;
  VITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE: string;
  VITE_ICLIENT_QUERY_PROCESS_SERVICE: string;
  BUSINESS_UNIT?: string;
}

const environment: Environment = {
  CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID as string,
  CLIENT_SECRET: import.meta.env.VITE_AUTH0_CLIENT_SECRET as string,
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN as string,
  REDIRECT_URI: IS_PRODUCTION ? AUTH_REDIRECT_URI : window.location.origin,
  GOOGLE_REDIRECT_URI: IS_PRODUCTION ? GOOGLE_REDIRECT_URI : window.location.origin,
  VITE_ISAAS_QUERY_PROCESS_SERVICE: import.meta.env.VITE_ISAAS_QUERY_PROCESS_SERVICE as string,
  VITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE: import.meta.env
    .VITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE as string,
  VITE_ICLIENT_QUERY_PROCESS_SERVICE: import.meta.env.VITE_ICLIENT_QUERY_PROCESS_SERVICE as string,
};

export { environment, maxRetriesServices, fetchTimeoutServices, secretKeyPortalId };
