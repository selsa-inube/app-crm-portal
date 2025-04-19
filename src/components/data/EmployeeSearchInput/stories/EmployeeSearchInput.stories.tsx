import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { StoryFn, Meta } from "@storybook/react";
import { Formik } from "formik";

import { filteredEmployeesMock } from "./config";

import { SearchInput } from "../index";

interface Employee {
  names: string;
}

const meta: Meta<typeof SearchInput> = {
  component: SearchInput,
  title: "components/data/EmployeeSearchInput",
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

interface EmployeeSearchInputStoryArgs {
  keyword: string;
  setSearchTerm: (term: string) => void;
}

const Template: StoryFn<EmployeeSearchInputStoryArgs> = (args) => {
  const [searchTerm, setSearchTerm] = useState(args.keyword);
  const [isEmployeeSelected, setIsEmployeeSelected] = useState(false);

  const filteredEmployees = filteredEmployeesMock.filter((employee) =>
    employee.names.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Formik
      initialValues={{ keyword: searchTerm }}
      onSubmit={(values) => {
        console.log("Submitted values:", values);
      }}
    >
      {(formik) => {
        const handleSelection = (emp: Employee) => {
          setSearchTerm(emp.names);
          setIsEmployeeSelected(true);
        };

        return (
          <SearchInput
            value={searchTerm}
            setValue={setSearchTerm}
            formik={formik}
            filteredItems={searchTerm && !isEmployeeSelected ? filteredEmployees : []}
            handleItemSelection={handleSelection}
            renderItemLabel={(item) => item.names}
            placeholder="Buscar empleado"
          />
        );
      }}
    </Formik>
  );
};

export const Default = Template.bind({});
Default.args = {
  keyword: "",
  setSearchTerm: (term: string) => {
    console.log("Search term:", term);
  },
};

export const WithKeyword = Template.bind({});
WithKeyword.args = {
  keyword: "Juan Pérez",
  setSearchTerm: (term: string) => {
    console.log("Search term:", term);
  },
};

export const WithNoResults = Template.bind({});
WithNoResults.args = {
  keyword: "No existe",
  setSearchTerm: (term: string) => {
    console.log("Search term:", term);
  },
};

export default meta;
