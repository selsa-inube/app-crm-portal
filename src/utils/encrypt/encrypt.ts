import CryptoJS from "crypto-js";

import { environment } from "@config/environment";

const secretKey = CryptoJS.enc.Hex.parse(environment.VITE_SECRET_KEY_PORTAL_ID);
const iv = CryptoJS.enc.Hex.parse(environment.VITE_SECRET_KEY_PORTAL_NAME);

const encrypt = (data: string) => {
  return CryptoJS.AES.encrypt(data, secretKey, { iv }).toString();
};

const decrypt = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey, { iv: iv });
  return bytes.toString(CryptoJS.enc.Utf8);
};

function pdfConverter(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mimeMatch = /:(.*?);/.exec(arr[0]);
  const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export { encrypt, decrypt, pdfConverter };
