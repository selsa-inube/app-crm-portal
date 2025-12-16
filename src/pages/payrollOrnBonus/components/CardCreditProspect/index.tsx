import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";
import { MdOutlineMessage } from "react-icons/md";
import { useState } from "react";

import InfoModal from "@pages/prospect/components/InfoModal";
import { privilegeCrm } from "@config/privilege";
import { CardGray } from "@components/cards/CardGray";
import { IconText } from "@pages/prospect/components/IconText";
import {
  capitalizeFirstLetter,
  truncateTextToMaxLength,
} from "@utils/formatData/text";
import { formatPrimaryDate } from "@utils/formatData/date";

import { StyledContainer } from "./styles";
import { cardCreditData } from "./config";

export interface ICardCreditProspectProps {
  title: string;
  borrower: string;
  date: Date | undefined;
  value: string;
  isMobile: boolean;
  iconTitle?: string;
  hasMessage?: boolean;
  handleMessage?: () => void;
  handleSend?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
  titleQuota: string;
}

export function CardCreditProspect(props: ICardCreditProspectProps) {
  const {
    title,
    borrower,

    date,
    value,
    isMobile,
    iconTitle,
    hasMessage,
    titleQuota,
    handleMessage,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <StyledContainer $isMobile={isMobile}>
      <Stack direction="column" padding="10px 16px" gap="12px">
        <Stack justifyContent="center" alignItems="center">
          <Stack gap="12px" direction="column" justifyContent="center">
            <Stack direction="column" gap="2px">
              <Text size="small" appearance="gray" textAlign="center">
                {truncateTextToMaxLength(titleQuota)}
              </Text>
              <Icon
                icon={<IconText icon={iconTitle || ""} />}
                appearance="dark"
                size="24px"
              />
              <Text
                type="title"
                size="large"
                weight="bold"
                appearance="primary"
                textAlign="center"
              >
                {truncateTextToMaxLength(title, 20)}
              </Text>
            </Stack>
          </Stack>
          {hasMessage && (
            <Icon
              icon={<MdOutlineMessage />}
              appearance="primary"
              size="20px"
              onClick={handleMessage}
              cursorHover
            />
          )}
        </Stack>
        <Divider dashed />
        <Stack direction="column" gap="8px">
          <CardGray
            label={cardCreditData.date}
            placeHolder={capitalizeFirstLetter(
              formatPrimaryDate(new Date(date as Date)),
            )}
            apparencePlaceHolder="gray"
          />
          <CardGray
            label={cardCreditData.official}
            placeHolder={borrower}
            apparencePlaceHolder="gray"
          />
          <CardGray
            label={cardCreditData.value}
            placeHolder={value}
            apparencePlaceHolder="gray"
          />
        </Stack>

        {isModalOpen ? (
          <InfoModal
            onClose={handleInfoModalClose}
            title={privilegeCrm.title}
            subtitle={privilegeCrm.subtitle}
            description={privilegeCrm.description}
            nextButtonText={privilegeCrm.nextButtonText}
            isMobile={isMobile}
          />
        ) : (
          <></>
        )}
      </Stack>
    </StyledContainer>
  );
}
