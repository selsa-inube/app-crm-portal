import { useState } from "react";
import { Selectcheck, ISelectcheckProps } from "..";

export const ControllerSelectCheck = (props: ISelectcheckProps) => {
  const { options } = props;

  const [data, setData] = useState(options);

  const handleToggleEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.tagName === "LI") {
      const elementInput = e.target.querySelector("input");
      if (elementInput) {
        const { name, checked } = elementInput;
        const newData = data.map((entry) => {
          if (entry.id === name) {
            return { ...entry, checked: !checked };
          }
          return entry;
        });
        return setData(newData);
      }
    }

    const { name, checked } = e.target;
    const newData = data.map((entry) => {
      if (entry.id === name) {
        return { ...entry, checked };
      }
      return entry;
    });
    setData(newData);
  };

  return (
    <Selectcheck onChangeCheck={handleToggleEntry} {...props} options={data} />
  );
};
