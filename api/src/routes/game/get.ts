import { AuthRequestHandler } from "../handlerBuilders";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import {
  forbidden,
  notFound,
  validationBadRequest,
} from "../../utils/errorsUtils";
import { toApiGame } from "../../serialisers/to-api-game";

const bodyValidation: ValidationSchema<{}> = {};

const get: AuthRequestHandler<
  api.GetGameRequestParams,
  {},
  {},
  api.Game
> = async ({ user, params, body, services, logger }) => {
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

  const players = await services.data.player.getMany({ gameId });

  const userIsPlayer = !!players.find((p) => p.userId === user.userId);

  if (!userIsPlayer) {
    logger.debug("user is not player of game", { gameId });
    return forbidden();
  }

  const missions = await services.data.playerMission.getMany({
    gameId,
  });

  const events = await services.data.gameEvent.getMany({ gameId });

  return toApiGame(user.userId, game, players, missions, events);
};

export default get;
