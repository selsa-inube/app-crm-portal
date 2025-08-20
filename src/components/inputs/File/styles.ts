import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledFile {
  $withBorder?: boolean;
  theme: typeof inube;
  $isMobile: boolean;
  $spinnerLoading: boolean;
}

const StyledFile = styled.div<IStyledFile>`
  box-sizing: border-box;
  display: grid;
  align-items: center;
  grid-template-columns: 145px 1fr;
  gap: ${({ $isMobile }) => ($isMobile ? "70px" : "8px")};
  border-radius: 8px;
  padding: ${({ $spinnerLoading }) =>
    $spinnerLoading ? "12px 12px 12px 12px" : "12px 24px 12px 12px"};
  ${({ $withBorder, theme, $isMobile }) =>
    $withBorder
      ? `
          border: 1px solid ${theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
          min-width: ${$isMobile ? "240px" : "235px"};
          width: 100%;
          max-width: ${$isMobile ? "300px" : "235px"};
        `
      : "border: none;"}
`;

export { StyledFile };
