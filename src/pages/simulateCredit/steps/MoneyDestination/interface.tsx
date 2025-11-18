import { SkeletonLine, Stack } from "@inubekit/inubekit";

import { IMoneyDestination } from "@services/moneyDestination/types";
import { MoneyDestinationCard } from "@components/cards/MoneyDestinationCard";
import { Fieldset } from "@components/data/Fieldset";
import { ErrorModal } from "@components/modals/ErrorModal";
import { CardDeployMoneyDestination } from "@pages/prospect/components/cardDeployMoneyDestination";

interface MoneyDestinationUIProps {
  isTablet: boolean;
  selectedDestination: string;
  showErrorModal: boolean;
  messageError: string;
  loading: boolean;
  groupedDestinations: { [type: string]: IMoneyDestination[] };
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (value: string) => void;
}

function MoneyDestinationUI(props: MoneyDestinationUIProps) {
  const {
    isTablet,
    selectedDestination,
    showErrorModal,
    messageError,
    loading,
    groupedDestinations,
    setShowErrorModal,
    handleChange,
  } = props;

  return (
    <>
      <Fieldset heightFieldset="400px" alignContent={false}>
        <Stack direction="column" padding="0 16px">
          {loading ? (
            <Stack direction="column" gap="12px">
              <SkeletonLine height="58px" />
              <SkeletonLine height="58px" />
              <SkeletonLine height="58px" />
            </Stack>
          ) : (
            Object.entries(groupedDestinations).map(([type, group]) => (
              <CardDeployMoneyDestination key={type} title={type}>
                <Stack
                  direction="row"
                  wrap="wrap"
                  justifyContent={isTablet ? "center" : "initial"}
                  padding="0 8px"
                  gap="12px"
                >
                  {group.map((money) => (
                    <MoneyDestinationCard
                      key={money.moneyDestinationId}
                      id={money.moneyDestinationId}
                      name={money.abbreviatedName}
                      value={money.descriptionUse}
                      label={money.abbreviatedName}
                      icon={money.iconReference}
                      handleChange={() => handleChange(money.abbreviatedName)}
                      isSelected={selectedDestination === money.abbreviatedName}
                    />
                  ))}
                </Stack>
              </CardDeployMoneyDestination>
            ))
          )}
        </Stack>
      </Fieldset>
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          isMobile={isTablet}
          message={messageError}
        />
      )}
    </>
  );
}

export { MoneyDestinationUI };
