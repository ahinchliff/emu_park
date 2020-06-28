import { UnAuthRequestHandler } from "../handlerBuilders";

type Body = {
  userId: string;
};

const sendTestSocketEvent: UnAuthRequestHandler<
  {},
  {},
  Body,
  { success: true }
> = async ({ body, services }) => {
  await services.socket.emitTestEventToUser(body.userId, "Please work");

  return { success: true };
};

export default sendTestSocketEvent;
