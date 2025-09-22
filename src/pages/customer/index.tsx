import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOption, useMediaQuery } from "@inubekit/inubekit";

import { getCustomerCatalog } from "@services/customer/customerCatalog";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";

import { CustomerUI } from "./interface";
import { EErrorMessages } from "./config";

export function Customer() {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<IOption[]>([]);
  const [showError, setShowError] = useState(false);
  const [messageError, setMessageError] = useState("");

  const { setCustomerPublicCodeState } = useContext(CustomerContext);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const { businessUnitSigla } = useContext(AppContext);
  const isMobile = useMediaQuery("(max-width:880px)");
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const handleSearch = async (value: string) => {
    try {
      if (value.length < 3) {
        setOptions([]);
        return;
      }

      let response = null;
      if (/^\d+$/.test(value)) {
        response = await getCustomerCatalog(businessUnitPublicCode, "", value);
      } else if (/^[A-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
        response = await getCustomerCatalog(businessUnitPublicCode, value, "");
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
    } catch (error) {
      setMessageError(EErrorMessages.CLIENT_NOT_FOUND);
      setShowError(true);
      setOptions([]);
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
      setMessageError(EErrorMessages.NO_CLIENT_SELECTED);
      setShowError(true);
      return;
    }

    setShowError(false);
    setCustomerPublicCodeState(inputValue);
    navigate(`/home`);
  };

  useEffect(() => {
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
