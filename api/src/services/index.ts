import * as mysql from "../../../data/src/mysql/index";
// import FileService from "../../../core-backend/src/file-service";
import AuthService from "../../../core-backend/src/auth-service";
import SocketService from "../../../core-backend/src/socket-service";

export const initServices = async (
  config: api.Config,
  mysqlPool: any
): Promise<(logger: core.backend.Logger) => api.Services> => {
  const auth = new AuthService(config.jwt);
  // const file = new FileService(config.bucketNames);
  const socket = new SocketService(config.websockets);

  return (logger: core.backend.Logger) => {
    return {
      data: mysql.getClients(
        mysqlPool,
        logger,
        config.environment === "development" || config.environment === "staging"
      ),
      auth,
      // file,
      socket,
    };
  };
};
