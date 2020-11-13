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

  public getGame = async (gameId: number): Promise<api.Game> => {
    return this.get<api.Game>(`/game/${gameId}`);
  };

  public getMyGames = async (): Promise<api.GameSearchResult[]> => {
    return this.get<api.GameSearchResult[]>("/game");
  };

  public createGame = async (
    data: api.CreateGameRequestBody
  ): Promise<api.Game> => {
    return this.post<api.Game>("/game", data);
  };

  public joinGame = async (
    data: api.JoinGameRequestBody
  ): Promise<api.Game> => {
    return this.post<api.Game>("/game/join", data);
  };

  public startGame = async (gameId: number): Promise<api.Game> => {
    return this.post<api.Game>(`/game/${gameId}/start`);
  };

  public markMission = async (
    gameId: number,
    missionId: number,
    data: api.MarkMissionRequestBody
  ): Promise<api.Game> => {
    return this.post<api.Game>(`/game/${gameId}/mission/${missionId}`, data);
  };

  public finishGame = async (gameId: number): Promise<api.Game> => {
    return this.post<api.Game>(`/game/${gameId}/finish`);
  };
}
