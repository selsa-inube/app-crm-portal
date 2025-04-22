import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledOptionList {
  onClick?: React.ChangeEventHandler<HTMLInputElement>;
}

export const StyledOptionList = styled.ul<IStyledOptionList>`
  display: flex;
  flex-direction: column;
  width: -moz-available;
  width: -webkit-fill-available;
  padding: 4px 0px;
  position: absolute;
  z-index: 1;
  border-radius: 4px;
  background: ${({ theme }) => {
    return theme?.palette?.neutral?.N0 || inube.palette.neutral.N0;
  }};
  box-shadow:
    0px 1px 2px rgba(0, 0, 0, 0.3),
    0px 2px 6px 2px rgba(0, 0, 0, 0.15);
`;
