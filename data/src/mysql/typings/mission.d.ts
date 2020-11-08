declare namespace data {
  type Mission = Pick<data.MissionTable, "missionId" | "description">;
  type NewMission = Pick<data.MissionTable, "description">;

  interface MissionClient
    extends data.EntityClientBase<data.MissionTable, NewMission, Mission> {
    getNRandomMissions(
      numberOfMissions: number,
      t?: data.IDBTransaction
    ): Promise<data.Mission[]>;
  }
}
