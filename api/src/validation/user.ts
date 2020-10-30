import * as Joi from "joi";

export const usernameValidationRule = Joi.string().alphanum().min(3).max(30);
export const userIdValidationRule = Joi.number();
