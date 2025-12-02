import { Divider, SkeletonLine, Stack } from "@inubekit/inubekit";
import { StyledContainer } from "./styles";

export function LoadCard() {
  return (
    <StyledContainer>
      <Stack direction="column" padding="8px" gap="17px">
        {Array.from({ length: 7 }).map((_, index) => (
          <SkeletonLine key={index} animated />
        ))}
      </Stack>
      <Stack padding="2px 8px">
        <Divider />
      </Stack>
    </StyledContainer>
  );
}
