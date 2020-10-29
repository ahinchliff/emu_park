import * as jwt from "jsonwebtoken";
import * as Joi from "joi";
import { notFound, validationBadRequest } from "../../utils/errorsUtils";
import { UnAuthRequestHandler } from "../handlerBuilders";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import { userIdValidationRule } from "../../validation/user";

const bodyValidation: ValidationSchema<api.LoginRequestBody> = {
  userId: userIdValidationRule.required(),
  password: Joi.string().required(),
};

const login: UnAuthRequestHandler<
  {},
  {},
  api.LoginRequestBody,
  api.LoginResponseBody
> = async ({ services, body }) => {
  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  const user = await services.data.user.get({
    userId: Number(body.userId),
    password: body.password,
  });

  if (!user) {
    return notFound("user");
  }

  const authToken: api.AuthToken = { userId: user.userId };

  return { token: jwt.sign(authToken, "superSecret") };
};

export default login;
