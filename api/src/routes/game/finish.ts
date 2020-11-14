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
import { getNumberParam } from "../../utils/general";

const bodyValidation: ValidationSchema<{}> = {};

const finish: AuthRequestHandler<
  api.FinishGameRequestParams,
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

  if (!game.startedAt) {
    logger.debug("cannot finish a game that hasn't started", { gameId });
    return badRequest("cannot finish a game that hasn't started");
  }

  const finishedGame = await services.data.game.update(
    { gameId: game.gameId },
    { finishedAt: moment.utc().toDate() }
  );

  const players = await services.data.player.getMany({ gameId });

  const missions = await services.data.playerMission.getMany({
    gameId,
  });

  const apiGame = toApiGame(user.userId, finishedGame, players, missions);

  await services.socket.emitGameUpdate(game.gameId, apiGame);

  return apiGame;
};

export default finish;
