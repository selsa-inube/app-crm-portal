import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOption, useMediaQuery } from "@inubekit/inubekit";

import { getCustomerCatalog } from "@services/customer/customerCatalog";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { useEnum } from "@hooks/useEnum/useEnum";

import { CustomerUI } from "./interface";
import { EErrorMessages, VALIDATE_BLANK_SPACES_REGEX } from "./config";
import { isValidUpperCaseName, isNumericString } from "./utils";

export function Customer() {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<IOption[]>([]);
  const [showError, setShowError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const { lang } = useEnum();

  const { setCustomerPublicCodeState } = useContext(CustomerContext);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const isMobile = useMediaQuery("(max-width:880px)");
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const handleSearch = async (value: string) => {
    try {
      if (value.length < 1) {
        setOptions([]);
        return;
      }

      const formattedValue = value.replace(VALIDATE_BLANK_SPACES_REGEX, "%");

      let response = null;
      if (isNumericString(value)) {
        response = await getCustomerCatalog(
          businessUnitPublicCode,
          businessManagerCode,
          "",
          formattedValue,
        );
      } else if (isValidUpperCaseName(value)) {
        response = await getCustomerCatalog(
          businessUnitPublicCode,
          businessManagerCode,
          formattedValue,
          "",
        );
      }

      if (response && Array.isArray(response) && response.length > 0) {
        const mappedOptions = response.map((item, index) => ({
          id: `${index}`,
          label: `${item.publicCode} - ${item.fullName}`.toUpperCase(),
          value: item.publicCode,
        }));
        setShowError(false);

        setOptions(mappedOptions);
      } else {
        setOptions([]);
      }
    } catch (error) {
      setMessageError(EErrorMessages.ClientNotFound);
      setShowError(true);
      setOptions([]);
    }
  };

  const handleChangeAutocomplete = (__: string, value: string | null) => {
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
      return;
    }
    handleSearch(inputValue);
  }, [inputValue]);

  const navigate = useNavigate();

  const handleSubmit = () => {
    const isValidOption = options.some(
      (option) => option.value === inputValue || option.label === inputValue,
    );

    if (!isValidOption) {
      setMessageError(EErrorMessages.NoClientSelected);
      setShowError(true);
      return;
    }

    setShowError(false);
    setCustomerPublicCodeState(inputValue);
    navigate(`/home`);
  };

  useEffect(() => {
    if (selectRef.current) {
      const inputIsEmpty = !inputValue || inputValue.trim() === "";
      const optionsAreEmpty = options.length === 0;

      if (inputIsEmpty && !optionsAreEmpty) return;

      const isAlreadySelected = options.some(
        (option) => option.value === inputValue || option.label === inputValue,
      );

      if (isAlreadySelected) return;

      const inputElement = selectRef.current.querySelector("input");

      if (inputElement) {
        const isFocused = document.activeElement === inputElement;

        if (!inputIsEmpty && !isFocused) return;

        const event = new KeyboardEvent("keyup", {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          bubbles: true,
          cancelable: true,
          view: window,
        });

        inputElement.dispatchEvent(event);
      }
    }
  }, [options, businessUnitSigla, inputValue]);

  return (
    <CustomerUI
      isMobile={isMobile}
      inputValue={inputValue}
      options={options}
      showError={showError}
      selectRef={selectRef}
      handleChangeAutocomplete={handleChangeAutocomplete}
      handleSubmit={handleSubmit}
      messageError={messageError}
      lang={lang}
    />
  );
}
