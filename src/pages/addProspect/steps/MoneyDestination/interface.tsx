import { Stack } from "@inubekit/inubekit";

import { IMoneyDestination } from "@services/moneyDestination/types";
import { MoneyDestinationCard } from "@components/cards/MoneyDestinationCard";
import { Fieldset } from "@components/data/Fieldset";

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
        padding={isTablet ? "0px 4px" : "10px 16px"}
      >
        {destinations &&
          destinations.map((destination) => (
            <MoneyDestinationCard
              key={destination.moneyDestinationId}
              id={destination.moneyDestinationId}
              name={destination.abbreviatedName}
              value={destination.descriptionUse}
              label={destination.abbreviatedName}
              icon={destination.iconReference}
              handleChange={() => handleChange(destination.abbreviatedName)}
              isSelected={selectedDestination === destination.abbreviatedName}
            />
          ))}
      </Stack>
    </Fieldset>
  );
}

export { MoneyDestinationUI };
