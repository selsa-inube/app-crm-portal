import { MdWarningAmber } from "react-icons/md";
import { Stack, Icon, Text, Divider, SkeletonLine } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";

import LabelData from "./Config/config";

interface IUnfulfilledRequirementsProps {
  requirement: string;
  causeNonCompliance: string;
  hasError?: boolean;
  title?: string;
  isMobile?: boolean;
  isLoading?: boolean;
}

export const UnfulfilledRequirements = (
  props: IUnfulfilledRequirementsProps,
) => {
  const { title, requirement, causeNonCompliance, isMobile, isLoading } = props;

  return (
    <Fieldset
      title={title}
      isMobile={isMobile}
      width={isMobile ? "100%" : "49%"}
      borderColor="gray"
    >
      <Stack direction="column" gap="16px" padding="0 16px">
        <Stack direction="column" gap="4px">
          <Stack justifyContent="space-between" alignItems="center">
            {isLoading ? (
              <>
                <SkeletonLine width="120px" />
                <SkeletonLine width="24px" height="24px" />
              </>
            ) : (
              <>
                <Text ellipsis={true}>{LabelData.requirement}</Text>
                <Icon
                  icon={<MdWarningAmber />}
                  appearance="warning"
                  size="24px"
                />
              </>
            )}
          </Stack>
          <Divider />
          {isLoading ? (
            <SkeletonLine width="100%" />
          ) : (
            <Text appearance="gray" size="medium" type="body" ellipsis={true}>
              {requirement}
            </Text>
          )}
        </Stack>
        <Stack direction="column" gap="4px">
          {isLoading ? (
            <SkeletonLine width="160px" />
          ) : (
            <Text ellipsis={true}>{LabelData.causeNonCompliance}</Text>
          )}
          <Divider />
          {isLoading ? (
            <SkeletonLine width="100%" />
          ) : (
            <Text appearance="gray" size="medium" ellipsis>
              {causeNonCompliance}
            </Text>
          )}
        </Stack>
      </Stack>
    </Fieldset>
  );
};
