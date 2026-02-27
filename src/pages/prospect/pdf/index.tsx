import { MdOutlineBeachAccess } from "react-icons/md";
import { inube } from "@inubekit/inubekit";

import { ICreditData, ILayoutConfig } from "./types";
import { convertIconToBase64, convertUrlToBase64 } from "./utils";
import { drawHeader } from "./drawHeader";
import { drawBodyCards } from "./drawBodyCards";
import { drawSummaryFooter } from "./drawSummaryFooter";
import { drawBrandLogo } from "./drawBrandLogo";
import logo from "@src/assets/images/credicar-logo.svg";
import { EnumType } from "@hooks/useEnum/useEnum";

import jsPDF from "jspdf";

export const generateSolidPDF = async (
  data: ICreditData,
  lang: EnumType = "es",
  prospectCode?: string,
  iconElement?: React.ReactElement,
): Promise<void> => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  const layoutConfig: ILayoutConfig = {
    PageWidth: doc.internal.pageSize.getWidth(),
    PageHeight: doc.internal.pageSize.getHeight(),
    MarginX: 40,
    StartY: 40,
    ContentWidth: doc.internal.pageSize.getWidth() - 40 * 2,
  };

  iconElement = (
    <MdOutlineBeachAccess
      size={64}
      color={inube.palette.neutral.N900}
      style={{ width: "100%", height: "100%" }}
    />
  );

  const [headerIcon, logoBase64] = await Promise.all([
    iconElement ? convertIconToBase64(iconElement) : Promise.resolve(""),
    convertUrlToBase64(logo),
  ]);

  const bodyStartY = drawHeader(
    doc,
    data.header,
    headerIcon || "",
    layoutConfig,
    lang,
  );
  const footerStartY = drawBodyCards(
    doc,
    data.cards,
    bodyStartY,
    layoutConfig,
    lang,
  );
  drawSummaryFooter(doc, data.footer, footerStartY, layoutConfig, lang);
  drawBrandLogo(doc, logoBase64, layoutConfig);

  doc.save(`${prospectCode}.pdf`);
};
