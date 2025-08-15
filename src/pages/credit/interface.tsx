import { MdArrowBack } from "react-icons/md";
import {
  Breadcrumbs,
  Icon,
  Stack,
  useMediaQuery,
  Text,
} from "@inubekit/inubekit";

import { CreditCard } from "@components/cards/CreditCard";
import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";
import { OptionStaffPortal } from "@services/enum/isaas/catalogOfOptionsForStaffPortal";

import { addConfig } from "./config/credit.config";
import { ICreditUIProps } from "./types";
import { StyledArrowBack } from "./styles";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";

type IEnhancedSubOption = {
  key: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  url: string;
  isDisabled: boolean;
};

const CreditUI = (props: ICreditUIProps) => {
  const { isMobile, dataOptions, dataHeader } = props;

  const isTablet: boolean = useMediaQuery("(max-width: 1024px)");

  const mergeSubOptions = (
    backendOptions: IOptionStaff[],
  ): IEnhancedSubOption[] => {
    return backendOptions.flatMap((backendOption) => {
      const configOption = OptionStaffPortal.find(
        (item) => item.id === backendOption.publicCode,
      );

      if (!configOption || !Array.isArray(configOption.subOptions)) return [];

      const backendSubs = Array.isArray(backendOption.subOption)
        ? backendOption.subOption
        : [];

      return configOption.subOptions.map((sub) => {
        const match = backendSubs.find((opt) => opt.publicCode === sub.id);

        return {
          key: sub.id,
          icon: sub.icon,
          title: match?.abbreviatedName || sub.id,
          subtitle: match?.descriptionUse || sub.descriptionUse,
          url: sub.url ?? "",
          isDisabled: !match,
        };
      });
    });
  };

  const options = mergeSubOptions(
    Array.isArray(dataOptions) ? dataOptions : [dataOptions],
  );

  return (
    <>
      <Stack
        margin="20px auto"
        width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
        direction="column"
        gap="24px"
      >
        <GeneralHeader
          descriptionStatus={dataHeader.status}
          name={dataHeader.name}
          profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
        />
        <Breadcrumbs crumbs={addConfig.crumbs} />
        <Stack gap="64px" direction="column">
          <StyledArrowBack $isMobile={isMobile}>
            <Stack gap="8px" alignItems="center" width="100%">
              <Icon icon={<MdArrowBack />} appearance="dark" size="20px" />
              <Text type="title" size={isMobile ? "small" : "large"}>
                {addConfig.title}
              </Text>
            </Stack>
          </StyledArrowBack>
          <Stack
            direction={isTablet ? "column" : "row"}
            wrap="wrap"
            alignItems={isTablet ? "center" : "flex-start"}
          >
            {options.map(({ key, icon, title, subtitle, url, isDisabled }) => (
              <CreditCard
                key={key}
                icon={icon}
                title={title}
                subtitle={subtitle}
                url={url}
                isDisabled={isDisabled}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export { CreditUI };
