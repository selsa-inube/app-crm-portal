const secretKeyPortalId = import.meta.env.VITE_SECRET_KEY_PORTAL_ID as string;
const isprod = import.meta.env.PROD;

const environment = {
  REDIRECT_URI: isprod
    ? import.meta.env.VITE_CALLBACK_URL
    : window.location.origin,
  TEMP_BUSINESS_UNIT: "test",
  GOOGLE_REDIRECT_URI: import.meta.env.VITE_LOGOUT_REDIRECT_URI,
  VITE_CREDIBOARD_URL: import.meta.env.VITE_CREDIBOARD_URL,
  ICOREBANKING_API_URL_QUERY: import.meta.env
    .VITE_ICOREBANKING_VI_CREDIBOARD_QUERY_PROCESS_SERVICE,
  ICOREBANKING_API_URL_PERSISTENCE: import.meta.env
    .VITE_ICOREBANKING_VI_CREDIBOARD_PERSISTENCE_PROCESS_SERVICE,
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
  VITE_STAFF_PORTAL_CATALOG_CODE: import.meta.env
    .VITE_STAFF_PORTAL_CATALOG_CODE,
};

const maxRetriesServices = 1;
const fetchTimeoutServices = 50000;

export {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
  secretKeyPortalId,
};
