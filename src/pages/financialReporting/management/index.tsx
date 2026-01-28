import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { MdInfoOutline } from "react-icons/md";
import { Stack } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { Message } from "@components/data/Message";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import userNotFound from "@assets/images/ItemNotFound.png";
import { AppContext } from "@context/AppContext";
import { ICreditRequest, ITraceType } from "@services/creditRequest/types";
import { getTraceByCreditRequestId } from "@services/creditRequest/getTraceByCreditRequestId";
import { EnumType } from "@hooks/useEnum/useEnum";

import { ChatContent, SkeletonContainer, SkeletonLine } from "./styles";
import { traceObserver, errorObserver, errorMessages } from "../config";
import { DetailsModal } from "./DetailsModal";

interface IManagementProps {
  isMobile: boolean;
  lang: EnumType;
  creditRequest?: ICreditRequest | null;
  updateData?: boolean;
}

export const Management = (props: IManagementProps) => {
  const { isMobile, lang, updateData, creditRequest } = props;

  const [traces, setTraces] = useState<ITraceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ITraceType | null>(
    null,
  );

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const chatContentRef = useRef<HTMLDivElement>(null);

  const notifyError = useCallback((message: string) => {
    errorObserver.notify({ id: "Management", message });
  }, []);

  const fetchData = useCallback(async () => {
    if (!creditRequest?.creditRequestId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getTraceByCreditRequestId(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequest.creditRequestId,
        eventData.token,
      );
      setTraces(Array.isArray(data) ? data.flat() : []);
    } catch (err) {
      notifyError((err as Error).message);
      setError("Error al intentar conectar con el servicio de trazabilidad.");
    } finally {
      setLoading(false);
    }
  }, [
    businessUnitPublicCode,
    creditRequest?.creditRequestId,
    businessManagerCode,
    notifyError,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData, updateData]);

  useEffect(() => {
    traceObserver.subscribe(fetchData);
    return () => traceObserver.unsubscribe(fetchData);
  }, [fetchData]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [traces]);

  const handleRetry = () => {
    setError(null);
    fetchData();
  };

  const renderSkeletons = () =>
    [...Array(5)].map((_, index) => (
      <SkeletonContainer
        key={index}
        type={index % 2 === 0 ? "sent" : "received"}
      >
        <SkeletonLine width="30%" animated={true} />
      </SkeletonContainer>
    ));

  const handleIconClick = (trace: ITraceType) => {
    setSelectedMessage(trace);
    setDetailsOpen(true);
  };

  const getMessageType = (
    traceType: string,
  ): "sent" | "received" | "system" => {
    const map: Record<string, "sent" | "received" | "system"> = {
      Novelty: "sent",
      Message: "received",
      Executed_task: "system",
    };

    return map[traceType] ?? "sent";
  };

  const renderMessages = () =>
    traces.map((trace, index) => (
      <Message
        key={index}
        type={getMessageType(trace.traceType)}
        timestamp={trace.executionDate || ""}
        message={trace.traceValue}
        icon={<MdInfoOutline size={14} />}
        onIconClick={() => {
          handleIconClick(trace);
        }}
      />
    ));

  return (
    <Fieldset
      title={errorMessages.Management.titleCard.i18n[lang]}
      heightFieldset="340px"
      aspectRatio={isMobile ? "auto" : "1"}
    >
      {!creditRequest || error ? (
        <ItemNotFound
          image={userNotFound}
          title={errorMessages.Management.title.i18n[lang]}
          description={errorMessages.Management.description.i18n[lang]}
          buttonDescription={errorMessages.Management.button.i18n[lang]}
          onRetry={handleRetry}
        />
      ) : (
        <>
          <Stack direction="column" height={!isMobile ? "100%" : "292px"}>
            <ChatContent ref={chatContentRef}>
              {loading ? renderSkeletons() : renderMessages()}
            </ChatContent>
          </Stack>
          {detailsOpen && selectedMessage && (
            <DetailsModal
              data={selectedMessage as ITraceType}
              handleClose={() => setDetailsOpen(false)}
              lang={lang}
            />
          )}
        </>
      )}
    </Fieldset>
  );
};
