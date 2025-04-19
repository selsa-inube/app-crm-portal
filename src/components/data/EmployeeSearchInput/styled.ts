import styled from "styled-components";
import { inube } from "@inubekit/inubekit";
import { spacing } from "@design/tokens/spacing";

const StyledDropdownMenu = styled.div`
  position: absolute;
  cursor: pointer;
  top: 50px;
  left: 0px;
  width: 100%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding-top: ${spacing.s050};
  padding-bottom: ${spacing.s050};
  max-height: 300px;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    top: 50px;
    left: 0px;
  }
`;

const StyledDropdownItem = styled.div<{ $isselected?: boolean }>`
  padding: ${spacing.s050} ${spacing.s200};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 40px;
  background-color: ${({ $isselected, theme }) =>
    $isselected ? theme?.palette?.neutral?.N30 || inube.palette.neutral.N30 : "#fff"};

  &:hover {
    background-color: ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    & > * {
      color: ${({ theme }) => theme?.palette?.blue?.B400 || inube.palette.blue.B400};
    }
  }

  & > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const StyledTextfieldContainer = styled.div`
  position: relative;
  width: 100%;
`;

export { StyledDropdownItem, StyledTextfieldContainer, StyledDropdownMenu };
