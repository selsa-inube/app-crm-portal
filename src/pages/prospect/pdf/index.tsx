import React from "react";
import { useTheme } from "styled-components"; // <--- 1. Import this
import { generateSolidPDF } from "./interface"; // Adjust path if needed
import { ICardData } from "@src/pages/home/types"; // Use the Interface

import { MdOutlineBeachAccess } from "react-icons/md";

export const PdfComponent = () => {
  // 2. Get the theme from your App

  // This is your data matching the Interface
  const reportData: ICardData = {
    header: {
      destinationName: "Compra vivienda nueva",
      mainBorrowerName: "LENIS POVEDA ANDRES MAURICIO",
      totalLoanAmount: 20000000,
    },
    cards: [
      {
        title: "Vivienda",
        medioPago: "Manitoba",
        montoPrestamo: 20000000,
        tasaInteres: "0.9489 % Mensual",
        plazoMeses: "22.2833",
        cuotaPeriodica: 1000000,
        cicloPagos: "Mensual",
      },
      {
        title: "Libre destino",
        medioPago: "Manitoba",
        montoPrestamo: 20000000,
        tasaInteres: "1.1715 % Mensual",
        plazoMeses: "22.9215",
        cuotaPeriodica: 1000000,
        cicloPagos: "Mensual",
      },
    ],
    footer: {
      montoProductos: 40000000,
      obligaciones: 0,
      gastos: 0,
      netoGirar: 40000000,
      cuotaOrdinaria: 2000000,
    },
  };

  const iconToPrint = (
    <MdOutlineBeachAccess
      size={64}
      color="#091E42" // Use the N900 Hex code here
      style={{ width: "100%", height: "100%" }} // Ensure SVG fills space
    />
  );

  const handleDownload = () => {
    // 3. Pass Data AND Theme to the generator
    generateSolidPDF(reportData, iconToPrint);
  };

  return (
    <div>
      <button onClick={handleDownload}>Descargar PDF</button>
    </div>
  );
};
