import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledFile {
  $withBorder?: boolean;
  theme: typeof inube;
  isMobile: boolean;
}

const StyledFile = styled.div<IStyledFile>`
  display: flex;
  align-items: center;
  justify-content: ${(isMobile) => (isMobile ? "center" : "space-between")};
  justify-self: ${(isMobile) => (isMobile ? "center" : "start")};
  gap: 8px;
  border-radius: 8px;
  padding: 12px 24px 12px 12px;
  ${({ $withBorder, theme, isMobile }) =>
    $withBorder
      ? `
          border: 1px solid ${theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
          width: ${isMobile ? "250px" : "203px"};
        `
      : "border: none;"}
`;

export { StyledFile };
