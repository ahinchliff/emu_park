declare namespace api {
  type Params<T extends string> = { [P in T]: string };

  type SuccessResponse = { success: boolean };
}
