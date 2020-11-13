import * as jwt from "jsonwebtoken";

export default class AuthService implements core.backend.IAuthService {
  constructor(private config: core.backend.config.Config["jwt"]) {}

  public decodeJWT = async (
    token: string,
    logger: core.backend.Logger
  ): Promise<api.AuthToken | undefined> => {
    if (!token) {
      return undefined;
    }

    try {
      return jwt.verify(token, this.config.secret) as api.AuthToken;
    } catch (error) {
      logger.debug(error);
      return undefined;
    }
  };
}
