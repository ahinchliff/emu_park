import { Pool, RowDataPacket } from "mysql2/promise";
import { select } from "sql-bricks";
import EntityClientBase from "./base/EntityClientBase";
import { prepareObjectForSql, rowExtractor, on, table } from "./utils";

export default class GameClient
  extends EntityClientBase<"game", data.Game, data.NewGame>
  implements data.GameClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super("game", pool, logger, logValues, mapper, "gameId");
  }

  public myGames = async (
    userId: number,
    t?: data.IDBTransaction
  ): Promise<data.Game[]> => {
    const sql = select()
      .from(this.tableName)
      .leftJoin(table("player"))
      .on(on("game", "player", "gameId"))
      .where(prepareObjectForSql("player", { userId }));

    return this.queryMany(sql, t);
  };
}

const mapper = (row: RowDataPacket): data.Game => {
  const game = rowExtractor("game", row);
  return {
    gameId: game("gameId"),
    title: game("title"),
    ownerId: game("ownerId"),
    joinCode: game("joinCode"),
    startedAt: game("startedAt"),
    finishedAt: game("finishedAt"),
    toFinishAt: game("toFinishAt"),
  };
};
