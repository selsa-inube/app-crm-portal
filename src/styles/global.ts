import { inube } from "@inubekit/inubekit";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
  }

  #root {
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
  }
 * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) =>
      theme?.palette?.neutral?.N50 || inube.palette.neutral.N80} transparent;
  }

  *::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
  background: ${({ theme }) =>
    theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
    border-radius: 2px;
  }

  *::-webkit-scrollbar-thumb:hover {
    background:${({ theme }) =>
      theme?.palette?.neutral?.N50 || inube.palette.neutral.N80};
  }
  @media print {
    body, html, #root, .main-container {
      overflow: visible !important;
      height: auto !important;
      overflow-y: visible !important;
      max-height: none !important;
      position: static !important;
      min-width: 100%;
    }

    #root {
      max-width: none;
    }
  }
`;

export { GlobalStyles };
