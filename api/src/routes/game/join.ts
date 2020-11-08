import { AuthRequestHandler } from "../handlerBuilders";
import { gameJoinCodeValidationRule } from "../../validation/game";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import {
  badRequest,
  notFound,
  validationBadRequest,
} from "../../utils/errorsUtils";
import { toApiGame } from "../../serialisers/to-api-game";

const bodyValidation: ValidationSchema<api.JoinGameRequestBody> = {
  joinCode: gameJoinCodeValidationRule,
};

const join: AuthRequestHandler<
  api.JoinGameRequestParams,
  {},
  api.JoinGameRequestBody,
  api.Game
> = async ({ user, params, body, services, logger }) => {
  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  const gameId = Number(params.gameId);
  const { joinCode } = body;

  const game = await services.data.game.get({ gameId });

  if (!game) {
    logger.debug("game not found", { gameId });
    return notFound("game");
  }

  if (game.joinCode !== joinCode) {
    logger.debug("join code is not valid for game", { gameId, joinCode });
    return badRequest("join code not valid for game");
  }

  if (game.startedAt) {
    logger.debug("cant join a game that has started", { gameId });
    return badRequest("cant join a game has started.");
  }

  const player = await services.data.player.get({
    gameId,
    userId: user.userId,
  });

  if (player) {
    logger.debug("user has already joined this game", { gameId });
    return badRequest("user has already joined this game");
  }

  await services.data.player.create({ gameId, userId: user.userId });

  const players = await services.data.player.getMany({ gameId });

  return toApiGame(user.userId, game, players, []);
};

export default join;
