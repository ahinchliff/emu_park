import * as mysql from "../../../data/build/mysql/index";
import FileService from "../../../core/build/file-service";
import AuthService from "../../../core/build/auth-service";
import SocketService from "../../../core/build/socket-service";

export const initServices = async (
  config: api.Config,
  mysqlPool: any
): Promise<(logger: core.Logger) => api.Services> => {
  const auth = new AuthService(config.auth);
  const file = new FileService(config.bucketNames);
  const socket = new SocketService(config.websockets);

  return (logger: core.Logger) => {
    return {
      data: mysql.getClients(
        mysqlPool,
        logger,
        config.env === "dev" || config.env === "staging"
      ),
      auth,
      file,
      socket,
    };
  };
};
