import { Input, SkeletonLine, Stack } from "@inubekit/inubekit";

import { IMoneyDestination } from "@services/moneyDestination/types";
import { MoneyDestinationCard } from "@components/cards/MoneyDestinationCard";
import { Fieldset } from "@components/data/Fieldset";
import { ErrorModal } from "@components/modals/ErrorModal";
import { CardDeployMoneyDestination } from "@pages/prospect/components/cardDeployMoneyDestination";
import { dataMoneyDestination } from "./config";

interface MoneyDestinationUIProps {
  isTablet: boolean;
  selectedDestination: string;
  showErrorModal: boolean;
  messageError: string;
  loading: boolean;
  searchTerm: string;
  hasActiveSearch: boolean;
  groupedDestinations: { [type: string]: IMoneyDestination[] };
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (value: string) => void;
  navigate: (path: string) => void;
}

function MoneyDestinationUI(props: MoneyDestinationUIProps) {
  const {
    isTablet,
    selectedDestination,
    showErrorModal,
    messageError,
    loading,
    searchTerm,
    hasActiveSearch,
    groupedDestinations,
    setShowErrorModal,
    setSearchTerm,
    handleChange,
    navigate,
  } = props;

  return (
    <>
      <Fieldset heightFieldset="400px" alignContent={false}>
        <Stack direction="column" padding="0 16px">
          <Input
            id="keyWord"
            label="Buscar"
            placeholder={dataMoneyDestination.keyWord}
            type="search"
            fullwidth={isTablet}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          {loading ? (
            <Stack direction="column" gap="12px" padding="20px 0px 0 0">
              <SkeletonLine animated={true} />
              <SkeletonLine animated={true} />
              <SkeletonLine animated={true} />
            </Stack>
          ) : (
            Object.entries(groupedDestinations)
              .sort(([destinationA], [destinationB]) =>
                destinationA.localeCompare(destinationB),
              )
              .map(([type, group]) => (
                <CardDeployMoneyDestination
                  key={type}
                  title={type}
                  defaultOpen={hasActiveSearch}
                >
                  <Stack
                    direction="row"
                    wrap="wrap"
                    justifyContent={isTablet ? "center" : "initial"}
                    padding="0 16px 16px 16px"
                    gap="12px"
                  >
                    {group
                      .sort((groupA, groupB) =>
                        groupA.abbreviatedName.localeCompare(
                          groupB.abbreviatedName,
                        ),
                      )
                      .map((money) => (
                        <MoneyDestinationCard
                          key={money.moneyDestinationId}
                          id={money.moneyDestinationId}
                          name={money.abbreviatedName}
                          value={money.descriptionUse}
                          label={money.abbreviatedName}
                          icon={money.iconReference}
                          handleChange={() =>
                            handleChange(money.abbreviatedName)
                          }
                          isSelected={
                            selectedDestination === money.abbreviatedName
                          }
                          isMobile={isTablet}
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
          handleClose={() => {
            (setShowErrorModal(false), navigate("/credit/prospects"));
          }}
          isMobile={isTablet}
          message={messageError}
        />
      )}
    </>
  );
}

export { MoneyDestinationUI };
