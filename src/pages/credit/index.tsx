import { useMediaQuery } from "@inubekit/inubekit";
import { CreditUI } from "./interface";

const Credit = () => {
  const isMobile = useMediaQuery("(max-width: 880px)");

  return <CreditUI isMobile={isMobile} />;
};

export { Credit };
