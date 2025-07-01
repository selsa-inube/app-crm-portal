import { useEffect, useRef, useState } from "react";
import { MdOutlineMicNone } from "react-icons/md";
import { Button, Icon, Input, Select, Stack, Text } from "@inubekit/inubekit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { getCustomerCatalog } from "@services/customerCatalog";
import { Fieldset } from "@components/data/Fieldset";
import { BaseModal } from "@components/modals/baseModal";

import { homeData } from "./config";
import { StyledMic, StyledAutomatic } from "./styles";

export function Customer() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [options, setOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const [justStartedListening, setJustStartedListening] = useState(false);

  const selectRef = useRef<HTMLDivElement | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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
    if (value.length > 3) {
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
        setSelectValue(mappedOptions[0]?.value || "");

        if (mappedOptions.length > 1) {
          setTimeout(() => {
            const clickable = selectRef.current?.querySelector("input");
            clickable?.dispatchEvent(
              new MouseEvent("click", { bubbles: true }),
            );
          }, 100);
        }
      } else {
        setOptions([]);
        setSelectValue("");
      }
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);

    if (value.trim() === "") {
      setOptions([]);
      setSelectValue("");
      return;
    }

    handleSearch(value);
  };

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    const recognition = SpeechRecognition.getRecognition();

    if (recognition) {
      recognition.onend = () => {
        if (listening) {
          setIsShowModal(false);
        }
      };
    }

    return () => {
      if (recognition) {
        recognition.onend = null;
      }
    };
  }, [listening]);

  useEffect(() => {
    if (transcript) {
      const cleanedTranscript = transcript
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()¿?¡!"'«»]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      setInputValue(cleanedTranscript);
      setJustStartedListening(false);
      handleSearch(cleanedTranscript);
    }
  }, [transcript]);

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
              {options.length > 1 ? (
                <StyledAutomatic ref={selectRef}>
                  <Select
                    id="clientSelect"
                    name="clientSelect"
                    fullwidth
                    placeholder="Resultados encontrados"
                    value={selectValue}
                    onChange={(_, value) => {
                      setSelectValue(value);
                      if (!value) {
                        setInputValue("");
                        setOptions([]);
                      }
                    }}
                    options={options}
                  />
                </StyledAutomatic>
              ) : (
                <Input
                  id="keyWord"
                  name="keyWord"
                  placeholder="Selecciona un cliente"
                  fullwidth
                  value={inputValue}
                  onChange={handleInputChange}
                />
              )}

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
              <Button>{homeData.continue}</Button>
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
