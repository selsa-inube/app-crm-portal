const IS_PRODUCTION = import.meta.env.PROD;
// const AUTH_REDIRECT_URI: string = import.meta.env.VITE_CALLBACK_URL as string;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const secretKeyPortalId = import.meta.env.VITE_SECRET_KEY_PORTAL_ID as string;
const environment = {
  // REDIRECT_URI: IS_PRODUCTION ? AUTH_REDIRECT_URI : window.location.origin,
  REDIRECT_URI: window.location.origin,
  GOOGLE_REDIRECT_URI: !IS_PRODUCTION
    ? window.location.origin
    : GOOGLE_REDIRECT_URI,
  TEMP_BUSINESS_UNIT: "test",

  VITE_CREDIBOARD_URL: import.meta.env.VITE_CREDIBOARD_URL,
  ICOREBANKING_API_URL_QUERY: import.meta.env.VITE_ICOREBANKING_API_URL_QUERY,
  ICOREBANKING_API_URL_PERSISTENCE: import.meta.env
    .VITE_ICOREBANKING_API_URL_PERSISTENCE,
  IVITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE: import.meta.env
    .VITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE,
  IVITE_ISAAS_QUERY_PROCESS_SERVICE: import.meta.env
    .VITE_ISAAS_QUERY_PROCESS_SERVICE,
  VITE_ICLIENT_QUERY_PROCESS_SERVICE: import.meta.env
    .VITE_ICLIENT_QUERY_PROCESS_SERVICE,
  VITE_IPROSPECT_QUERY_PROCESS_SERVICE: import.meta.env
    .VITE_IPROSPECT_QUERY_PROCESS_SERVICE,
  VITE_IPROSPECT_PERSISTENCE_PROCESS_SERVICE: import.meta.env
    .VITE_IPROSPECT_PERSISTENCE_PROCESS_SERVICE,
  ORIGINATOR_ID: import.meta.env.VITE_ORIGINATOR_ID as string,
  IAUTH_URL: import.meta.env.VITE_IAUTH_URL as string,
  IAUTH_API_URL: import.meta.env.VITE_IAUTH_API_URL as string,
  VITE_ENV_STAFF_PORTAL_CATALOG_CODE: import.meta.env
    .VITE_ENV_STAFF_PORTAL_CATALOG_CODE,
};

const maxRetriesServices = 1;
const fetchTimeoutServices = 50000;

export {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
  secretKeyPortalId,
};
