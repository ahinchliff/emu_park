declare namespace core {
  type AccessTokenPayload = {
    iss: string;
    sub: string;
    scope: string;
    iat: number;
    exp: number;
    username: string; // cognito specific
  };

  interface IAuthService {
    getAuthIdFromJwt(
      token: string,
      logger: core.Logger
    ): Promise<string | undefined>;
  }
}
