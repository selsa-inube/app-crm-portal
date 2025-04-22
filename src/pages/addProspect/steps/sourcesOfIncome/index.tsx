import { Stack } from "@inubekit/inubekit";

import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { Fieldset } from "@components/data/Fieldset";
import { income } from "@mocks/add-prospect/income/income.mock";

interface ISourcesOfIncomeProps {
  isMobile: boolean;
}

export function SourcesOfIncome(props: ISourcesOfIncomeProps) {
  const { isMobile } = props;

  return (
    <Fieldset>
      <Stack padding={isMobile ? "6px" : "0px"} justifyContent="center">
        <SourceIncome disabled={true} data={income} />
      </Stack>
    </Fieldset>
  );
}
