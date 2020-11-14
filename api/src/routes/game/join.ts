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
  {},
  {},
  api.JoinGameRequestBody,
  api.Game
> = async ({ user, body, services, logger }) => {
  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  const { joinCode } = body;

  const game = await services.data.game.get({ joinCode });

  if (!game) {
    logger.debug("game not found", { joinCode });
    return notFound("game");
  }

  const { gameId } = game;

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

  const apiGame = toApiGame(user.userId, game, players, []);

  await services.socket.emitGameUpdate(game.gameId, apiGame);

  return apiGame;
};

export default join;
