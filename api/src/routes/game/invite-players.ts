import { AuthRequestHandler } from "../handlerBuilders";
import { gameInviteValidationRule } from "../../validation/game";
import { ValidationSchema, validate } from "../../utils/validationUtils";
import {
  badRequest,
  notFound,
  forbidden,
  validationBadRequest,
} from "../../utils/errorsUtils";
import { toApiGame } from "../../serialisers/to-api-game";

const bodyValidation: ValidationSchema<api.InvitePlayersRequestBody> = {
  invites: gameInviteValidationRule,
};

const invitePlayers: AuthRequestHandler<
  api.InvitePlayersRequestParams,
  {},
  api.InvitePlayersRequestBody,
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

  if (game.ownerId !== user.userId) {
    logger.debug("user not owner of game", {
      gameId,
      userId: user.userId,
    });
    return forbidden();
  }

  if (game.startedAt) {
    logger.debug("game has already started");
    return badRequest("game has already started");
  }

  if (game.finishedAt) {
    logger.debug("game has finished");
    return badRequest("game has finished");
  }

  const playersToAddToGame: data.User[] = [];

  for (const invite of body.invites) {
    if (invite.userId === user.userId) {
      return badRequest("cant invite yourself to a game");
    }

    const invitedUser = await services.data.user.get({ userId: invite.userId });
    if (!invitedUser) {
      logger.debug("could not find user", { userId: invite.userId });
      return notFound("user");
    }

    const player = await services.data.player.get({
      userId: invite.userId,
      gameId,
    });

    if (player) {
      if (player.status === "declined") {
        logger.debug(
          "user is already a player but has declined. Setting their status back to pending"
        );
        await services.data.player.update(
          { gameId, userId: player.userId },
          { status: "pending" }
        );
      } else {
        logger.debug(
          "user is already a player and their status isnt declined. Skipping.",
          {
            gameId,
            userId: player.userId,
            status: player.status,
          }
        );
      }
    } else {
      playersToAddToGame.push(invitedUser);
    }
  }

  await services.data.player.createMany(
    playersToAddToGame.map(({ userId }) => ({ userId, gameId }))
  );

  const players = await services.data.player.getMany({ gameId });

  const playerMissions = await services.data.playerMission.getMany({
    gameId,
  });

  return toApiGame(game, players, playerMissions);
};

export default invitePlayers;
