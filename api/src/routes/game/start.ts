import * as moment from "moment";
import { AuthRequestHandler } from "../handlerBuilders";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import {
  badRequest,
  forbidden,
  notFound,
  validationBadRequest,
} from "../../utils/errorsUtils";
import { toApiGame } from "../../serialisers/to-api-game";
import { assignPlayersMissions } from "../../utils/game";
import { getNumberParam } from "../../utils/general";

const bodyValidation: ValidationSchema<{}> = {};

const start: AuthRequestHandler<
  api.StartGameRequestParams,
  {},
  {},
  api.Game
> = async ({ user, params, body, services, logger }) => {
  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  const gameId = getNumberParam(params.gameId);
  if (!gameId) {
    return badRequest("gameId param not valid");
  }

  const game = await services.data.game.get({ gameId });

  if (!game) {
    logger.debug("game not found", { gameId });
    return notFound("game");
  }

  if (game.ownerId !== user.userId) {
    logger.debug("user is not owner of game", { gameId });
    return forbidden();
  }

  if (game.startedAt) {
    logger.debug("cannot start a game that has started", { gameId });
    return badRequest("cannot start a game that has started");
  }

  const players = await services.data.player.getMany({ gameId });

  if (players.length < 2) {
    return badRequest("game must have at least 2 players");
  }

  return services.data.dbTransaction.create(async (t) => {
    await assignPlayersMissions(gameId, players, services.data);

    const updatedGame = await services.data.game.update(
      { gameId },
      { startedAt: moment.utc().toDate() },
      t
    );

    const createdMissions = await services.data.playerMission.getMany(
      {
        gameId,
      },
      t
    );

    return toApiGame(user.userId, updatedGame, players, createdMissions);
  });
};

export default start;
