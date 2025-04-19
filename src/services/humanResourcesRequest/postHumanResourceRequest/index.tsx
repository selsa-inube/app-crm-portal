import { IRequestBody, IHumanResourceResponse } from "./types";

import { environment } from "@config/environment";

export async function postHumanResourceRequest(
  requestBody: IRequestBody,
): Promise<IHumanResourceResponse> {
  const response = await fetch(
    `${environment.IVITE_IHUREM_PERSISTENCE_PROCESS_SERVICE}/human-resources-requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
}
