import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineBeachAccess,
  MdOutlineShare,
  MdOutlineInfo,
} from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  Divider,
  useMediaQuery,
  Button,
} from "@inubekit/inubekit";

import { ShareCreditModal } from "@components/modals/ShareCreditModal";
import { Fieldset } from "@components/data/Fieldset";
import { CreditProspect } from "@pages/prospect/components/CreditProspect";
import { mockEditProspect } from "@mocks/add-prospect/edit-prospect/editprospect.mock";
import { GeneralHeader } from "@pages/addProspect/components/GeneralHeader";
import { CustomerContext } from "@context/CustomerContext";
import { getSearchProspectByCode } from "@services/prospects/AllProspects";
import { IProspect } from "@services/prospects/types";
import { AppContext } from "@context/AppContext";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { getCreditRequestByCode } from "@services/creditRequest/getCreditRequestByCode";
import { ErrorPage } from "@components/layout/ErrorPage";
import { BaseModal } from "@components/modals/baseModal";
import { ICreditRequest } from "@services/types";

import { StyledMarginPrint, StyledPrint } from "./styles";
import { dataEditProspect, titlesModal } from "./config";
import { ruleConfig } from "../SubmitCreditApplication/config/configRules";
import { evaluateRule } from "../SubmitCreditApplication/evaluateRule";

