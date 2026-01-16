import styled from "styled-components";

interface IStyledContainerProps {
  $isTruncated: boolean;
}

export const StyledContainer = styled.div<IStyledContainerProps>`
  cursor: ${({ $isTruncated }) => ($isTruncated ? "pointer" : "default")};
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  & > p,
  & > span {
    display: inline;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
