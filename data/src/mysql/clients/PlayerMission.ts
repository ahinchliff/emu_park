import { Pool, RowDataPacket } from "mysql2/promise";
import { select } from "sql-bricks";
import EntityClientBase from "./base/EntityClientBase";
import { prepareObjectForSql, rowExtractor, on, table } from "./utils";

type Where = Partial<{ gameId: number; userId: number }>;

export default class PlayerMissionClient
  extends EntityClientBase<
    "gameUserMission",
    data.PlayerMission,
    data.NewPlayerMission
  >
  implements data.PlayerMissionClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super("gameUserMission", pool, logger, logValues, mapper, "userId");
  }

  public get = (
    where: Where,
    t?: data.IDBTransaction
  ): Promise<data.PlayerMission | undefined> => {
    return this.queryOne(this.basicSelect(where), t);
  };

  public getMany = (
    where: Where,
    t?: data.IDBTransaction
  ): Promise<data.PlayerMission[]> => {
    return this.queryMany(this.basicSelect(where), t);
  };

  private basicSelect = (where: Where) =>
    select()
      .from(this.tableName)
      .leftJoin(table("mission"))
      .on(on("gameUserMission", "mission", "missionId"))
      .where(prepareObjectForSql(this.tableName, where));
}

const mapper = (row: RowDataPacket): data.PlayerMission => {
  const gameUserMission = rowExtractor("gameUserMission", row);
  const mission = rowExtractor("mission", row);
  return {
    userId: gameUserMission("userId"),
    missionId: gameUserMission("missionId"),
    description: mission("description"),
    againstPlayerId: gameUserMission("againstPlayerId"),
    status: gameUserMission("status"),
  };
};
