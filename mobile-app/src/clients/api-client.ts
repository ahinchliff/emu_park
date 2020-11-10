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

  public signup = async (
    user: api.SignupRequestBody
  ): Promise<api.SignupResponseBody> => {
    return this.post<api.SignupResponseBody>("/auth/signup", user);
  };

  public login = async (
    data: api.LoginRequestBody
  ): Promise<api.LoginResponseBody> => {
    return this.post<api.LoginResponseBody>("/auth/login", data);
  };

  public getMe = async (): Promise<api.AuthUser> => {
    return this.get<api.AuthUser>("/auth/me");
  };
}
