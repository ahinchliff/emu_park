export const toApiError = (e: any): api.ErrorResponse | undefined => {
  if (e && e.statusCode) {
    return e as api.ErrorResponse;
  } else {
    return undefined;
  }
};
