import { MdWarningAmber } from "react-icons/md";
import { Stack, Icon, Divider, SkeletonLine } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { EnumType } from "@hooks/useEnum/useEnum";
import { TruncatedText } from "@components/modals/TruncatedTextModal";

import LabelData from "./Config/config";

interface IUnfulfilledRequirementsProps {
  requirement: string;
  causeNonCompliance: string;
  lang: EnumType;
  hasError?: boolean;
  title?: string;
  isMobile?: boolean;
  isLoading?: boolean;
}

export const UnfulfilledRequirements = (
  props: IUnfulfilledRequirementsProps,
) => {
  const { title, requirement, lang, causeNonCompliance, isMobile, isLoading } =
    props;

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
                <TruncatedText
                  text={LabelData.requirement.i18n[lang]}
                  maxLength={68}
                />
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
            <TruncatedText
              text={requirement}
              maxLength={68}
              appearance="gray"
              size="medium"
              type="body"
            />
          )}
        </Stack>
        <Stack direction="column" gap="4px">
          {isLoading ? (
            <SkeletonLine width="160px" />
          ) : (
            <TruncatedText
              text={LabelData.causeNonCompliance.i18n[lang]}
              maxLength={68}
              appearance="gray"
              size="medium"
            />
          )}
          <Divider />
          {isLoading ? (
            <SkeletonLine width="100%" />
          ) : (
            <TruncatedText
              text={causeNonCompliance}
              appearance="gray"
              size="medium"
            />
          )}
        </Stack>
      </Stack>
    </Fieldset>
  );
};
