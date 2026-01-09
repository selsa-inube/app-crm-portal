import { IValidateIncrementRequest, IValidateIncrementResponse } from "./types";

export const validateIncrement = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  payload: IValidateIncrementRequest,
): Promise<IValidateIncrementResponse> => {
  try {
    const response = await fetch(
      `${businessUnitPublicCode}/${businessManagerCode}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error("Error validating increment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error validating increment:", error);
    throw error;
  }
};
