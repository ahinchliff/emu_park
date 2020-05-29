import ConfigService from "../../../core/build/config-service";
import Logger from "../../../core/build/logger";
import AuthService from "../../../core/build/auth-service";
import SocketService from "../../../core/build/socket-service";

type Config = Pick<core.config.Config, "auth" | "env" | "websockets">;

type APIGatewayWebsocketEvent = {
  requestContext: {
    routeKey: "$connect" | "$disconnect" | "authenticate";
    connectionId: string;
  };
  body: string;
};

let config: Config | undefined = undefined;
let authService: core.IAuthService | undefined = undefined;
let socketService: core.ISocketService | undefined = undefined;

const success = { statusCode: 200 };
const error = { statusCode: 500 };
const unauthorized = { statusCode: 401 };
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

  logger.debug("Event receieved", { routeKey, connectionId });

  if (routeKey === "$connect") {
    return success;
  }

  if (routeKey === "$disconnect") {
    return await onDisconnect(connectionId, socketService, logger);
  }

  if (routeKey === "authenticate") {
    return await onAuthenticate(
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

const onAuthenticate = async (
  connectionId: string,
  body: string,
  socketService: core.ISocketService,
  authService: core.IAuthService,
  logger: core.Logger
) => {
  const closeConnection = () => socketService.closeConnection(connectionId);

  if (!body) {
    logger.debug("No body");
    await closeConnection();
    return badRequest('Property "body" is missing on request');
  }

  const parsedBody = JSON.parse(body) as { token?: string };

  if (!parsedBody.token) {
    logger.debug("No token");
    await closeConnection();
    return badRequest('Property "token" is missing on request.body');
  }

  try {
    const authId = await authService.getAuthIdFromJwt(parsedBody.token, logger);

    if (!authId) {
      logger.debug("Failed to get authId from token");
      await closeConnection();
      return unauthorized;
    }

    await socketService.subscribeConnectionToRoom(connectionId, authId);
    return success;
  } catch (e) {
    logger.error("Error in onAuthenticate", e);
    await closeConnection();
    return error;
  }
};

const onDisconnect = async (
  connectionId: string,
  socketService: core.ISocketService,
  logger: core.Logger
) => {
  try {
    await socketService.unsubscribeConnectionFromAllRooms(connectionId);
    return success;
  } catch (e) {
    logger.error("Error in onDisconnect", e);
    return error;
  }
};
