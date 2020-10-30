import { AuthRequestHandler } from "../handlerBuilders";
import { gameInviteResponseActionValidationRule } from "../../validation/game";
import { ValidationSchema, validate } from "../../utils/validationUtils";
import {
  badRequest,
  notFound,
  forbidden,
  validationBadRequest,
} from "../../utils/errorsUtils";
import { toApiGame } from "../../serialisers/to-api-game";

const bodyValidation: ValidationSchema<api.RespondToInviteRequestBody> = {
  action: gameInviteResponseActionValidationRule,
};

const respondToInvite: AuthRequestHandler<
  api.InvitePlayersRequestParams,
  {},
  api.RespondToInviteRequestBody,
  api.Game
> = async ({ user, body, services, params, logger }) => {
  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  const gameId = Number(params.gameId);

  const game = await services.data.game.get({ gameId });

  if (!game) {
    logger.debug("game not found", { gameId });
    return notFound("game");
  }

  if (game.startedAt) {
    logger.debug("game has already started");
    return badRequest("game has already started");
  }

  if (game.finishedAt) {
    logger.debug("game has finished");
    return badRequest("game has finished");
  }

  const player = await services.data.player.get({
    userId: user.userId,
    gameId,
  });

  if (!player) {
    return forbidden();
  }

  if (player.status !== "pending") {
    logger.debug("user has already responded to this invite", {
      userId: user.userId,
      gameId,
    });
    return badRequest("user has already responded to this invite");
  }

  await services.data.player.update(
    { gameId, userId: user.userId },
    { status: "accepted" }
  );

  const players = await services.data.player.getMany({ gameId });

  const playerMissions = await services.data.playerMission.getMany({
    gameId,
  });

  return toApiGame(game, players, playerMissions);
};

export default respondToInvite;
