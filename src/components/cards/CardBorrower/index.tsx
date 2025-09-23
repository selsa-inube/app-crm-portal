import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";
import {
  MdOutlineAttachMoney,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlinePerson,
  MdOutlineRemoveRedEye,
} from "react-icons/md";

import { StyledContainer } from "./styles";
import { newBorrowedDAta } from "./config";

export interface ICardBorrowerProps {
  title: string;
  name: string;
  lastName: string;
  email: string;
  income: string;
  obligations: string;
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
              {newBorrowedDAta.names}
            </Text>
            <Text type="body" size="large">
              {name}
            </Text>
          </Stack>
          <Stack direction="column" gap="4px">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedDAta.lastNames}
            </Text>
            <Text type="body" size="large">
              {lastName}
            </Text>
          </Stack>
          <Stack direction="column" gap="4px">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedDAta.email}
            </Text>
            <Text type="body" size="large">
              {email}
            </Text>
          </Stack>
          <Stack direction="column" gap="4px" justifyContent="center">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedDAta.income}
            </Text>
            <Stack alignItems="center">
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance={"success"}
                size="18px"
              />
              <Text type="body" size="large">
                {income.replace("$", "")}
              </Text>
            </Stack>
          </Stack>
          <Stack direction="column" gap="4px" justifyContent="center">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedDAta.obligations}
            </Text>
            <Stack alignItems="center">
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance={"success"}
                size="18px"
              />
              <Text type="body" size="large">
                {obligations.replace("$", "")}
              </Text>
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
