import * as crypto from "crypto";
import { UnAuthRequestHandler } from "../handlerBuilders";
import { toApiAuthUser } from "../../serialisers/to-api-auth-user";
import { validationBadRequest } from "../../utils/errorsUtils";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import { userDisplayNameValidationRules } from "../../validation/user";
import { hashPassword } from "../../utils/authUtils";

const bodyValidation: ValidationSchema<api.SignupRequestBody> = {
  displayName: userDisplayNameValidationRules.required(),
};

const signup: UnAuthRequestHandler<
  {},
  {},
  api.SignupRequestBody,
  api.SignupResponseBody
> = async ({ body, services }) => {
  const { displayName } = body;

  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  const username = crypto.randomBytes(64).toString("hex");
  const plainTextPassword = crypto.randomBytes(64).toString("hex");
  const password = await hashPassword(plainTextPassword);

  const user = await services.data.user.create({
    username,
    password,
    displayName,
  });

  return { ...toApiAuthUser(user), password: plainTextPassword };
};

export default signup;
