import styled from "styled-components";

interface IContainerLabel {
  $only?: boolean;
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

const StyledA = styled.a`
  text-decoration: none;
`;

export { StyledMenu, StyledContainerLabel, StyledA };
