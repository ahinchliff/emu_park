import { Pool, RowDataPacket } from "mysql2/promise";
import { select } from "sql-bricks";
import EntityClientBase from "./base/EntityClientBase";
import { rowExtractor } from "./utils";

export default class MissionClient
  extends EntityClientBase<"mission", data.Mission, data.NewMission>
  implements data.MissionClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super("mission", pool, logger, logValues, mapper, "missionId");
  }

  public getNRandomMissions = (
    numberOfMissions: number,
    t?: data.IDBTransaction
  ): Promise<data.Mission[]> => {
    const sql = select().from(this.tableName).orderBy("RAND()");
    return this.queryMany(sql, t, numberOfMissions);
  };
}

const mapper = (row: RowDataPacket): data.Mission => {
  const mission = rowExtractor("mission", row);
  return {
    missionId: mission("missionId"),
    description: mission("description"),
  };
};
