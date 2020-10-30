import { Pool, RowDataPacket } from "mysql2/promise";
import EntityClientBase from "./base/EntityClientBase";
import { rowExtractor } from "./utils";

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
}

const mapper = (row: RowDataPacket): data.Game => {
  const game = rowExtractor("game", row);
  return {
    gameId: game("gameId"),
    title: game("title"),
    ownerId: game("ownerId"),
    startedAt: game("startedAt"),
    finishedAt: game("finishedAt"),
    toFinishAt: game("toFinishAt"),
  };
};
