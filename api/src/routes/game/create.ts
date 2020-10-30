import { AuthRequestHandler } from "../handlerBuilders";
import {
  gameTitleValidationRule,
  gameToFinishAtValidationRule,
} from "../../validation/game";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import { validationBadRequest } from "../../utils/errorsUtils";
import { toApiGame } from "../../serialisers/to-api-game";

const bodyValidation: ValidationSchema<api.CreateGameRequestBody> = {
  title: gameTitleValidationRule.required(),
  toFinishAt: gameToFinishAtValidationRule,
};

const create: AuthRequestHandler<
  {},
  {},
  api.CreateGameRequestBody,
  api.Game
> = async ({ user, body, services }) => {
  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  return services.data.dbTransaction.create(async (t) => {
    const newGame = await services.data.game.create(
      {
        title: body.title,
        ownerId: user.userId,
      },
      t
    );

    const ownerPlayer = await services.data.player.create(
      {
        gameId: newGame.gameId,
        userId: user.userId,
        status: "accepted",
      },
      t
    );

    return toApiGame(newGame, [ownerPlayer], []);
  });
};

export default create;
