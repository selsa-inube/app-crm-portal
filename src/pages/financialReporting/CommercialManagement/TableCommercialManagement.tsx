import { TableBoard } from "@components/data/TableBoard";
import { Accordion, type IAccordionProps } from "@components/data/Accordion";

interface IDataCommercialManagement {
  dataAccordeon: IAccordionProps[];
  dataRef: React.RefObject<HTMLDivElement>;
  isOpen?: boolean;
}

export const DataCommercialManagement = (props: IDataCommercialManagement) => {
  const { dataAccordeon, dataRef, isOpen = false } = props;
  return (
    <div ref={dataRef}>
      <TableBoard
        id="commercialManagement"
        titles={titlesCommercialManagement}
        entries={entriesCommercialManagement}
        appearanceTable={{ title: "dark", borderTable: true, widthTd: "180px" }}
      />
      {dataAccordeon.map((accordeon) => (
        <Accordion
          key={accordeon.name}
          name={accordeon.name}
          title={accordeon.title}
          content={accordeon.content}
          isOpen={isOpen}
        />
      ))}
    </div>
  );
};
