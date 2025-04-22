import styled from "styled-components";

interface ImageProps {
  $smallScreen: boolean;
}

const StyledImage = styled.img<ImageProps>`
  max-width: 152px;
  height: auto;
  display: block;
`;

export { StyledImage };
