import styled from "styled-components";

interface IStyledContainerProps {
  $isTruncated: boolean;
}

export const StyledContainer = styled.div<IStyledContainerProps>`
  cursor: ${({ $isTruncated }) => ($isTruncated ? "pointer" : "inherit")};
`;
