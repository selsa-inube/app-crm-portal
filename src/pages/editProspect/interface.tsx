import { Button, Divider, Icon, Stack, Text } from "@inubekit/inubekit";
import {
  MdOutlineBeachAccess,
  MdOutlineInfo,
  MdOutlineShare,
} from "react-icons/md";

import { Fieldset } from "@components/data/Fieldset";
import { ShareCreditModal } from "@components/modals/ShareCreditModal";
import { ErrorPage } from "@components/layout/ErrorPage";
import { BaseModal } from "@components/modals/baseModal";
import { IProspect } from "@services/prospects/types";

import { GeneralHeader } from "../addProspect/components/GeneralHeader";
import { CreditProspect } from "../prospect/components/CreditProspect";
import { StyledMarginPrint, StyledPrint } from "./styles";
import { dataEditProspect, titlesModal } from "./config";
import { IDataHeader, IDataProspect } from "./types";

interface IEditProspectUIProps {
  dataHeader: IDataHeader;
  isMobile: boolean;
  prospectCode: string;
  data: IDataProspect;
  dataProspect: IProspect | undefined;
  showMenu: boolean;
  showShareModal: boolean;
  codeError: number | null;
  addToFix: string[];
  hasPermitSubmit: boolean;
  isModalOpen: boolean;
  showCreditRequest: boolean;
  setShowShareModal: (value: boolean) => void;
  setShowMenu: (value: boolean) => void;
  handleSubmitClick: () => void;
  handleInfo: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreditRequest: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditProspectUI(props: IEditProspectUIProps) {
  const {
    dataHeader,
    isMobile,
    prospectCode,
    data,
    dataProspect,
    showMenu,
    showShareModal,
    codeError,
    addToFix,
    hasPermitSubmit,
    isModalOpen,
    showCreditRequest,
    setShowShareModal,
    setShowMenu,
    handleSubmitClick,
    handleInfo,
    setIsModalOpen,
    setShowCreditRequest,
  } = props;

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
                  prospectId={dataProspect?.prospect_id || ""}
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
