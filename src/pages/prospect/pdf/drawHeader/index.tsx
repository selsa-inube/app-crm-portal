import jsPDF from "jspdf";

import { dataEditProspect } from "@pages/simulations/config";
import { EnumType } from "@hooks/useEnum/useEnum";

import { formatCurrency } from "../utils";
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
  const HeaderHeight = 70;

  drawFieldset({
    doc,
    x: config.MarginX,
    y: config.StartY,
    width: config.ContentWidth,
    height: HeaderHeight,
  });

  const HRow1 = config.StartY + 18;
  const HRow2 = config.StartY + 38;

  if (headerIcon) {
    drawIcon(doc, headerIcon, config.MarginX + 20, HRow1 - 5, 24);
  }

  drawText({
    doc,
    text: headerData.destinationName,
    x: config.MarginX + 55,
    y: HRow1,
    type: "title",
    size: "medium",
  });

  drawText({
    doc,
    text: dataEditProspect.destination.i18n[lang],
    x: config.MarginX + 110,
    y: HRow2 + 2,
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
  });

  drawText({
    doc,
    text: dataEditProspect.customer.i18n[lang],
    x: CenterX,
    y: HRow2 + 2,
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
    y: HRow2 + 2,
    align: "center",
    type: "body",
    size: "small",
    appearance: "gray",
  });

  return config.StartY + HeaderHeight + 15;
};
