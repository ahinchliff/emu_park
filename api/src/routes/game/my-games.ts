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

  const games = await services.data.game.myGames(user.userId);

  return games.map(toApiGameSearchResult);
};

export default myGames;
