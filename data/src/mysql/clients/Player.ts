import { Pool, RowDataPacket } from "mysql2/promise";
import { select } from "sql-bricks";
import EntityClientBase from "./base/EntityClientBase";
import { prepareObjectForSql, rowExtractor, on, table } from "./utils";

type Where = Partial<{ gameId: number; userId: number }>;

export default class PlayerClient
  extends EntityClientBase<"player", data.Player, data.NewPlayer>
  implements data.PlayerClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super("player", pool, logger, logValues, mapper, ["gameId", "userId"]);
  }

  public get = (
    where: Where,
    t?: data.IDBTransaction
  ): Promise<data.Player | undefined> => {
    return this.queryOne(this.basicSelect(where), t);
  };

  public getMany = (
    where: Where,
    t?: data.IDBTransaction
  ): Promise<data.Player[]> => {
    return this.queryMany(this.basicSelect(where), t);
  };

  private basicSelect = (where: Where) =>
    select()
      .from(this.tableName)
      .leftJoin(table("user"))
      .on(on("player", "user", "userId"))
      .where(prepareObjectForSql(this.tableName, where));
}

const mapper = (row: RowDataPacket): data.Player => {
  const player = rowExtractor("player", row);
  const user = rowExtractor("user", row);
  return {
    userId: player("userId"),
    username: user("username"),
    status: player("status"),
  };
};
