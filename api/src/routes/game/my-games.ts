import { AuthRequestHandler } from "../handlerBuilders";
import { validate, ValidationSchema } from "../../utils/validationUtils";
import { validationBadRequest } from "../../utils/errorsUtils";
import { toApiGameSearchResult } from "../../serialisers/to-api-game";

const bodyValidation: ValidationSchema<{}> = {};

const myGames: AuthRequestHandler<{}, {}, {}, api.GameSearchResult[]> = async ({
  user,
  body,
  services,
}) => {
  const bodyValidationResult = await validate(body, bodyValidation);

  if (bodyValidationResult.isInvalid) {
    return validationBadRequest(bodyValidationResult.errors);
  }

  const games = await services.data.gameSearch.myGames(user.userId);

  const usersMissions = await services.data.playerMission.getMany({
    userId: user.userId,
  });

  return games.map((g) => toApiGameSearchResult(g, usersMissions));
};

export default myGames;
