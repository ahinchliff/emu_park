import * as Joi from "joi";

export const gameTitleValidationRule = Joi.string();
export const gameToFinishAtValidationRule = Joi.date().iso();
export const gameInviteValidationRule = Joi.array().items(
  Joi.object({
    userId: Joi.number(),
  })
);
export const gameInviteResponseActionValidationRule = Joi.string().valid(
  "accept",
  "decline"
);
