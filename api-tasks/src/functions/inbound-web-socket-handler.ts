import ConfigService from "../../../core-backend/build/config-service";
import Logger from "../../../core-backend/build/logger";
import AuthService from "../../../core-backend/build/auth-service";
import SocketService from "../../../core-backend/build/socket-service";
import { toDatabaseDate } from "../../../core-backend/build/utils";

type Config = Pick<core.backend.config.Config, "auth" | "env" | "websockets">;

type APIGatewayWebsocketEvent = {
  requestContext: {
    routeKey: "$connect" | "$disconnect" | "authenticate";
    connectionId: string;
  };
  body: string;
};

let config: Config | undefined = undefined;
let authService: core.backend.IAuthService | undefined = undefined;
let socketService: core.backend.ISocketService | undefined = undefined;

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
  socketService: core.backend.ISocketService,
  authService: core.backend.IAuthService,
  logger: core.backend.Logger
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
    const decodedToken = await authService.decodeJWT(parsedBody.token, logger);

    if (!decodedToken) {
      logger.debug("Failed to decode JWT token");
      await closeConnection();
      return unauthorized;
    }

    if (!decodedToken.authId) {
      logger.debug("Failed to decode get authId from JWT token");
      await closeConnection();
      return unauthorized;
    }

    if (!decodedToken.expiry) {
      logger.debug("Failed to decode get expiry from JWT token");
      await closeConnection();
      return unauthorized;
    }

    await socketService.subscribeConnectionToRoom(
      connectionId,
      decodedToken.authId,
      toDatabaseDate(decodedToken.expiry)
    );
    return success;
  } catch (e) {
    logger.error("Error in onAuthenticate", e);
    await closeConnection();
    return error;
  }
};

const onDisconnect = async (
  connectionId: string,
  socketService: core.backend.ISocketService,
  logger: core.backend.Logger
) => {
  try {
    await socketService.unsubscribeConnectionFromAllRooms(connectionId);
    return success;
  } catch (e) {
    logger.error("Error in onDisconnect", e);
    return error;
  }
};
