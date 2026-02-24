import { useContext, useEffect, useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { BaseModal } from "@components/modals/baseModal";
import { CardBorrower } from "@components/cards/CardBorrower";
import { Fieldset } from "@components/data/Fieldset";
import { IGuarantees, IProspect } from "@services/prospect/types";
import { currencyFormat } from "@utils/formatData/currency";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { AppContext } from "@context/AppContext";
import { useEnum } from "@hooks/useEnum/useEnum";
import { getGuaranteesById } from "@services/creditRequest/guarantees";
import { getTotalFinancialObligations } from "@pages/applyForCredit/util";

import { Mortgage } from "./Mortgage";
import { Pledge } from "./Pledge";
import { ScrollableContainer } from "./styles";
import { ErrorModal } from "../ErrorModal";
import { dataGuaranteeEnum, dataTabsEnum } from "./config";
import { Bond } from "./bail";

export interface IOfferedGuaranteeModalProps {
  handleClose: () => void;
  isMobile: boolean;
  prospectData: IProspect;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  requestId: string;
}

export function OfferedGuaranteeModal(props: IOfferedGuaranteeModalProps) {
  const {
    handleClose,
    isMobile,
    prospectData,
    businessUnitPublicCode,
    businessManagerCode,
    requestId,
  } = props;

  const [currentTab, setCurrentTab] = useState(dataTabsEnum.borrower.id);
  const [dataProperty, setDataProperty] = useState<IGuarantees[]>();
  const [isLoadingMortgage, setIsLoadingMortgage] = useState(false);
  const [isLoadingPledge, setIsLoadingPledge] = useState(false);
  const { eventData } = useContext(AppContext);

  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };
  const { lang } = useEnum();

  const dataResponse = prospectData;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");

  const fetchGuarantees = async () => {
    try {
      const result = await getGuaranteesById(
        businessUnitPublicCode,
        businessManagerCode,
        requestId,
        eventData.token || "",
      );
      setDataProperty(result);
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(dataGuaranteeEnum.errorPledge.i18n[lang]);
    }
  };

  const handleRetryMortgage = async () => {
    setIsLoadingMortgage(true);
    try {
      const result = await getGuaranteesById(
        businessUnitPublicCode,
        businessManagerCode,
        requestId,
        eventData.token || "",
      );
      setDataProperty(result);
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(dataGuaranteeEnum.errorMortgage.i18n[lang]);
    } finally {
      setIsLoadingMortgage(false);
    }
  };

  const handleRetryPledge = async () => {
    setIsLoadingPledge(true);
    try {
      const result = await getGuaranteesById(
        businessUnitPublicCode,
        businessManagerCode,
        requestId,
        eventData.token || "",
      );
      setDataProperty(result);
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(dataGuaranteeEnum.errorPledge.i18n[lang]);
    } finally {
      setIsLoadingPledge(false);
    }
  };

  useEffect(() => {
    fetchGuarantees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, requestId]);

  const [pledgeData, mortgageData] = [
    dataProperty?.find((i) => i.guaranteeType === "pledge")?.pledges ?? [],
    dataProperty?.find((i) => i.guaranteeType === "mortgage")?.mortgages ?? [],
  ];

  const nonMainBorrowers =
    dataResponse?.borrowers?.filter((b) => b.borrowerType !== "MainBorrower") ??
    [];

  const tabs = Object.values(dataTabsEnum).map((tab) => ({
    id: tab.id,
    label: tab.i18n[lang],
  }));

  const renderBorrowerContent = () => {
    if (!dataResponse?.borrowers || dataResponse.borrowers.length === 0) {
      return (
        <Fieldset>
          <Stack justifyContent="center" alignItems="center" height="290px">
            <ItemNotFound
              image={userNotFound}
              title={dataGuaranteeEnum.noBorrowersTitle.i18n[lang]}
              description={dataGuaranteeEnum.noBorrowersDescription.i18n[lang]}
              buttonDescription={dataGuaranteeEnum.retry.i18n[lang]}
            />
          </Stack>
        </Fieldset>
      );
    }

    if (nonMainBorrowers.length === 0) {
      return (
        <Fieldset>
          <Stack justifyContent="center" alignItems="center" height="290px">
            <ItemNotFound
              image={userNotFound}
              title={dataGuaranteeEnum.noBorrowersTitle.i18n[lang]}
              description={dataGuaranteeEnum.noBorrowersDescription.i18n[lang]}
              buttonDescription={dataGuaranteeEnum.retry.i18n[lang]}
            />
          </Stack>
        </Fieldset>
      );
    }

    return nonMainBorrowers.map((borrower, index) => (
      <Stack key={index} justifyContent="center" margin="8px 0px" width="100%">
        <CardBorrower
          title={`${dataGuaranteeEnum.borrower.i18n[lang]} ${index + 1}`}
          name={getPropertyValue(borrower.borrowerProperties, "name")}
          lastName={getPropertyValue(borrower.borrowerProperties, "surname")}
          email={getPropertyValue(borrower.borrowerProperties, "email")}
          income={currencyFormat(
            Number(
              getPropertyValue(borrower.borrowerProperties, "PeriodicSalary") ||
                0,
            ) +
              Number(
                getPropertyValue(
                  borrower.borrowerProperties,
                  "OtherNonSalaryEmoluments",
                ) || 0,
              ) +
              Number(
                getPropertyValue(
                  borrower.borrowerProperties,
                  "PensionAllowances",
                ) || 0,
              ),
            false,
          )}
          obligations={currencyFormat(
            getTotalFinancialObligations(borrower.borrowerProperties),
            false,
          )}
          showIcons={false}
          lang={lang}
        />
      </Stack>
    ));
  };

  return (
    <BaseModal
      title={dataGuaranteeEnum.title.i18n[lang]}
      nextButton={dataGuaranteeEnum.close.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "300px" : "602px"}
      height="560px"
      finalDivider={true}
    >
      <Stack>
        <Tabs
          scroll={isMobile}
          selectedTab={currentTab}
          tabs={tabs}
          onChange={onChange}
        />
      </Stack>
      <Stack width="100%">
        {currentTab === "borrower" && (
          <ScrollableContainer $hasData={nonMainBorrowers.length > 0}>
            {renderBorrowerContent()}
          </ScrollableContainer>
        )}
        {currentTab === "mortgage" && (
          <Mortgage
            isMobile={isMobile}
            initialValues={mortgageData}
            onRetry={handleRetryMortgage}
            isLoadingMortgage={isLoadingMortgage}
            lang={lang}
          />
        )}
        {currentTab === "pledge" && (
          <Pledge
            isMobile={isMobile}
            initialValues={pledgeData}
            onRetry={handleRetryPledge}
            isLoadingPledge={isLoadingPledge}
          />
        )}
        {currentTab === "bond" && (
          <Bond lang={lang} data={dataResponse?.bondValue ?? 0} />
        )}

        {showErrorModal && (
          <ErrorModal
            handleClose={() => {
              setShowErrorModal(false);
            }}
            isMobile={isMobile}
            message={messageError}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
