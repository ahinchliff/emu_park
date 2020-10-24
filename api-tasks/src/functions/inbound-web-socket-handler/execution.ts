import { Execution } from "../generate-lambda";

type Variables = {
  routeKey: "$connect" | "$disconnect" | "$default";
  connectionId: string;
  data: any;
};

type Services = {
  authService: core.backend.IAuthService;
  socketService: core.backend.ISocketService;
};

type Config = Pick<
  core.backend.config.Config,
  "auth" | "environment" | "websockets"
>;

type EventToDataMapping = {
  SUBSCRIBE_ME: undefined;
  UNSUBSCRIBE_ME: undefined;
};

type Event = keyof EventToDataMapping;

type Handler<Token, Data> = (payload: {
  connectionId: string;
  data: Data;
  socketService: core.backend.ISocketService;
  token: Token;
}) => Promise<any>;

type AuthHandler<Data> = Handler<api.AuthToken, Data>;

type InboundWebSocketHandlerExecution = Execution<
  Variables,
  Config,
  Services,
  void
>;

const success = new Promise((resolve) => resolve({ statusCode: 200 }));
const error = { statusCode: 500 };
const badRequest = (message: string) => ({
  statusCode: 400,
  body: message,
});

const InboundWebSocketHandlerExecution: InboundWebSocketHandlerExecution = async ({
  variables,
  services,
  logger,
}) => {
  const { routeKey, connectionId, data } = variables;

  logger.debug("Route", { routeKey, connectionId });

  if (routeKey === "$connect") {
    return success;
  }

  if (routeKey === "$disconnect") {
    return await onDisconnect(connectionId, services.socketService, logger);
  }

  if (routeKey === "$default") {
    return await onDefault(
      connectionId,
      data,
      services.socketService,
      services.authService,
      logger
    );
  }

  logger.error("No handler for routekey", { routeKey });
  return error;
};

const onDefault = async (
  connectionId: string,
  data: string,
  socketService: core.backend.ISocketService,
  authService: core.backend.IAuthService,
  logger: core.backend.Logger
) => {
  if (!data) {
    return logger.debug("No data");
  }

  const parseddata = JSON.parse(data) as {
    token?: string;
    event: Event | undefined;
    data: EventToDataMapping[Event];
  };

  if (!parseddata.event) {
    logger.debug('Property "data" is missing on request');
    return badRequest('Property "data" is missing on request');
  }

  logger.debug("Event on data", { event: parseddata.event });

  const eventToFunctionMap: {
    [key in Event]: {
      fn: Handler<any, any>;
      requiresAuth: boolean;
    };
  } = {
    SUBSCRIBE_ME: { fn: onSubscribeMe, requiresAuth: true },
    UNSUBSCRIBE_ME: { fn: onUnsubscribeMe, requiresAuth: true },
  };

  const handler = eventToFunctionMap[parseddata.event];

  if (handler.requiresAuth) {
    if (!parseddata.token) {
      logger.debug("Handler requires auth but no token on data");
      return badRequest("Handler requires auth but no token on data");
    }

    const decodedToken = await authService.decodeJWT(parseddata.token, logger);

    if (!decodedToken) {
      logger.debug("Failed to decode JWT token");
      return badRequest("Failed to decode JWT token");
    }

    if (!decodedToken.userId) {
      logger.debug("Failed to decode get userId from JWT token");
      return badRequest("Failed to decode get userId from JWT token");
    }

    return await handler.fn({
      connectionId,
      data: parseddata.data,
      socketService,
      token: decodedToken,
    });
  } else {
    return await handler.fn({
      connectionId,
      data: parseddata.data,
      socketService,
      token: undefined,
    });
  }
};

const onDisconnect = async (
  connectionId: string,
  socketService: core.backend.ISocketService,
  logger: core.backend.Logger
) => {
  try {
    await socketService.unsubscribeConnectionFromAllRooms(connectionId);
  } catch (e) {
    logger.error("Error in onDisconnect", e);
  }
};

const onSubscribeMe: AuthHandler<EventToDataMapping["SUBSCRIBE_ME"]> = async ({
  socketService,
  connectionId,
  token,
}) => {
  try {
    await socketService.subscribeToUser(connectionId, token.userId.toString());
    return success;
  } catch (e) {
    return error;
  }
};

const onUnsubscribeMe: AuthHandler<
  EventToDataMapping["UNSUBSCRIBE_ME"]
> = async ({ socketService, connectionId, token }) => {
  await socketService.unsubscribeFromUser(
    connectionId,
    token.userId.toString()
  );
};

export default InboundWebSocketHandlerExecution;
