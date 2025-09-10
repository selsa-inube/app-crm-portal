import { environment } from "@config/environment";
import { decrypt } from "@utils/encrypt/encrypt";

import { IPostUserAccountsResponse } from "./types";

export async function postUserAccountsData(
  ac: string,
  clientId: string,
  clientSecret: string,
  headers: Record<string, string>,
): Promise<IPostUserAccountsResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const decryptedClientId = decrypt(clientId);
    const decryptedClientSecret = decrypt(clientSecret);
    const credentials = `${decryptedClientId}:${decryptedClientSecret}`;
    const base64Credentials = btoa(credentials);
    const apiUrl = `${environment.IAUTH_API_URL}/user-accounts?authorizationValue=${encodeURIComponent(ac)}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        ...headers,
        "X-Token": base64Credentials,
        "X-Action": "UserAuthenticationToken",
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
