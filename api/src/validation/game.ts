import * as Joi from "joi";

export const gameTitleValidationRule = Joi.string();
export const gameToFinishAtValidationRule = Joi.date().iso();
export const gameJoinCodeValidationRule = Joi.string();
export const gameMissionStatusRule = Joi.string().valid("completed", "failed");
