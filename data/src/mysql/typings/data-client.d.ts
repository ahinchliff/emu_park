declare namespace data {
  interface DataClients {
    user: data.UserClient;
    game: data.GameClient;
    gameSearch: data.GameSearchClient;
    player: data.PlayerClient;
    playerMission: data.PlayerMissionClient;
    mission: data.MissionClient;
    gameEvent: data.GameEventClient;
    dbTransaction: data.IDBTransactionClient;
  }
}
