import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const generateJWT = (
  authToken: api.AuthToken,
  signingSecret: string
): string => {
  return jwt.sign(authToken, signingSecret);
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const plainTextPasswordMatchesHash = async (
  plainTextPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};
