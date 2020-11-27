import * as joi from "joi";
import { AuthRequestHandler } from "../handlerBuilders";
import { gameMissionStatusRule } from "../../validation/game";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import {
  badRequest,
  forbidden,
  notFound,
  validationBadRequest,
} from "../../utils/errorsUtils";
import { getNumberParam } from "../../utils/general";
import { toApiGame } from "../../serialisers/to-api-game";

const bodyValidation: ValidationSchema<api.MarkMissionRequestBody> = {
  status: gameMissionStatusRule.required(),
  againstPlayerId: joi.number().required(),
};

const markMission: AuthRequestHandler<
  api.MarkMissionRequestParams,
  {},
  api.MarkMissionRequestBody,
  api.Game
> = async ({ user, params, body, services, logger }) => {
  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  if (body.againstPlayerId === user.userId) {
    return badRequest("cant get yourself");
  }

  const gameId = getNumberParam(params.gameId);
  if (!gameId) {
    return badRequest("gameId param not valid");
  }

  const missionId = getNumberParam(params.missionId);
  if (!missionId) {
    return badRequest("missionId param not valid");
  }

  const game = await services.data.game.get({ gameId });

  if (!game) {
    logger.debug("game not found", { gameId });
    return notFound("game");
  }

  if (!game.startedAt) {
    logger.debug("game has not started", { gameId });
    return badRequest("game has not started");
  }

  if (game.finishedAt) {
    logger.debug("game has finished", { gameId });
    return badRequest("game has finished");
  }

  const mission = await services.data.playerMission.get({ gameId, missionId });

  if (!mission) {
    logger.debug("mission not found", { gameId });
    return notFound("mission");
  }

  if (mission.userId !== user.userId) {
    logger.debug("not user's missions", { gameId });
    return forbidden();
  }

  if (mission.status !== "pending") {
    logger.debug("mission has already been marked");
    return badRequest("mission has already been marked");
  }

  const againstPlayer = await services.data.player.get({
    gameId,
    userId: body.againstPlayerId,
  });

  if (!againstPlayer) {
    logger.debug("could not find player", { gameId });
    return badRequest("player");
  }

  await services.data.playerMission.update(
    {
      userId: user.userId,
      gameId,
      missionId,
    },
    { status: body.status, againstPlayerId: body.againstPlayerId }
  );

  await services.data.gameEvent.create({
    gameId: game.gameId,
    eventType: "markedMission",
    data: {
      userId: user.userId,
      againstPlayerId: body.againstPlayerId,
      missionId,
      success: body.status === "completed",
    },
  });

  const players = await services.data.player.getMany({ gameId });

  const missions = await services.data.playerMission.getMany({
    gameId,
  });

  const events = await services.data.gameEvent.getMany({ gameId });

  const apiGame = toApiGame(user.userId, game, players, missions, events);

  await services.socket.emitGameUpdate(game.gameId, apiGame);

  return apiGame;
};

export default markMission;
