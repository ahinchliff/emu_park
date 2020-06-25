import { AxiosError, AxiosResponse } from "axios";
import { ApiClientBase } from "./api-client-base";

export default class Api extends ApiClientBase {
  constructor(
    protected config: config.Config,
    onError: (
      apiError: AxiosError,
      url: string,
      errorHandled?: boolean
    ) => never
  ) {
    super({
      apiBaseURL: config.apiEndpoint,
      onError: (apiError: AxiosError, url: string, errorHandled?: boolean) =>
        onError(apiError, url, errorHandled),
      responseDataMapper(res: AxiosResponse<any>) {
        return res.data;
      },
    });
  }

  public signup = async (user: api.SignupBody): Promise<api.AuthUser> => {
    return this.post<api.AuthUser>("/auth/signup", user);
  };

  public getMe = async (): Promise<api.AuthUser> => {
    return this.get<api.AuthUser>("/auth/me");
  };
}
