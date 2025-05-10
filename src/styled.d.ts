import "styled-components";
import { inube } from "@inubekit/inubekit";

type Theme = typeof inube;

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
