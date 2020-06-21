import { RequestHandlerPayload } from "../handlerBuilders";
import { toApiAuthUser } from "../../serialisers/to-api-auth-user";

type SignupRequestPayload = RequestHandlerPayload<
  { authId: string },
  {},
  {},
  api.SignupBody
>;

const signup = async ({
  user,
  services,
  body,
}: SignupRequestPayload): Promise<api.AuthUser> => {
  const newUser = await services.data.user.create({
    authId: user.authId,
    email: body.email,
  });

  return toApiAuthUser(newUser);
};

export default signup;
