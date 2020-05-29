import { RequestHandlerPayload } from "../handlerBuilders";

type SignupRequestPayload = RequestHandlerPayload<
  { authId: string },
  {},
  {},
  data.User
>;

const signup = async ({ user, services }: SignupRequestPayload) => {
  const newUser = await services.data.user.create({
    authId: user.authId,
    email: "anthony.hinchliff@gmail.com",
  });

  return newUser;
};

export default signup;
