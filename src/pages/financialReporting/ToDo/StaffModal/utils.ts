export const changeUsersByCreditRequest = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequests: ICreditRequests,
  userAccount: string,
) => {
  let confirmationType = true;
  try {
    await patchChangeUsersByCreditRequest(
      creditRequests,
      businessUnitPublicCode,
      businessManagerCode,
      userAccount,
    );
  } catch (error) {
    confirmationType = false;
    throw error;
  }

  return confirmationType;
};
