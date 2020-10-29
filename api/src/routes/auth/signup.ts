import * as crypto from "crypto";
import { UnAuthRequestHandler } from "../handlerBuilders";
import { toApiAuthUser } from "../../serialisers/to-api-auth-user";
import { badRequest, validationBadRequest } from "../../utils/errorsUtils";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import { usernameValidationRule } from "../../validation/user";

const bodyValidation: ValidationSchema<api.SignupRequestBody> = {
  username: usernameValidationRule.required(),
};

const signup: UnAuthRequestHandler<
  {},
  {},
  api.SignupRequestBody,
  api.SignupResponseBody
> = async ({ body, services }) => {
  const { username } = body;

  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  const userWithUsername = await services.data.user.get({ username });

  if (userWithUsername) {
    return badRequest("username taken");
  }

  const password = crypto.randomBytes(64).toString("hex");

  const user = await services.data.user.create({
    username,
    password,
  });

  return { ...toApiAuthUser(user), password };
};

export default signup;
