import { Stack } from "@inubekit/inubekit";

import { IMoneyDestination } from "@services/moneyDestination/types";
import { MoneyDestinationCard } from "@components/cards/MoneyDestinationCard";
import { Fieldset } from "@components/data/Fieldset";
import { MoneyDestinationTranslations } from "@services/enum/icorebanking-vi-crediboard/moneyDestination";

interface MoneyDestinationUIProps {
  destinations: IMoneyDestination[] | undefined;
  isTablet: boolean;
  selectedDestination: string;
  handleChange: (value: string) => void;
}

function MoneyDestinationUI(props: MoneyDestinationUIProps) {
  const { destinations, isTablet, handleChange, selectedDestination } = props;
  return (
    <Fieldset>
      <Stack
        direction="row"
        gap="12px"
        wrap="wrap"
        justifyContent={isTablet ? "center" : "initial"}
      >
        {destinations &&
          destinations.map((destination) => {
            const translation = MoneyDestinationTranslations.find(
              (item) => item.Code === destination.abbreviatedName,
            );

            return (
              <MoneyDestinationCard
                key={destination.moneyDestinationId}
                id={destination.moneyDestinationId}
                name={translation?.Name ?? destination.abbreviatedName}
                value={translation?.Description ?? destination.descriptionUse}
                label={translation?.Name ?? destination.abbreviatedName}
                icon={translation?.Value ?? destination.iconReference}
                handleChange={() => handleChange(destination.abbreviatedName)}
                isSelected={selectedDestination === destination.abbreviatedName}
              />
            );
          })}
      </Stack>
    </Fieldset>
  );
}

export { MoneyDestinationUI };
