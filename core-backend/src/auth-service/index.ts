import * as jwt from "jsonwebtoken";
import * as jwks from "jwks-rsa";

export interface AccessTokenPayload {
  iss: string;
  sub: string;
  scope: string;
  iat: number;
  exp: number;
  username: string; // cognito specific
}

export default class AuthService implements core.backend.IAuthService {
  private jwksClient: jwks.JwksClient | undefined = undefined;
  constructor(private config: core.backend.config.Config["auth"]) {
    const jwksUri = `https://${config.jwtIssuer}${config.jwksPath}`;
    if (!this.jwksClient) {
      this.jwksClient = jwks({
        cache: true,
        rateLimit: true,
        jwksUri,
      });
    }
  }

  public decodeJWT = async (token: string, logger: core.backend.Logger) => {
    try {
      const decodedJwt = await this.verifyAndDecodeJwt(token);
      if (!decodedJwt.username) {
        logger.debug("Token not defined correctly", decodedJwt);
        return undefined;
      }
      return {
        authId: decodedJwt.username,
        expiry: decodedJwt.exp,
      };
    } catch (err) {
      logger.debug("Failed to decode token", err);
      return undefined;
    }
  };

  private verifyAndDecodeJwt = (token: string): Promise<AccessTokenPayload> => {
    return new Promise(
      (
        resolve: (res: AccessTokenPayload) => void,
        reject: (err: jwt.VerifyErrors) => void
      ): void => {
        // `any` because the typings are incorrect and don't allow for a function
        jwt.verify(
          token,
          this.getAuthSigningKey as any,
          {
            issuer: `https://${this.config.jwtIssuer}`,
            algorithms: ["RS256"],
          },
          (err: any, decoded: object | undefined) => {
            if (err) {
              return reject(err);
            }
            resolve(decoded as AccessTokenPayload);
          }
        );
      }
    );
  };

  private getAuthSigningKey = (
    header: { kid: string },
    callback: (err: any, key: string | Buffer | undefined) => void
  ): void => {
    // initialisation happens before passing this function to jwt.verify.
    // we need the config from there before we can initialise it.
    if (!this.jwksClient) {
      throw new Error("jwksClient isnt initialised");
    }
    this.jwksClient.getSigningKey(
      header.kid,
      (err: any, key: jwks.SigningKey) => {
        if (err) {
          return callback(err, undefined);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      }
    );
  };
}
