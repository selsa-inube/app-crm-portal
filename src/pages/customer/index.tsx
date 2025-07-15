import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMicNone } from "react-icons/md";
import { Autocomplete, Button, Icon, Stack, Text } from "@inubekit/inubekit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { getCustomerCatalog } from "@services/customerCatalog";
import { Fieldset } from "@components/data/Fieldset";
import { BaseModal } from "@components/modals/baseModal";
import { CustomerContext } from "@context/CustomerContext";

import { homeData } from "./config";
import { StyledMic, StyledAutomatic } from "./styles";

export function Customer() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [justStartedListening, setJustStartedListening] = useState(false);
  const [options, setOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const { setCustomerPublicCodeState } = useContext(CustomerContext);

  const selectRef = useRef<HTMLDivElement | null>(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const handleStartListening = () => {
    resetTranscript();
    setJustStartedListening(true);
    SpeechRecognition.startListening({ continuous: false, language: "es-ES" });
  };

  const handleCloseModal = () => {
    SpeechRecognition.stopListening();
    setIsShowModal(false);
  };

  const handleSearch = async (value: string) => {
    if (value.length < 3) {
      setOptions([]);
      return;
    }

    let response = null;
    if (/^\d+$/.test(value)) {
      response = await getCustomerCatalog("test", "", value);
    } else if (/^[A-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
      response = await getCustomerCatalog("test", value, "");
    }

    if (response && Array.isArray(response) && response.length > 0) {
      const mappedOptions = response.map((item, index) => ({
        id: `${index}`,
        label: `${item.publicCode} - ${item.fullName}`.toUpperCase(),
        value: item.publicCode,
      }));
      setOptions(mappedOptions);

      setTimeout(() => {
        const clickable = selectRef.current?.querySelector("input");
        if (clickable) {
          clickable.focus();
          clickable.dispatchEvent(
            new KeyboardEvent("keyup", { bubbles: true }),
          );
        }
      }, 50);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    if (inputValue.trim() === "") {
      setOptions([]);
      return;
    }
    handleSearch(inputValue);
  }, [inputValue]);

  useEffect(() => {
    const recognition = SpeechRecognition.getRecognition();
    if (recognition) {
      recognition.onend = () => {
        setIsShowModal(false);
      };
    }

    return () => {
      if (recognition) {
        recognition.onend = null;
      }
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      const cleanedTranscript = transcript
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()¿?¡!"'«»]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      setOptions([]);
      setInputValue(cleanedTranscript);
      setJustStartedListening(false);
    }
  }, [transcript]);

  const navigate = useNavigate();

  const handleSubmit = () => {
    setCustomerPublicCodeState(inputValue);
    navigate(`/`);
  };

  return (
    <Stack width="100%" justifyContent="center" margin="50px 0">
      <Fieldset width="600px" hasOverflow>
        <Stack direction="column" gap="8px">
          <Text type="headline" size="large">
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
                  onChange={(_, value) => {
                    const upperValue = value?.toUpperCase() || "";
                    setInputValue(upperValue);
                    if (!value) {
                      setOptions([]);
                    }
                  }}
                />
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
              <Button onClick={handleSubmit}>{homeData.continue}</Button>
            </Stack>
          </Fieldset>
        </Stack>
      </Fieldset>
      {isShowModal &&
        (browserSupportsSpeechRecognition ? (
          <BaseModal
            title={homeData.search}
            width="450px"
            handleClose={handleCloseModal}
          >
            <Stack direction="column" gap="24px">
              <Text type="title" size="large">
                {justStartedListening || !inputValue.trim()
                  ? homeData.listening
                  : inputValue}
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
            </Stack>
          </BaseModal>
        ) : (
          <BaseModal
            title={homeData.search}
            width="450px"
            handleClose={handleCloseModal}
          >
            <Text>{homeData.noSupport}</Text>
          </BaseModal>
        ))}
    </Stack>
  );
}
