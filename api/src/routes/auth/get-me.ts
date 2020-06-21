import { AuthRequestHandler } from "../handlerBuilders";
import { toApiAuthUser } from "../../serialisers/to-api-auth-user";

const getMe: AuthRequestHandler<{}, {}, {}, api.AuthUser> = async ({
  user,
}) => {
  return toApiAuthUser(user);
};

export default getMe;
