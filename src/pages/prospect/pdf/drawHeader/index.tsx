import jsPDF from "jspdf";

import { dataEditProspect } from "@pages/simulations/config";
import { EnumType } from "@hooks/useEnum/useEnum";

import { formatCurrency, getFontSize } from "../utils";
import { drawFieldset } from "../drawFieldset";
import { ICreditData, ILayoutConfig } from "../types";
import { drawIcon } from "../drawIcon";
import { drawText } from "../drawText";

export const drawHeader = (
  doc: jsPDF,
  headerData: ICreditData["header"],
  headerIcon: string,
  config: ILayoutConfig,
  lang: EnumType,
): number => {
  const titleFontSize = Number(getFontSize("title", "medium"));
  doc.setFontSize(titleFontSize);

  const destText = String(headerData.destinationName || "");
  const clientText = String(headerData.mainBorrowerName || "");

  const destLines = doc.splitTextToSize(destText, 180);
  const clientLines = doc.splitTextToSize(clientText, 240);

  const maxLines = Math.max(destLines.length, clientLines.length, 1);

  const lineHeight = titleFontSize + 4;
  const extraBoxHeight = (maxLines - 1) * lineHeight;
  const HeaderHeight = 70 + extraBoxHeight;

  const HRow1 = config.StartY + 18;
  const BaseLabelY = config.StartY + 40;

  const destLabelY = BaseLabelY + (destLines.length - 1) * lineHeight;
  const clientLabelY = BaseLabelY + (clientLines.length - 1) * lineHeight;
  const amountLabelY = BaseLabelY;

  drawFieldset({
    doc,
    x: config.MarginX,
    y: config.StartY,
    width: config.ContentWidth,
    height: HeaderHeight,
  });

  if (headerIcon) {
    const iconY = config.StartY + HeaderHeight / 2 - 12;
    drawIcon(doc, headerIcon, config.MarginX + 20, iconY, 24);
  }

  drawText({
    doc,
    text: headerData.destinationName,
    x: config.MarginX + 55,
    y: HRow1,
    type: "title",
    size: "medium",
    maxWidth: 180,
  });

  drawText({
    doc,
    text: dataEditProspect.destination.i18n[lang],
    x: config.MarginX + 110,
    y: destLabelY,
    align: "center",
    type: "body",
    size: "small",
    appearance: "gray",
  });

  const CenterX = config.ContentWidth / 2 + config.MarginX;
  drawText({
    doc,
    text: headerData.mainBorrowerName,
    x: CenterX,
    y: HRow1,
    align: "center",
    type: "title",
    size: "medium",
    maxWidth: 240,
  });

  drawText({
    doc,
    text: dataEditProspect.customer.i18n[lang],
    x: CenterX,
    y: clientLabelY,
    align: "center",
    type: "body",
    size: "small",
    appearance: "gray",
  });

  const RightX = config.ContentWidth + config.MarginX - 20;
  drawText({
    doc,
    text: formatCurrency(headerData.totalLoanAmount),
    x: RightX,
    y: HRow1 - 6,
    align: "right",
    type: "headline",
    size: "large",
    appearance: "primary",
    weight: "bold",
  });

  drawText({
    doc,
    text: dataEditProspect.value.i18n[lang],
    x: RightX - 50,
    y: amountLabelY,
    align: "center",
    type: "body",
    size: "small",
    appearance: "gray",
  });

  return config.StartY + HeaderHeight + 15;
};
