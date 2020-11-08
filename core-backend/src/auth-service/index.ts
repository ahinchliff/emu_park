// import * as jwt from "jsonwebtoken";
// import * as jwks from "jwks-rsa";
// import * as AWS from "aws-sdk";

// export interface CognitoIdToken {
//   iss: string;
//   sub: string;
//   scope: string;
//   iat: number;
//   exp: number;
//   email: string;
//   "cognito:username": string;
//   "custom:userId": string;
// }

// export default class CognitoAuthService implements core.backend.IAuthService {
//   private jwksClient: jwks.JwksClient | undefined = undefined;
//   constructor(
//     // core.backend.config.Config["auth"],
//     private config: any,
//     region?: "eu-west-1"
//   ) {
//     if (region) {
//       AWS.config.update({ region: "eu-west-1" });
//     }
//     const jwksUri = `https://${config.jwtIssuer}${config.jwksPath}`;
//     if (!this.jwksClient) {
//       this.jwksClient = jwks({
//         cache: true,
//         rateLimit: true,
//         jwksUri,
//       });
//     }
//   }

//   public decodeJWT = async (
//     token: string,
//     logger: core.backend.Logger
//   ): Promise<api.AuthToken | undefined> => {
//     try {
//       const decodedJwt = await this.verifyAndDecodeJwt(token);
//       if (!decodedJwt["cognito:username"]) {
//         logger.debug("Token not defined correctly", decodedJwt);
//         return undefined;
//       }
//       return {
//         userId: Number(decodedJwt["custom:userId"]),
//         authId: decodedJwt["cognito:username"],
//         email: decodedJwt.email,
//         expiry: decodedJwt.exp,
//       };
//     } catch (err) {
//       logger.debug("Failed to decode token", err);
//       return undefined;
//     }
//   };

//   public setUserIdOnAuthService = (authId: string, userId: number) =>
//     this.updateAttributeOnUser(authId, "userId", userId.toString());

//   public updateAttributeOnUser = async (
//     authId: string,
//     attribute: string,
//     value: string
//   ) => {
//     const cognitoISP = new AWS.CognitoIdentityServiceProvider();

//     await new Promise((resolve, reject) =>
//       cognitoISP.adminUpdateUserAttributes(
//         {
//           UserAttributes: [{ Name: `custom:${attribute}`, Value: value }],
//           UserPoolId: "eu-west-1_PQ8PetY0c",
//           Username: authId,
//         },
//         (err) => {
//           if (err) {
//             return reject();
//           } else {
//             return resolve();
//           }
//         }
//       )
//     );
//   };

//   private verifyAndDecodeJwt = (token: string): Promise<CognitoIdToken> => {
//     return new Promise(
//       (
//         resolve: (res: CognitoIdToken) => void,
//         reject: (err: jwt.VerifyErrors) => void
//       ): void => {
//         // `any` because the typings are incorrect and don't allow for a function
//         jwt.verify(
//           token,
//           this.getAuthSigningKey as any,
//           {
//             issuer: `https://${this.config.jwtIssuer}`,
//             algorithms: ["RS256"],
//           },
//           (err: any, decoded: object | undefined) => {
//             if (err) {
//               return reject(err);
//             }
//             resolve(decoded as CognitoIdToken);
//           }
//         );
//       }
//     );
//   };

//   private getAuthSigningKey = (
//     header: { kid: string },
//     callback: (err: any, key: string | Buffer | undefined) => void
//   ): void => {
//     // initialisation happens before passing this function to jwt.verify.
//     // we need the config from there before we can initialise it.
//     if (!this.jwksClient) {
//       throw new Error("jwksClient isnt initialised");
//     }
//     this.jwksClient.getSigningKey(
//       header.kid,
//       (err: any, key: jwks.SigningKey) => {
//         if (err) {
//           return callback(err, undefined);
//         }
//         const signingKey = key.getPublicKey();
//         callback(null, signingKey);
//       }
//     );
//   };
// }
