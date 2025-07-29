import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOption, useMediaQuery } from "@inubekit/inubekit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { getCustomerCatalog } from "@services/customerCatalog";
import { CustomerContext } from "@context/CustomerContext";

import { CustomerUI } from "./interface";

export function Customer() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [justStartedListening, setJustStartedListening] = useState(false);
  const [options, setOptions] = useState<IOption[]>([]);
  const [showError, setShowError] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [pendingTranscript, setPendingTranscript] = useState("");

  const { setCustomerPublicCodeState } = useContext(CustomerContext);

  const selectRef = useRef<HTMLDivElement | null>(null);

  const isMobile = useMediaQuery("(max-width:880px)");

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const handleStartListening = () => {
    resetTranscript();
    setJustStartedListening(true);
    setNoResultsFound(false);
    SpeechRecognition.startListening({ continuous: false, language: "es-ES" });
  };

  const handleCloseModal = () => {
    SpeechRecognition.stopListening();
    setIsShowModal(false);
    setNoResultsFound(false);
  };

  const handleSearch = async (value: string) => {
    if (value.length < 3) {
      setOptions([]);
      setNoResultsFound(false);
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
      setNoResultsFound(false);
      setIsShowModal(false);

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
      setNoResultsFound(true);
    }
  };

  const handleChangeAutocomplete = (_: unknown, value: string | null) => {
    const upperValue = value?.toUpperCase() || "";
    setInputValue(upperValue);
    setShowError(false);
    if (!value) {
      setOptions([]);
    }
  };

  useEffect(() => {
    if (inputValue.trim() === "") {
      setOptions([]);
      setNoResultsFound(false);
      return;
    }
    handleSearch(inputValue);
  }, [inputValue]);

  useEffect(() => {
    const recognition = SpeechRecognition.getRecognition();
    if (recognition) {
      recognition.onend = () => {};
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

      setPendingTranscript(cleanedTranscript);
      setJustStartedListening(false);

      const timer = setTimeout(() => {
        setInputValue(cleanedTranscript);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [transcript]);

  const navigate = useNavigate();

  const handleSubmit = () => {
    const isValidOption = options.some(
      (option) => option.value === inputValue || option.label === inputValue,
    );

    if (!isValidOption) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setCustomerPublicCodeState(inputValue);
    navigate(`/home`);
  };

  return (
    <CustomerUI
      isMobile={isMobile}
      isShowModal={isShowModal}
      inputValue={inputValue}
      justStartedListening={justStartedListening}
      options={options}
      showError={showError}
      noResultsFound={noResultsFound}
      pendingTranscript={pendingTranscript}
      selectRef={selectRef}
      browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
      handleStartListening={handleStartListening}
      handleCloseModal={handleCloseModal}
      handleChangeAutocomplete={handleChangeAutocomplete}
      setIsShowModal={setIsShowModal}
      handleSubmit={handleSubmit}
    />
  );
}
