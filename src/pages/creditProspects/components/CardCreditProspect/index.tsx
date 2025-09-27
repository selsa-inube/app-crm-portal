import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineSend,
  MdOutlineMessage,
  MdOutlineInfo,
} from "react-icons/md";
import { useState } from "react";

import InfoModal from "@pages/prospect/components/InfoModal";
import { privilegeCrm } from "@config/privilege";
import { CardGray } from "@components/cards/CardGray";
import { IconText } from "@pages/prospect/components/IconText";
import { currencyFormat } from "@utils/formatData/currency";
import { capitalizeFirstLetter } from "@utils/formatData/text";
import { formatPrimaryDate } from "@utils/formatData/date";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";

import { StyledContainer } from "./styles";
import { cardCreditData } from "./config";

export interface ICardCreditProspectProps {
  title: string;
  borrower: string;
  numProspect: string;
  date: Date | undefined;
  value: number | string;
  isMobile: boolean;
  iconTitle: string;
  hasMessage?: boolean;
  handleMessage?: () => void;
  handleSend?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
}

export function CardCreditProspect(props: ICardCreditProspectProps) {
  const {
    title,
    borrower,
    numProspect,
    date,
    value,
    isMobile,
    iconTitle,
    hasMessage,
    handleMessage,
    handleSend = () => {},
    handleEdit = () => {},
    handleDelete = () => {},
  } = props;
  const { disabledButton: canRequestCredit } = useValidateUseCase({
    useCase: getUseCaseValue("canRequestCredit"),
  });
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <StyledContainer $isMobile={isMobile}>
      <Stack direction="column" padding="10px 16px" gap="12px">
        <Stack justifyContent="space-between">
          <Stack gap="12px">
            <Icon
              icon={<IconText icon={iconTitle} />}
              appearance="dark"
              size="24px"
            />
            <Text type="title" size="medium" weight="bold" appearance="dark">
              {title}
            </Text>
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
            label={cardCreditData.official}
            placeHolder={borrower}
            apparencePlaceHolder="gray"
          />
          <CardGray
            label={cardCreditData.numProspect}
            placeHolder={numProspect}
            apparencePlaceHolder="gray"
          />
          <CardGray
            label={cardCreditData.date}
            placeHolder={capitalizeFirstLetter(
              formatPrimaryDate(new Date(date as Date)),
            )}
            apparencePlaceHolder="gray"
          />
          <CardGray
            label={cardCreditData.value}
            placeHolder={value === 0 ? "$ 0" : currencyFormat(value as number)}
            apparencePlaceHolder="gray"
          />
        </Stack>
        <Stack direction="column" gap="12px">
          <Divider />
          <Stack gap="10px" justifyContent="flex-end">
            <Stack alignItems="center">
              <Icon
                icon={<MdOutlineSend />}
                appearance="primary"
                size="20px"
                onClick={handleSend}
                disabled={!handleSend || canRequestCredit}
                cursorHover
              />
              {canRequestCredit && (
                <Icon
                  icon={<MdOutlineInfo />}
                  appearance="primary"
                  size="16px"
                  cursorHover
                  onClick={handleInfo}
                />
              )}
            </Stack>
            <Icon
              icon={<MdOutlineEdit />}
              appearance="dark"
              size="20px"
              onClick={handleEdit}
              cursorHover
            />
            <Icon
              icon={<MdOutlineDelete />}
              appearance="danger"
              size="20px"
              onClick={handleDelete}
              cursorHover
            />
          </Stack>
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
