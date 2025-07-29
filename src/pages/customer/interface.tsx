import {
  MdOutlineArrowForward,
  MdOutlineMicNone,
  MdReportProblem,
} from "react-icons/md";
import {
  Autocomplete,
  Button,
  Icon,
  IOption,
  Stack,
  Text,
} from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { BaseModal } from "@components/modals/baseModal";

import { homeData } from "./config";
import { StyledAutomatic, StyledMic } from "./styles";

interface ICustomerUI {
  isMobile: boolean;
  isShowModal: boolean;
  inputValue: string;
  justStartedListening: boolean;
  options: IOption[];
  showError: boolean;
  noResultsFound: boolean;
  pendingTranscript: string;
  selectRef: React.RefObject<HTMLDivElement>;
  browserSupportsSpeechRecognition: boolean;
  handleStartListening: () => void;
  handleCloseModal: () => void;
  handleChangeAutocomplete: (event: unknown, value: string | null) => void;
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
}

export function CustomerUI(props: ICustomerUI) {
  const {
    isMobile,
    isShowModal,
    inputValue,
    justStartedListening,
    options,
    showError,
    noResultsFound,
    pendingTranscript,
    selectRef,
    browserSupportsSpeechRecognition,
    handleStartListening,
    handleCloseModal,
    handleChangeAutocomplete,
    setIsShowModal,
    handleSubmit,
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
                {showError && (
                  <Stack gap="4px" margin="4px 0 0 16px ">
                    <Icon
                      icon={<MdReportProblem />}
                      appearance="danger"
                      size="14px"
                    />
                    <Text type="body" size="small" appearance="danger">
                      {homeData.noSelectClient}
                    </Text>
                  </Stack>
                )}
              </StyledAutomatic>
              <Icon
                icon={<MdOutlineMicNone />}
                size="28px"
                appearance="primary"
                cursorHover
                onClick={() => {
                  setIsShowModal(true);
                  handleStartListening();
                }}
              />
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
          </Fieldset>
        </Stack>
      </Fieldset>
      {isShowModal &&
        (browserSupportsSpeechRecognition ? (
          <BaseModal
            title={homeData.search}
            width={isMobile ? "300px" : "450px"}
            handleClose={handleCloseModal}
          >
            <Stack direction="column" gap="24px">
              {noResultsFound ? (
                <>
                  <Text type="title" size="large">
                    {homeData.notFound}
                  </Text>
                  <Stack justifyContent="center">
                    <Icon
                      icon={<MdOutlineMicNone />}
                      size="58px"
                      appearance="gray"
                      shape="circle"
                      spacing="compact"
                      cursorHover
                      onClick={handleStartListening}
                    />
                  </Stack>
                </>
              ) : (
                <>
                  <Text type="title" size="large">
                    {justStartedListening ||
                    (!pendingTranscript && !inputValue.trim())
                      ? homeData.listening
                      : pendingTranscript || inputValue}
                  </Text>

                  <Stack justifyContent="center">
                    <StyledMic>
                      <Icon
                        icon={<MdOutlineMicNone />}
                        size="58px"
                        appearance="primary"
                        shape="circle"
                        variant="filled"
                        spacing="compact"
                        cursorHover
                        onClick={handleStartListening}
                      />
                    </StyledMic>
                  </Stack>
                </>
              )}
            </Stack>
          </BaseModal>
        ) : (
          <BaseModal
            title={homeData.search}
            width={isMobile ? "300px" : "450px"}
            handleClose={handleCloseModal}
          >
            <Text>{homeData.noSupport}</Text>
          </BaseModal>
        ))}
    </Stack>
  );
}
