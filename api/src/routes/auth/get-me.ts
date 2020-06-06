import { AuthRequestHandler } from "../handlerBuilders";

const getMe: AuthRequestHandler<
  {},
  {},
  {},
  core.backend.api.AuthUser
> = async ({ user, services }) => {
  await services.socket.sendTestMessage(user.authId, "This is a test message");

  await services.socket.unsubscribeConnectionFromRoom(
    "NT8tMcYdjoECHkA=",
    user.authId
  );
  return (user as unknown) as core.backend.api.AuthUser;
};

export default getMe;
