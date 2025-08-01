import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
}

const StyledModal = styled.div<IStyledModal>`
  display: flex;
  width: ${({ $smallScreen }) => ($smallScreen ? "312px" : "450px")};
  padding: 24px;
  flex-direction: column;
  gap: 20px;
  border-radius: 36px;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral.N0 || inube.palette.neutral.N0};
`;

const StyledApplyPayContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme?.palette?.neutral.N40 || inube.palette.neutral.N40};
`;

const StyledApplyPayOption = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
`;

const StyledInputRadio = styled.input`
  cursor: pointer;
  accent-color: ${({ theme }) =>
    theme?.palette?.blue.B400 || inube.palette.blue.B400};
  margin: 0;
`;

export {
  StyledApplyPayContainer,
  StyledApplyPayOption,
  StyledModal,
  StyledInputRadio,
};
