import jsPDF from "jspdf";

import { EnumType } from "@hooks/useEnum/useEnum";
import { CREDIT_PRODUCT_TEXTS } from "@components/cards/CreditProductCard/config";

import { formatCurrency } from "../utils";
import { drawFieldset } from "../drawFieldset";
import { ICreditData, ILayoutConfig } from "../types";
import { drawText } from "../drawText";

export const drawBodyCards = (
  doc: jsPDF,
  cards: ICreditData["cards"],
  startY: number,
  config: ILayoutConfig,
  lang: EnumType,
): number => {
  const ContainerHeight = 385;

  drawFieldset({
    doc,
    x: config.MarginX,
    y: startY,
    width: config.ContentWidth,
    height: ContainerHeight,
  });

  const currentY = startY + 20;
  const CardWidth = 160;
  const CardHeight = 287;
  const CardGap = 20;

  (cards || []).forEach((card, index) => {
    const cardX = config.MarginX + 20 + index * (CardWidth + CardGap);

    drawFieldset({
      doc,
      x: cardX,
      y: currentY,
      width: CardWidth,
      height: CardHeight,
    });

    let insideY = currentY + 20;
    const paddingLeft = cardX + 20;

    drawText({
      doc,
      text: card.title || "",
      x: paddingLeft,
      y: insideY,
      type: "title",
      size: "medium",
      weight: "bold",
      appearance: "gray",
    });

    insideY += 30;

    const drawRow = (label: string, val: string | number) => {
      drawText({
        doc,
        text: label,
        x: paddingLeft,
        y: insideY,
        type: "body",
        size: "small",
        appearance: "gray",
        weight: "bold",
      });
      drawText({
        doc,
        text: String(val || ""),
        x: paddingLeft,
        y: insideY + 13,
        type: "title",
        size: "medium",
      });
      insideY += 38;
    };

    drawRow(CREDIT_PRODUCT_TEXTS.paymentMethod.i18n[lang], card.paymentMethod);
    drawRow(
      CREDIT_PRODUCT_TEXTS.loanAmount.i18n[lang],
      formatCurrency(Math.trunc(card.loanAmount)),
    );
    drawRow(CREDIT_PRODUCT_TEXTS.interestRate.i18n[lang], card.interestRate);
    drawRow(CREDIT_PRODUCT_TEXTS.termMonths.i18n[lang], card.termMonths);
    drawRow(
      CREDIT_PRODUCT_TEXTS.periodicFee.i18n[lang],
      formatCurrency(card.periodicPayment),
    );
    drawRow(CREDIT_PRODUCT_TEXTS.paymentCycle.i18n[lang], card.paymentCycle);
  });

  return currentY + CardHeight + 20;
};
