import styled from "styled-components";
interface Props {
  $width?: string;
}

export const StyledCreditCard = styled.div<Props>`
  width: ${({ $width }) => $width ?? "194px"};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border-radius: 12px;
  padding: 16px;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
`;
