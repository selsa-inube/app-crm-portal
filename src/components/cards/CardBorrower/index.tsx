import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";
import {
  MdOutlineAttachMoney,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlinePerson,
  MdOutlineRemoveRedEye,
} from "react-icons/md";

import { EnumType } from "@hooks/useEnum/useEnum";
import { TruncatedText } from "@components/modals/TruncatedTextModal";

import { StyledContainer } from "./styles";
import { newBorrowedData } from "./config";

export interface ICardBorrowerProps {
  title: string;
  name: string;
  lastName: string;
  email: string;
  income: string;
  obligations: string;
  lang: EnumType;
  handleView?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
  showIcons?: boolean;
  isMobile?: boolean;
  typeBorrower?: string;
}

export function CardBorrower(props: ICardBorrowerProps) {
  const {
    title,
    name,
    lastName,
    email,
    income,
    obligations,
    lang,
    handleView = () => {},
    handleEdit = () => {},
    handleDelete = () => {},
    showIcons = true,
    isMobile = false,
    typeBorrower,
  } = props;

  return (
    <StyledContainer $showIcons={showIcons} $isMobile={isMobile}>
      <Stack direction="column" padding="10px 16px" gap="12px">
        <Stack gap="12px">
          <Icon icon={<MdOutlinePerson />} appearance="gray" size="24px" />
          <Text type="title" size="medium" weight="bold" appearance="gray">
            {title}
          </Text>
        </Stack>
        <Divider dashed />
        <Stack direction="column" gap="8px">
          <Stack direction="column" gap="4px">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedData.names.i18n[lang]}
            </Text>
            <TruncatedText
              text={name}
              maxLength={27}
              type="body"
              size="large"
            />
          </Stack>
          <Stack direction="column" gap="4px">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedData.lastNames.i18n[lang]}
            </Text>
            <TruncatedText
              text={lastName}
              maxLength={27}
              type="body"
              size="large"
            />
          </Stack>
          <Stack direction="column" gap="4px">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedData.email.i18n[lang]}
            </Text>
            <TruncatedText
              text={email}
              maxLength={27}
              type="body"
              size="large"
            />
          </Stack>
          <Stack direction="column" gap="4px" justifyContent="center">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedData.income.i18n[lang]}
            </Text>
            <Stack alignItems="center">
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance={"success"}
                size="18px"
              />
              <TruncatedText
                text={income.replace("$", "")}
                maxLength={27}
                type="body"
                size="large"
              />
            </Stack>
          </Stack>
          <Stack direction="column" gap="4px" justifyContent="center">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedData.obligations.i18n[lang]}
            </Text>
            <Stack alignItems="center">
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance={"success"}
                size="18px"
              />
              <TruncatedText
                text={obligations.replace("$", "")}
                maxLength={27}
                type="body"
                size="large"
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="column" gap="12px">
          <Divider dashed />
          <Stack gap="10px" justifyContent="flex-end">
            <Icon
              icon={<MdOutlineRemoveRedEye />}
              appearance={"primary"}
              size="20px"
              onClick={handleView}
              cursorHover
            />
            {showIcons && (
              <>
                <Icon
                  icon={<MdOutlineEdit />}
                  appearance={"primary"}
                  size="20px"
                  onClick={handleEdit}
                  cursorHover
                />
                {typeBorrower != "MainBorrower" && (
                  <Icon
                    icon={<MdOutlineDelete />}
                    appearance={"primary"}
                    size="20px"
                    onClick={handleDelete}
                    cursorHover
                  />
                )}
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </StyledContainer>
  );
}
