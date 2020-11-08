declare namespace data {
  interface DataClients {
    user: data.UserClient;
    game: data.GameClient;
    player: data.PlayerClient;
    playerMission: data.PlayerMissionClient;
    mission: data.MissionClient;
    dbTransaction: data.IDBTransactionClient;
  }
}
