// tslint:disable:no-submodule-imports
import { PoolConnection, createPool, Pool } from "mysql2/promise";
import MysqlDBTransactionClient from "./clients/DBTransaction";
import UserClient from "./clients/User";

export async function initialise(
  config: data.IMysqlConfig,
  logger: core.Logger
): Promise<Pool> {
  logger.debug("Creating MySQL pool");
  return new Promise(
    (resolve: (pool: Pool | PromiseLike<Pool>) => void): void => {
      const pool = createPool({
        connectionLimit: config.connectionLimit,
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
      });

      pool.getConnection().then(
        (conn: PoolConnection): void => {
          conn.release();
          logger.debug("Successfully created MySQL pool");
          resolve(pool);
        },
        (err: Error): void => {
          logger.error("Error creating MySQL pool. Retrying...", err);
          setTimeout(() => resolve(initialise(config, logger)), 4000);
        }
      );
    }
  );
}

export const getClients = (
  pool: Pool,
  logger: core.Logger,
  logValues: boolean
): data.DataClients => ({
  dbTransaction: new MysqlDBTransactionClient(pool, logger),
  user: new UserClient(pool, logger, logValues),
});
