declare namespace core.backend {
  type AccessTokenPayload = {
    iss: string;
    sub: string;
    scope: string;
    iat: number;
    exp: number;
    username: string;
  };

  interface IAuthService {
    getAuthIdFromJwt(
      token: string,
      logger: core.backend.Logger
    ): Promise<string | undefined>;
  }
}
