import jsPDF from "jspdf";

import { ILayoutConfig } from "../types";

export const drawBrandLogo = (
  doc: jsPDF,
  logoBase64: string,
  config: ILayoutConfig,
) => {
  if (!logoBase64) return;

  const LogoW = 97.5;
  const LogoH = 22;
  const logoX = config.PageWidth - config.MarginX - LogoW;
  const logoY = config.PageHeight - config.MarginX - LogoH + 10;

  doc.addImage(
    logoBase64,
    "PNG",
    logoX,
    logoY,
    LogoW,
    LogoH,
    undefined,
    "FAST",
  );
};
