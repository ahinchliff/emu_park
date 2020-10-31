import * as jwt from "jsonwebtoken";

export const generateJWT = (
  authToken: api.AuthToken,
  signingSecret: string
): string => {
  return jwt.sign(authToken, signingSecret);
};
