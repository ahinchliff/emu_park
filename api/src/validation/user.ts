import * as Joi from "joi";

export const userDisplayNameValidationRules = Joi.string()
  .alphanum()
  .min(3)
  .max(50);
