import ConfigService from "../../../core-backend/build/config-service";
import Logger from "../../../core-backend/build/logger";
import AuthService from "../../../core-backend/build/auth-service";
import SocketService from "../../../core-backend/build/socket-service";
import { toDatabaseDate } from "../../../core-backend/build/utils";

type Config = Pick<core.backend.config.Config, "auth" | "env" | "websockets">;

type EventToDataMapping = {
  SUBSCRIBE_PERSONAL: undefined;
  UNSUBSCRIBE_PERSONAL: undefined;
};

type Event = keyof EventToDataMapping;

type APIGatewayWebsocketEvent = {
  requestContext: {
    routeKey: "$connect" | "$disconnect" | "$default";
    connectionId: string;
  };
  body: string;
};

type Handler<Token, Data> = (payload: {
  connectionId: string;
  data: Data;
  socketService: core.backend.ISocketService;
  token: Token;
}) => Promise<void>;

type AuthHandler<Data> = Handler<api.AuthToken, Data>;

// type UnAuthHandler<Data> = Handler<undefined, Data>;

let config: Config | undefined = undefined;
let authService: core.backend.IAuthService | undefined = undefined;
let socketService: core.backend.ISocketService | undefined = undefined;

const success = { statusCode: 200 };
const error = { statusCode: 500 };
const badRequest = (message: string) => ({
  statusCode: 400,
  body: message,
});

export const handler = async (event: APIGatewayWebsocketEvent) => {
  const logger = new Logger("dev");
  if (!config || !authService || !socketService) {
    logger.debug("Initialising function");
    const configService = new ConfigService(logger);
    config = await configService.get<Config>([]);
    if (config) {
      authService = new AuthService(config.auth);
      socketService = new SocketService(config.websockets);
    }
  }

  if (!config || !authService || !socketService) {
    return logger.error("Failed to initialise", {
      config: !!config,
      authService: !!authService,
    });
  }

  logger.setEnviroment(config.env);

  const {
    body,
    requestContext: { routeKey, connectionId },
  } = event;

  logger.debug("Route", { routeKey, connectionId });

  if (routeKey === "$connect") {
    return success;
  }

  if (routeKey === "$disconnect") {
    return await onDisconnect(connectionId, socketService, logger);
  }

  if (routeKey === "$default") {
    return await onDefault(
      connectionId,
      body,
      socketService,
      authService,
      logger
    );
  }

  logger.error("No handler for routekey", { routeKey });
  return error;
};

const onDefault = async (
  connectionId: string,
  body: string,
  socketService: core.backend.ISocketService,
  authService: core.backend.IAuthService,
  logger: core.backend.Logger
) => {
  if (!body) {
    return logger.debug("No body");
  }

  const parsedBody = JSON.parse(body) as {
    token?: string;
    event: Event | undefined;
    data: EventToDataMapping[Event];
  };

  if (!parsedBody.event) {
    logger.debug('Property "body" is missing on request');
    return badRequest('Property "body" is missing on request');
  }

  logger.debug("Event on body", { event: parsedBody.event });

  const eventToFunctionMap: {
    [key in Event]: {
      fn: Handler<any, any>;
      requiresAuth: boolean;
    };
  } = {
    SUBSCRIBE_PERSONAL: { fn: onSubscribePersonal, requiresAuth: true },
    UNSUBSCRIBE_PERSONAL: { fn: onUnsubscribePersonal, requiresAuth: true },
  };

  const handler = eventToFunctionMap[parsedBody.event];

  if (handler.requiresAuth) {
    if (!parsedBody.token) {
      logger.debug("Handler requires auth but no token on body");
      return badRequest("Handler requires auth but no token on body");
    }

    const decodedToken = await authService.decodeJWT(parsedBody.token, logger);

    if (!decodedToken) {
      logger.debug("Failed to decode JWT token");
      return badRequest("Failed to decode JWT token");
    }

    if (!decodedToken.userId) {
      logger.debug("Failed to decode get userId from JWT token");
      return badRequest("Failed to decode get userId from JWT token");
    }

    if (!decodedToken.expiry) {
      logger.debug("Failed to decode get expiry from JWT token");
      return badRequest("Failed to decode get expiry from JWT token");
    }

    await handler.fn({
      connectionId,
      data: parsedBody.data,
      socketService,
      token: decodedToken,
    });
  } else {
    await handler.fn({
      connectionId,
      data: parsedBody.data,
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

const onSubscribePersonal: AuthHandler<
  EventToDataMapping["SUBSCRIBE_PERSONAL"]
> = async ({ socketService, connectionId, token }) => {
  await socketService.subscribeToUser(
    connectionId,
    token.userId.toString(),
    toDatabaseDate(token.expiry)
  );
};

const onUnsubscribePersonal: AuthHandler<
  EventToDataMapping["SUBSCRIBE_PERSONAL"]
> = async ({ socketService, connectionId, token }) => {
  await socketService.unsubscribeFromUser(
    connectionId,
    token.userId.toString()
  );
};
