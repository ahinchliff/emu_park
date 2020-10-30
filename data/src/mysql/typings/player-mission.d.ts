declare namespace data {
  type PlayerMission = {
    userId: data.gameUserMissionTable["userId"];
    missionId: data.gameUserMissionTable["missionId"];
    description: data.MissionTable["description"];
    status: data.gameUserMissionTable["status"];
  };

  type NewPlayerMission = {
    missionId: data.MissionTable["missionId"];
    userId: data.UserTable["userId"];
  };

  interface PlayerMissionClient
    extends data.EntityClientBase<
      data.gameUserMissionTable,
      NewPlayerMission,
      PlayerMission
    > {}
}
