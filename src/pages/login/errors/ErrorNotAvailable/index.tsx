import { ErrorPage } from "@components/layout/ErrorPage";

function ErrorNotAvailable() {
  return <ErrorPage errorCode={404} />;
}

export { ErrorNotAvailable };
