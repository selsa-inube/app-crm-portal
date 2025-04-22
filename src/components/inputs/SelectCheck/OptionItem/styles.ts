import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledOptionItemChecked = styled.li`
  display: flex;
  align-items: center;
  align-self: stretch;
  min-height: 40px;
  border-left: 4px solid transparent;
  padding: 4px 16px 4px 12px;
  cursor: pointer;
  border-left-width: 4px;
  border-left-style: solid;

  p {
    color: ${({ theme }) =>
      theme?.palette?.neutral?.N900 || inube.palette.neutral.N900};
  }

  label {
    margin-left: 5px;
    cursor: pointer;
  }

  &:hover {
    border-left-color: ${({ theme }) =>
      theme?.palette?.blue?.B400 || inube.palette.blue.B400};

    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N20 || inube.palette.neutral.N20};

    p {
      color: ${({ theme }) =>
        theme?.palette?.blue?.B400 || inube.palette.blue.B400};
    }
  }
`;
