declare namespace data {
  type PlayerMission = {
    userId: data.gameUserMissionTable["userId"];
    missionId: data.gameUserMissionTable["missionId"];
    description: data.MissionTable["description"];
    status: data.gameUserMissionTable["status"];
  };

  type NewPlayerMission = {
    gameId: data.gameUserMissionTable["gameId"];
    missionId: data.gameUserMissionTable["missionId"];
    userId: data.gameUserMissionTable["userId"];
  };

  interface PlayerMissionClient
    extends data.EntityClientBase<
      data.gameUserMissionTable,
      NewPlayerMission,
      PlayerMission
    > {}
}
