import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

interface IContainerLabel {
  $only?: boolean;
}

interface IBadgeMenuProspect {
  isMobile: boolean;
  $data?: number;
}

const StyledMenu = styled.div`
  background-color: #ffff;
  border-radius: 8px;
  box-shadow:
    0px 4px 4px 0px #091e4221,
    0px 8px 12px 6px #091e4221;
  padding: 6px 0px;
  position: absolute;
  right: 1px;
  width: 227px;
  justify-content: space-between;
`;

const StyledContainerLabel = styled.div<IContainerLabel>`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: ${({ $only }) => ($only ? "auto" : "40px")};
  gap: 8px;
  margin: 0px;
  padding: ${({ $only }) => ($only ? "0px 6px" : "12px 16px")};

  &:hover {
    background-color: #f4f5f7;
    cursor: pointer;
  }
`;

const StyledAnchor = styled.a`
  text-decoration: none;
`;

export const StyleBadgeMenuProspect = styled.div<IBadgeMenuProspect>`
  position: relative;
  cursor: pointer;
  & > button {
    z-index: -1;
  }

  &::before {
    content: "${({ $data }) => $data}";
    position: absolute;
    top: -12px;
    right: -5px;
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

export { StyledMenu, StyledContainerLabel, StyledAnchor };
