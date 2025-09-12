import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledCollapseIcon {
  $showIcon: boolean;
  theme?: typeof inube;
}

export const Container = styled.div<IStyledCollapseIcon>`
  align-items: center;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  border: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  border-radius: 8px;
  box-shadow:
    0px 1px 3px 0px
      ${({ theme }) =>
        theme?.palette?.neutralAlpha?.N40A ||
        inube?.palette?.neutralAlpha?.N40A},
    0px 4px 8px 3px
      ${({ theme }) =>
        theme?.palette?.neutralAlpha?.N40A ||
        inube?.palette?.neutralAlpha?.N40A};
  display: flex;
  padding: 4px;
  width: ${({ $showIcon }) => ($showIcon ? "auto" : "100%")};

  @media print {
    height: 100%;
  }
`;
export const IconWrapper = styled.div`
  align-items: center;
  border-left: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
  display: flex;
  padding: 0px 8px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-around;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
`;

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;
