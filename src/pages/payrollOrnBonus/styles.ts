import { styled } from "styled-components";
interface IStyledContainerAssisted {
  $cursorDisabled: boolean;
}

export const StyledArrowBack = styled.div`
  cursor: pointer;
  width: 500px;
`;
export const StyledContainerAssisted = styled.div<IStyledContainerAssisted>`
  & div > div:nth-child(3) button {
    cursor: ${({ $cursorDisabled }) =>
      $cursorDisabled ? "not-allowed" : "pointer"};
  }
`;
export const StyledContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: ${({ $isMobile }) => ($isMobile ? "100%" : "157px")};
  height: 50px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme?.palette?.neutral?.N30 || "#0052CC"};
`;
