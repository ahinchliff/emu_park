import * as moment from "moment";
import { AuthRequestHandler } from "../handlerBuilders";
import {
  gameTitleValidationRule,
  gameToFinishAtValidationRule,
} from "../../validation/game";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import { badRequest, validationBadRequest } from "../../utils/errorsUtils";
import { toApiGame } from "../../serialisers/to-api-game";
import { getJoinCode } from "../../utils/game";

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

  let toFinishAt: Date | undefined = undefined;

  if (body.toFinishAt) {
    const toFinishAtMoment = moment.utc(body.toFinishAt);
    if (toFinishAtMoment.isBefore(moment.utc())) {
      return badRequest("Game can't finish in the past");
    }
    toFinishAt = toFinishAtMoment.toDate();
  }

  return services.data.dbTransaction.create(async (t) => {
    const joinCode = await getJoinCode(services.data, t);

    const newGame = await services.data.game.create(
      {
        title: body.title,
        ownerId: user.userId,
        joinCode,
        toFinishAt,
      },
      t
    );

    await services.data.player.create(
      {
        gameId: newGame.gameId,
        userId: user.userId,
      },
      t
    );

    const players = await services.data.player.getMany(
      {
        gameId: newGame.gameId,
      },
      t
    );

    return toApiGame(user.userId, newGame, players, []);
  });
};

export default create;
