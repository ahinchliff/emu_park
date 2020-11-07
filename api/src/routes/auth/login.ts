import * as Joi from "joi";
import { notFound, validationBadRequest } from "../../utils/errorsUtils";
import { UnAuthRequestHandler } from "../handlerBuilders";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import {
  generateJWT,
  plainTextPasswordMatchesHash,
} from "../../utils/authUtils";

const bodyValidation: ValidationSchema<api.LoginRequestBody> = {
  username: Joi.string().required(),
  password: Joi.string().required(),
};

const login: UnAuthRequestHandler<
  {},
  {},
  api.LoginRequestBody,
  api.LoginResponseBody
> = async ({ services, body, config }) => {
  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  const user = await services.data.user.get({
    username: body.username,
  });

  if (!user) {
    return notFound("user");
  }

  const correctPassword = await plainTextPasswordMatchesHash(
    body.password,
    user.password
  );

  if (!correctPassword) {
    return notFound("user");
  }

  const authToken: api.AuthToken = { userId: user.userId };

  return { token: generateJWT(authToken, config.jwt.secret) };
};

export default login;
