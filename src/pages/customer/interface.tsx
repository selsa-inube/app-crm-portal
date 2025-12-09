import { MdOutlineArrowForward, MdReportProblem } from "react-icons/md";
import {
  Autocomplete,
  Button,
  Icon,
  IOption,
  Stack,
  Text,
} from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";

import { homeData } from "./config";
import { StyledAutomatic } from "./styles";

interface ICustomerUI {
  isMobile: boolean;
  inputValue: string;
  options: IOption[];
  showError: boolean;
  selectRef: React.RefObject<HTMLDivElement>;
  handleChangeAutocomplete: (event: string, value: string | null) => void;
  handleSubmit: () => void;
  messageError: string;
}

export function CustomerUI(props: ICustomerUI) {
  const {
    isMobile,
    inputValue,
    options,
    showError,
    selectRef,
    handleChangeAutocomplete,
    handleSubmit,
    messageError,
  } = props;

  return (
    <Stack
      width="100%"
      justifyContent="center"
      margin={isMobile ? "0px" : "50px 0"}
    >
      <Fieldset
        width="600px"
        showFieldset={isMobile ? false : true}
        hasOverflow
      >
        <Stack direction="column" gap="8px">
          <Text type="headline" size={isMobile ? "small" : "large"}>
            {homeData.selectClient}
          </Text>
          <Text type="body" size="large" appearance="gray">
            {homeData.text}
          </Text>
          <Fieldset hasOverflow>
            <Stack alignItems="center" gap="6px">
              <StyledAutomatic ref={selectRef}>
                <Autocomplete
                  id="clientSelect"
                  name="clientSelect"
                  fullwidth
                  placeholder={homeData.selectClient}
                  options={options}
                  value={inputValue}
                  onChange={handleChangeAutocomplete}
                />
              </StyledAutomatic>
              {isMobile ? (
                <Icon
                  icon={<MdOutlineArrowForward />}
                  appearance="primary"
                  variant="filled"
                  spacing="compact"
                  size="40px"
                  onClick={handleSubmit}
                />
              ) : (
                <Button onClick={handleSubmit}>{homeData.continue}</Button>
              )}
            </Stack>
            <>
              {showError && (
                <Stack gap="4px" margin="4px 0 0 16px ">
                  <Icon
                    icon={<MdReportProblem />}
                    appearance="danger"
                    size="14px"
                  />
                  <Text type="body" size="small" appearance="danger">
                    {messageError}
                  </Text>
                </Stack>
              )}
            </>
          </Fieldset>
        </Stack>
      </Fieldset>
    </Stack>
  );
}
