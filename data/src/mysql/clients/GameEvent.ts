import { Pool, RowDataPacket } from "mysql2/promise";
import EntityClientBase from "./base/EntityClientBase";
import { rowExtractor } from "./utils";

export default class GameEventClient
  extends EntityClientBase<"gameEvent", data.GameEvent, data.NewGameEvent>
  implements data.GameEventClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super("gameEvent", pool, logger, logValues, mapper, "gameEventId");
  }
}

const mapper = (row: RowDataPacket): data.GameEvent => {
  const gameEvent = rowExtractor("gameEvent", row);
  return {
    gameEventId: gameEvent("gameEventId"),
    gameId: gameEvent("gameId"),
    eventType: gameEvent("eventType"),
    data: gameEvent("data"),
    createdAt: gameEvent("createdAt"),
  };
};
