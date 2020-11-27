import { Pool, RowDataPacket } from "mysql2/promise";
import { select } from "sql-bricks";
import EntityClientBase from "./base/EntityClientBase";
import { prepareObjectForSql, rowExtractor, on, table, column } from "./utils";

const PLAYER_COUNT_ALIAS = "playerCount";

export default class GameSearchClient
  extends EntityClientBase<"game", data.GameSearch, void>
  implements data.GameSearchClient {
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
  ): Promise<data.GameSearch[]> => {
    const sql = select(
      "*",
      `(SELECT COUNT(*) FROM ${table("player")} WHERE ${column("player")(
        "gameId"
      )} = ${column("game")("gameId")}) as ${PLAYER_COUNT_ALIAS}`
    )
      .from(this.tableName)
      .leftJoin(table("player"))
      .on(on("game", "player", "gameId"))
      .where(prepareObjectForSql("player", { userId }));

    return this.queryMany(sql, t);
  };
}

const mapper = (row: RowDataPacket): data.GameSearch => {
  const game = rowExtractor("game", row);
  return {
    gameId: game("gameId"),
    title: game("title"),
    ownerId: game("ownerId"),
    joinCode: game("joinCode"),
    startedAt: game("startedAt"),
    finishedAt: game("finishedAt"),
    toFinishAt: game("toFinishAt"),
    playerCount: row[PLAYER_COUNT_ALIAS],
  };
};
