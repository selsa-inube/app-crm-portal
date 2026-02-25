import jsPDF from "jspdf";
import { ITheme, IHeaderData, ICreditData } from "./types";
import { drawFieldset, drawText, drawIcon } from "./components/drawFieldset";
import { convertIconToBase64, convertUrlToBase64 } from "./utils";
import logo from "@src/assets/images/credicar-logo.svg";

const formatCurrency = (value: number) => {
  if (value === undefined || value === null) return "$ 0";
  return `$ ${value.toLocaleString("es-CO")}`;
};

export const generateSolidPDF = async (
  data: ICreditData,
  iconElement?: React.ReactElement,
  theme: any,
): Promise<void> => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  const PAGE_WIDTH = doc.internal.pageSize.getWidth(); // 841.89 pt
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight(); // 595.28 pt
  const MARGIN_X = 40;
  const START_Y = 40;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

  // 1. CARGAR ASSETS (Íconos y Logo)
  const [headerIcon, logoBase64] = await Promise.all([
    iconElement ? convertIconToBase64(iconElement) : Promise.resolve(""),
    convertUrlToBase64(logo),
  ]);

  // --- 2. HEADER ---
  const HEADER_HEIGHT = 70;
  drawFieldset({
    doc,
    x: MARGIN_X,
    y: START_Y,
    width: CONTENT_WIDTH,
    height: HEADER_HEIGHT,
    theme,
  });

  const H_ROW_1 = START_Y + 18;
  const H_ROW_2 = START_Y + 38;
  drawIcon(doc, headerIcon || "", MARGIN_X + 20, H_ROW_1 - 5, 24);
  drawText({
    doc,
    text: data.header.destinationName,
    x: MARGIN_X + 55,
    y: H_ROW_1,
    theme,
    type: "title",
    size: "medium",
  });
  drawText({
    doc,
    text: "Destino",
    x: MARGIN_X + 55,
    y: H_ROW_2 + 2,
    theme,
    type: "body",
    size: "small",
    appearance: "gray",
  });

  const CENTER_X = PAGE_WIDTH / 2;
  drawText({
    doc,
    text: data.header.mainBorrowerName,
    x: CENTER_X,
    y: H_ROW_1,
    theme,
    align: "center",
    type: "title",
    size: "medium",
  });
  drawText({
    doc,
    text: "Cliente",
    x: CENTER_X,
    y: H_ROW_2 + 2,
    theme,
    align: "center",
    type: "body",
    size: "small",
    appearance: "gray",
  });

  const RIGHT_X = PAGE_WIDTH - MARGIN_X - 20;
  drawText({
    doc,
    text: formatCurrency(data.header.totalLoanAmount),
    x: RIGHT_X,
    y: H_ROW_1 - 6,
    theme,
    align: "right",
    type: "headline",
    size: "large",
    appearance: "primary",
    weight: "bold",
  });
  drawText({
    doc,
    text: "Valor solicitado",
    x: RIGHT_X,
    y: H_ROW_2 + 2,
    theme,
    align: "right",
    type: "body",
    size: "small",
    appearance: "gray",
  });

  // --- 3. CARDS ---
  let currentY = START_Y + HEADER_HEIGHT + 30;
  const CARD_WIDTH = 160;
  const CARD_HEIGHT = 287;
  const CARD_GAP = 20;

  (data.cards || []).forEach((card, index) => {
    const cardX = MARGIN_X + index * (CARD_WIDTH + CARD_GAP);
    drawFieldset({
      doc,
      x: cardX,
      y: currentY,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      theme,
    });
    let insideY = currentY + 20;
    const paddingLeft = cardX + 20;
    drawText({
      doc,
      text: card.title || "",
      x: paddingLeft,
      y: insideY,
      theme,
      type: "title",
      size: "medium",
      weight: "bold",
    });
    insideY += 30;
    const drawRow = (
      label: string,
      val: string | number,
      thickness: number = 0,
    ) => {
      drawText({
        doc,
        text: label,
        x: paddingLeft,
        y: insideY,
        theme,
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
        theme,
        type: "title",
        size: "medium",
      });
      insideY += 38;
    };
    drawRow("Medio de pago", card.medioPago, 0.3);
    drawRow("Monto del préstamo", formatCurrency(card.montoPrestamo));
    drawRow("Tasa de Interés", card.tasaInteres);
    drawRow("Plazo en meses", card.plazoMeses);
    drawRow("Cuota periódica K+I", formatCurrency(card.cuotaPeriodica));
    drawRow("Ciclo de pagos", card.cicloPagos);
  });

  // --- 4. FOOTER ---
  currentY += CARD_HEIGHT + 30;
  const FOOTER_HEIGHT = 47.5;
  drawFieldset({
    doc,
    x: MARGIN_X,
    y: currentY,
    width: CONTENT_WIDTH,
    height: FOOTER_HEIGHT,
    theme,
  });
  const F_ROW_1 = currentY + 8;
  const F_ROW_2 = currentY + 23;
  const startFooterX = MARGIN_X + 20;

  const drawFooterCol = (label: string, val: number | string, x: number) => {
    drawText({
      doc,
      text: label,
      x,
      y: F_ROW_1,
      theme,
      align: "center",
      type: "body",
      size: "small",
      appearance: "gray",
    });
    drawText({
      doc,
      text: typeof val === "number" ? formatCurrency(val) : String(val),
      x,
      y: F_ROW_2,
      theme,
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
      theme,
      align: "center",
      size: "large",
      appearance: "gray",
    });
  };

  drawFooterCol(
    "Monto productos",
    data.footer.montoProductos,
    startFooterX + 60,
  );
  drawSymbol("-", startFooterX + 140);
  drawFooterCol("Obligaciones", data.footer.obligaciones, startFooterX + 220);
  drawSymbol("-", startFooterX + 300);
  drawFooterCol("Gastos", data.footer.gastos, startFooterX + 360);
  drawSymbol("=", startFooterX + 420);
  drawFooterCol("Neto a girar", data.footer.netoGirar, startFooterX + 490);

  doc.setDrawColor(theme?.palette?.neutral?.N40 || "#DFE1E6");
  doc.line(
    startFooterX + 570,
    currentY + 15,
    startFooterX + 570,
    currentY + 35,
  );
  drawFooterCol(
    "Cuota ordinaria mensual",
    data.footer.cuotaOrdinaria,
    startFooterX + 655,
  );

  // --- 5. LOGO (INFERIOR DERECHA) ---
  if (logoBase64) {
    // Dimensiones proporcionales a los 130x32 px de tu captura
    // 130px * 0.75 = 97.5pt | 32px * 0.75 = 24pt
    const LOGO_W = 97.5;
    const LOGO_H = 22;

    // Posición: Esquina inferior derecha respetando los márgenes
    const logoX = PAGE_WIDTH - MARGIN_X - LOGO_W;
    const logoY = PAGE_HEIGHT - MARGIN_X - LOGO_H + 10; // +10 para ajustarlo visualmente

    doc.addImage(
      logoBase64,
      "PNG",
      logoX,
      logoY,
      LOGO_W,
      LOGO_H,
      undefined,
      "FAST",
    );
  }

  doc.save("Simulacion_Credito.pdf");
};
