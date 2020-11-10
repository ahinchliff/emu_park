import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const generateJWT = (
  authToken: api.AuthToken,
  signingSecret: string,
  validForInHours: number
): string => {
  return jwt.sign(authToken, signingSecret, {
    expiresIn: `${validForInHours} hours`,
  });
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
