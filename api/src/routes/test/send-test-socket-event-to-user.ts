import { UnAuthRequestHandler } from "../handlerBuilders";

type Body = {
  userId: string;
};

const sendTestSocketEvent: UnAuthRequestHandler<
  {},
  {},
  Body,
  data.User | undefined
> = async ({ services }) => {
  const user = await services.data.user.get({ userId: 1 });

  console.log('-------!!!!')
  
  return user;
};

export default sendTestSocketEvent;
