import * as mysql from "../../../data/build/mysql/index";
import FileService from "../../../core-backend/build/file-service";
import AuthService from "../../../core-backend/build/auth-service";
import SocketService from "../../../core-backend/build/socket-service";

export const initServices = async (
  config: api.Config,
  mysqlPool: any
): Promise<(logger: core.backend.Logger) => api.Services> => {
  const auth = new AuthService(config.auth);
  const file = new FileService(config.bucketNames);
  const socket = new SocketService(config.websockets);

  return (logger: core.backend.Logger) => {
    return {
      data: mysql.getClients(
        mysqlPool,
        logger,
        config.environment === "development" || config.environment === "staging"
      ),
      auth,
      file,
      socket,
    };
  };
};
