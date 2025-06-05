import { Stack } from "@inubekit/inubekit";

import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { Fieldset } from "@components/data/Fieldset";
import { income } from "@mocks/add-prospect/income/income.mock";
import { getCreditLimit } from "@src/services/creditRequest/getCreditLimit";
import { useEffect } from "react";

interface ISourcesOfIncomeProps {
  isMobile: boolean;
}

export function SourcesOfIncome(props: ISourcesOfIncomeProps) {
  const { isMobile } = props;
  useEffect(() => {
    (async () => {
      const result = await getCreditLimit("test", "16378491");
      console.log(result, "R");
    })();
  }, []);
  return (
    <Fieldset>
      <Stack padding={isMobile ? "6px" : "0px"} justifyContent="center">
        <SourceIncome disabled={true} data={income} />
      </Stack>
    </Fieldset>
  );
}
