declare namespace data {
  type PlayerMission = {
    userId: data.GameUserMissionTable["userId"];
    missionId: data.GameUserMissionTable["missionId"];
    description: data.MissionTable["description"];
    againstPlayerId: data.GameUserMissionTable["againstPlayerId"];
    status: data.GameUserMissionTable["status"];
  };

  type NewPlayerMission = {
    gameId: data.GameUserMissionTable["gameId"];
    missionId: data.GameUserMissionTable["missionId"];
    userId: data.GameUserMissionTable["userId"];
  };

  interface PlayerMissionClient
    extends data.EntityClientBase<
      data.GameUserMissionTable,
      NewPlayerMission,
      PlayerMission
    > {}
}
