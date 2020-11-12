export const toApiError = (e: any): api.ErrorResponse | undefined => {
  if (e.statusCode) {
    return e as api.ErrorResponse;
  } else {
    return undefined;
  }
};
