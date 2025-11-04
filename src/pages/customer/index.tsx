import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOption, useMediaQuery } from "@inubekit/inubekit";

import { getCustomerCatalog } from "@services/customer/customerCatalog";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";

import { CustomerUI } from "./interface";
import { EErrorMessages } from "./config";
import { isValidUpperCaseName, isNumericString } from "./utils";

export function Customer() {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<IOption[]>([]);
  const [showError, setShowError] = useState(false);
  const [messageError, setMessageError] = useState("");

  const { setCustomerPublicCodeState } = useContext(CustomerContext);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const isMobile = useMediaQuery("(max-width:880px)");
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const handleSearch = async (value: string) => {
    try {
      if (value.length < 3) {
        setOptions([]);
        return;
      }

      let response = null;
      if (isNumericString(value)) {
        response = await getCustomerCatalog(
          businessUnitPublicCode,
          businessManagerCode,
          "",
          value,
        );
      } else if (isValidUpperCaseName(value)) {
        response = await getCustomerCatalog(
          businessUnitPublicCode,
          businessManagerCode,
          value,
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
  console.log("options: ", options);
  const handleChangeAutocomplete = (action: string, value: string | null) => {
    const upperValue = value?.toUpperCase() || "";
    setInputValue(upperValue);

    if (action === "clientSelect" && value === "") {
      setOptions([]);

      const clickable = selectRef.current?.querySelector("input");
      if (clickable) {
        clickable.focus();
        clickable.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
      }
      return;
    }

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
    setOptions([]);
    handleSearch(inputValue);
  }, [businessUnitSigla]);

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
    />
  );
}
