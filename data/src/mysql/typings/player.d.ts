declare namespace data {
  type Player = {
    userId: data.PlayerTable["userId"];
    displayName: data.UserTable["displayName"];
  };

  type NewPlayer = Pick<data.PlayerTable, "userId" | "gameId">;

  interface PlayerClient
    extends data.EntityClientBase<data.PlayerTable, NewPlayer, Player> {}
}
