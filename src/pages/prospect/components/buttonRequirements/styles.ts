import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledButton {
  $data?: number;
}

export const StyledButton = styled.div<IStyledButton>`
  position: relative;
  cursor: pointer;

  &::before {
    content: "${({ $data }) => $data}";
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background-color: ${({ theme }) =>
      theme?.palette?.red?.R400 || inube.palette.red.R400};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) =>
      theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
    font-size: 14px;
    font-family: Roboto;
  }
`;
