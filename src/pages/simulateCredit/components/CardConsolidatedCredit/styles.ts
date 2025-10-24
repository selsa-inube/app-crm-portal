import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledContainer {
  disabled?: boolean;
  $isMobile?: boolean;
}

export const StyledContainer = styled.div<IStyledContainer>`
  width: ${({ $isMobile }) => ($isMobile ? "276px" : "296px")};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  outline: 2px solid
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  box-shadow: 0px 4px 8px 3px rgba(9, 30, 66, 0.13);
  border: 1px solid
    ${({ disabled, theme }) =>
      disabled
        ? theme?.palette?.blue?.B400 || inube.palette.blue.B400
        : theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
`;

export const StyledInput = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};
`;

export const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: auto;
  padding: 24px 20px;
  gap: 16px;
  border-radius: 8px;
  background: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  border: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
`;

interface IStyledInputContainer {
  $disabled?: boolean;
}

export const StyledInputContainer = styled.div<IStyledInputContainer>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 8px;
  padding: 8px 12px;
  background: ${({ theme }) =>
    theme?.palette?.neutral.N10 || inube.palette.neutral.N10};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
`;

export const StyledInputRadio = styled.input`
  margin: 0;
  cursor: pointer;
  accent-color: ${({ theme }) =>
    theme?.palette?.blue.B400 || inube.palette.blue.B400};
`;
