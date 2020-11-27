// tslint:disable:no-submodule-imports
import { PoolConnection, createPool, Pool } from "mysql2/promise";
import MysqlDBTransactionClient from "./clients/DBTransaction";
import GameClient from "./clients/Game";
import PlayerMissionClient from "./clients/PlayerMission";
import PlayerClient from "./clients/Player";
import UserClient from "./clients/User";
import MissionClient from "./clients/Mission";
import GameSearchClient from "./clients/GameSearch";
import GameEventClient from "./clients/GameEvent";

export async function initialise(
  config: data.IMysqlConfig,
  logger: core.backend.Logger
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
        timezone: "utc",
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
  logger: core.backend.Logger,
  logValues: boolean
): data.DataClients => ({
  dbTransaction: new MysqlDBTransactionClient(pool, logger),
  user: new UserClient(pool, logger, logValues),
  game: new GameClient(pool, logger, logValues),
  gameSearch: new GameSearchClient(pool, logger, logValues),
  player: new PlayerClient(pool, logger, logValues),
  playerMission: new PlayerMissionClient(pool, logger, logValues),
  mission: new MissionClient(pool, logger, logValues),
  gameEvent: new GameEventClient(pool, logger, logValues),
});