export function EditProspect() {
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [dataProspect, setDataProspect] = useState<IProspect>();

  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreditRequest, setShowCreditRequest] = useState(false);

  const isMobile = useMediaQuery("(max-width:880px)");
  const { customerPublicCode, prospectCode } = useParams();

  const dataCreditRef = useRef<ICreditRequest>();
  const valueRuleRef = useRef<{ [ruleName: string]: string[] }>({});

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const data = mockEditProspect[0];

  const { customerData } = useContext(CustomerContext);
  const navigate = useNavigate();

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const hasPermitSubmit = !!eventData.user.staff.useCases.canSubmitProspect;

  const fetchValidateCreditRequest = useCallback(async () => {
    try {
      const result = await getCreditRequestByCode(
        businessUnitPublicCode,
        prospectCode!,
      );

      const creditData = Array.isArray(result) ? result[0] : result;

      dataCreditRef.current = creditData;
      return creditData;
    } catch (error) {
      console.error("Error al obtener las solicitudes de crédito:", error);
      return null;
    }
  }, [businessUnitPublicCode, prospectCode]);

  const handleSubmitClick = async () => {
    const result = await fetchValidateCreditRequest();

    if (result) {
      setShowCreditRequest(true);
      return;
    }

    navigate(
      `/credit/submit-credit-application/${customerPublicCode}/${prospectCode}`,
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanConditions = (rule: any) => {
    if (!rule) return rule;

    const cleaned = { ...rule };

    if (Array.isArray(cleaned.conditions)) {
      const hasValidCondition = cleaned.conditions.some(
        (c: { value: unknown }) =>
          c.value !== undefined && c.value !== null && c.value !== "",
      );
      if (!hasValidCondition) {
        delete cleaned.conditions;
      }
    }
    return cleaned;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchProspectByCode(
          businessUnitPublicCode,
          prospectCode!,
        );
        setDataProspect(Array.isArray(result) ? result[0] : result);
      } catch (error) {
        console.error("Error al obtener el prospecto:", error);
      }
    };

    fetchData();
  }, [businessUnitPublicCode]);

  const fetchValidationRules = useCallback(async () => {
    const rulesToCheck = [
      "ModeOfDisbursementType",
      "ValidationGuarantee",
      "ValidationCoBorrower",
    ];
    const notDefinedRules: string[] = [];
    await Promise.all(
      rulesToCheck.map(async (ruleName) => {
        try {
          const rule = cleanConditions(ruleConfig[ruleName]?.({}));
          if (!rule) return notDefinedRules.push(ruleName);
          await evaluateRule(
            rule,
            postBusinessUnitRules,
            "value",
            businessUnitPublicCode,
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error?.response?.status === 400) notDefinedRules.push(ruleName);
        }
      }),
    );

    if (notDefinedRules.length >= 1) {
      setCodeError(1013);
      setAddToFix(notDefinedRules);
    }
  }, [businessUnitPublicCode]);

  const fetchValidationRulesData = useCallback(async () => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    const creditProducts = dataProspect?.credit_products;

    if (!clientInfo.associateType || !creditProducts?.length || !dataProspect)
      return;

    const dataRulesBase = {
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      LoanAmount: dataProspect.requested_amount,
      PrimaryIncomeType: "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };

    const rulesValidate = [
      "ModeOfDisbursementType",
      "ValidationGuarantee",
      "ValidationCoBorrower",
    ];

    for (const product of creditProducts) {
      if (!product || typeof product !== "object") continue;

      const dataRules = {
        ...dataRulesBase,
        LineOfCredit: product.line_of_credit_abbreviated_name,
      };
      await Promise.all(
        rulesValidate.map(async (ruleName) => {
          const rule = ruleConfig[ruleName]?.(dataRules);
          if (!rule) return;

          try {
            const values = await evaluateRule(
              rule,
              postBusinessUnitRules,
              "value",
              businessUnitPublicCode,
            );

            const extractedValues = Array.isArray(values)
              ? values
                  .map((v) => (typeof v === "string" ? v : (v?.value ?? "")))
                  .filter((val): val is string => val !== "")
              : [];

            if (
              ruleName === "ModeOfDisbursementType" &&
              extractedValues.length === 0
            ) {
              setCodeError(1014);
              setAddToFix([ruleName]);
              return;
            }

            valueRuleRef.current = {
              ...valueRuleRef.current,
              [ruleName]: extractedValues,
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            console.error(
              `Error evaluando ${ruleName} para producto`,
              product,
              error,
            );
          }
        }),
      );
    }
  }, [customerData, dataProspect, businessUnitPublicCode]);

  useEffect(() => {
    if (customerData && dataProspect) {
      fetchValidationRules();
      fetchValidationRulesData();
    }
  }, [customerData, dataProspect, fetchValidationRulesData]);

  const handleInfo = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {codeError ? (
        <ErrorPage errorCode={codeError} addToFix={addToFix || []} />
      ) : (
        <>
          <GeneralHeader
            buttonText="Agregar vinculación"
            descriptionStatus={dataHeader.status}
            name={dataHeader.name}
            profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
          />
          <StyledMarginPrint>
            <Stack padding="24px">
              <Stack
                width={isMobile ? "-webkit-fill-available" : "min(100%,1440px)"}
                margin="0 auto"
                direction="column"
                gap="20px"
              >
                <Fieldset>
                  <Stack gap="16px" direction="column" padding="4px 16px">
                    <Stack justifyContent="space-between" alignItems="center">
                      <Stack
                        gap={isMobile ? "0" : "8px"}
                        direction={isMobile ? "column" : "row"}
                      >
                        <Text
                          type="title"
                          weight="bold"
                          size="large"
                          appearance="gray"
                        >
                          {dataEditProspect.creditProspect}
                        </Text>
                        <Text
                          type="title"
                          weight="bold"
                          size="large"
                          appearance="gray"
                        >
                          #{prospectCode}
                        </Text>
                      </Stack>
                      <StyledPrint>
                        <Icon
                          icon={<MdOutlineShare />}
                          appearance="primary"
                          size="20px"
                          cursorHover
                          onClick={() => setShowShareModal(true)}
                        />
                      </StyledPrint>
                    </Stack>
                    <Divider dashed />
                    <Stack
                      justifyContent="space-between"
                      alignItems="center"
                      direction={isMobile ? "column" : "row"}
                      gap="16px"
                    >
                      <Stack gap="8px" direction="column" alignItems="center">
                        <Stack gap="8px">
                          <Icon
                            icon={<MdOutlineBeachAccess />}
                            appearance="dark"
                            size="28px"
                          />
                          <Stack
                            direction="column"
                            alignItems="center"
                            gap="8px"
                          >
                            <Text type="title" size="large">
                              {data.choiceDestination}
                            </Text>
                          </Stack>
                        </Stack>
                        <Text type="body" size="small" appearance="gray">
                          {dataEditProspect.destination}
                        </Text>
                      </Stack>
                      <Stack direction="column" alignItems="center" gap="8px">
                        <Text type="title" size="large" textAlign="center">
                          {data.name}
                        </Text>
                        <Text type="body" size="small" appearance="gray">
                          {data.customer}
                        </Text>
                      </Stack>
                      <Stack direction="column" alignItems="center" gap="8px">
                        <Stack gap="8px">
                          <Text
                            type="headline"
                            weight="bold"
                            size="large"
                            appearance="primary"
                          >
                            $
                          </Text>
                          <Text
                            type="headline"
                            weight="bold"
                            size="large"
                            appearance="primary"
                          >
                            {data.value}
                          </Text>
                        </Stack>
                        <Text type="body" size="small" appearance="gray">
                          {dataEditProspect.value}
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Fieldset>
                <Fieldset>
                  <CreditProspect
                    isMobile={isMobile}
                    showMenu={() => setShowMenu(false)}
                    showPrint={true}
                    isPrint={true}
                    prospectData={dataProspect!}
                  />
                </Fieldset>
                <StyledPrint>
                  <Stack gap="20px" justifyContent="end" padding="0 0 16px 0">
                    <Button appearance="danger" variant="outlined">
                      {dataEditProspect.delete}
                    </Button>
                    <Stack gap="2px" alignItems="center">
                      <Button
                        onClick={handleSubmitClick}
                        disabled={
                          dataProspect?.state === "Submitted" ||
                          !hasPermitSubmit
                            ? true
                            : false
                        }
                      >
                        {dataEditProspect.confirm}
                      </Button>
                      {!hasPermitSubmit ||
                        (dataProspect?.state === "Submitted" && (
                          <Icon
                            icon={<MdOutlineInfo />}
                            appearance="primary"
                            size="16px"
                            cursorHover
                            onClick={handleInfo}
                          />
                        ))}
                    </Stack>
                  </Stack>
                </StyledPrint>
              </Stack>
              {showMenu && <Stack></Stack>}
              {showShareModal && (
                <ShareCreditModal
                  isMobile={isMobile}
                  handleClose={() => setShowShareModal(false)}
                />
              )}
            </Stack>
          </StyledMarginPrint>
          {isModalOpen && (
            <>
              <BaseModal
                title={titlesModal.title}
                nextButton={titlesModal.textButtonNext}
                handleNext={() => setIsModalOpen(false)}
                handleClose={() => setIsModalOpen(false)}
                width={isMobile ? "290px" : "400px"}
              >
                <Stack gap="16px" direction="column">
                  <Text weight="bold" size="large">
                    {titlesModal.subTitle}
                  </Text>
                  <Stack direction="column" gap="8px">
                    <ul>
                      {!hasPermitSubmit && (
                        <li>
                          <Text weight="normal" size="medium" appearance="gray">
                            {titlesModal.titlePrivileges}
                          </Text>
                        </li>
                      )}
                      {dataProspect?.state === "Submitted" && (
                        <li>
                          <Text weight="normal" size="medium" appearance="gray">
                            {titlesModal.titleSubmitted}
                          </Text>
                        </li>
                      )}
                    </ul>
                  </Stack>
                </Stack>
              </BaseModal>
            </>
          )}
          {showCreditRequest && (
            <BaseModal
              title={titlesModal.title}
              nextButton={titlesModal.textButtonNext}
              handleNext={() => setShowCreditRequest(false)}
              handleClose={() => setShowCreditRequest(false)}
              width={isMobile ? "290px" : "400px"}
            >
              <Text>{titlesModal.titleRequest + prospectCode}</Text>
            </BaseModal>
          )}
        </>
      )}
    </>
  );
}
