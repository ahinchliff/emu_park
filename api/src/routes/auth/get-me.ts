import { AuthRequestHandler } from "../handlerBuilders";

const getMe: AuthRequestHandler<{}, {}, {}, core.api.AuthUser> = async ({
  user,
  services,
}) => {
  await services.socket.sendTestMessage(user.authId, "This is a test message");

  await services.socket.unsubscribeConnectionFromRoom(
    "NT8tMcYdjoECHkA=",
    user.authId
  );
  return (user as unknown) as core.api.AuthUser;
};

export default getMe;
