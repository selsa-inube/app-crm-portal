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

export { encrypt, decrypt };
