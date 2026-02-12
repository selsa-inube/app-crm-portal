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
