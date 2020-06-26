import { RequestHandlerPayload } from "../handlerBuilders";
import { toApiAuthUser } from "../../serialisers/to-api-auth-user";

type SignupRequestPayload = RequestHandlerPayload<
  { authId: string; email: string },
  {},
  {},
  api.SignupBody
>;

const signup = async ({
  user,
  services,
}: SignupRequestPayload): Promise<api.AuthUser> => {
  const newUser = await services.data.user.create({
    authId: user.authId,
    email: user.email,
  });

  await services.auth.setUserIdOnAuthService(user.authId, newUser.userId);

  return toApiAuthUser(newUser);
};

export default signup;
