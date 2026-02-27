import jsPDF from "jspdf";

import { EnumType } from "@hooks/useEnum/useEnum";
import { inube } from "@inubekit/inubekit";

import { SummaryProspectCredit } from "../../outlets/CardCommercialManagement/config/config";
import { formatCurrency } from "../utils";
import { drawFieldset } from "../drawFieldset";
import { ICreditData, ILayoutConfig } from "../types";
import { drawText } from "../drawText";

export const drawSummaryFooter = (
  doc: jsPDF,
  footerData: ICreditData["footer"],
  startY: number,
  config: ILayoutConfig,
  lang: EnumType,
) => {
  const footerHeight = 47.5;

  drawFieldset({
    doc,
    x: config.MarginX + 15,
    y: startY,
    width: config.ContentWidth - 30,
    height: footerHeight,
  });

  const F_ROW_1 = startY + 8;
  const F_ROW_2 = startY + 23;
  const startFooterX = config.MarginX + 20;

  const drawFooterCol = (label: string, val: number | string, x: number) => {
    drawText({
      doc,
      text: label,
      x,
      y: F_ROW_1,
      align: "center",
      type: "body",
      size: "small",
      appearance: "gray",
    });
    drawText({
      doc,
      text: typeof val === "number" ? formatCurrency(val || 0) : String(val),
      x,
      y: F_ROW_2,
      align: "center",
      type: "title",
      size: "medium",
    });
  };

  const drawSymbol = (sym: string, x: number) => {
    drawText({
      doc,
      text: sym,
      x,
      y: F_ROW_2 - 2,
      align: "center",
      size: "large",
      appearance: "gray",
      weight: "bold",
    });
  };

  drawFooterCol(
    SummaryProspectCredit[0].item[0].title.i18n[lang],
    footerData.productsAmount || 0,
    startFooterX + 60,
  );
  drawSymbol("-", startFooterX + 140);
  drawFooterCol(
    SummaryProspectCredit[0].item[1].title.i18n[lang],
    footerData.obligations || 0,
    startFooterX + 220,
  );
  drawSymbol("-", startFooterX + 300);
  drawFooterCol(
    SummaryProspectCredit[0].item[2].title.i18n[lang],
    footerData.expenses || 0,
    startFooterX + 360,
  );
  drawSymbol("=", startFooterX + 420);
  drawFooterCol(
    SummaryProspectCredit[0].item[3].title.i18n[lang],
    footerData.netToDisburse || 0,
    startFooterX + 490,
  );

  doc.setDrawColor(inube?.palette?.neutral?.N40);
  doc.setLineWidth(2.5);
  doc.line(startFooterX + 570, startY + 10, startFooterX + 570, startY + 37.5);
  doc.setLineWidth(1.0);

  drawFooterCol(
    SummaryProspectCredit[0].item[4].title.i18n[lang],
    footerData.ordinaryInstallment || 0,
    startFooterX + 655,
  );
};
