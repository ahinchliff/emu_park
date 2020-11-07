declare namespace data {
  type Player = {
    userId: data.PlayerTable["userId"];
    username: data.UserTable["username"];
  };

  type NewPlayer = Pick<data.PlayerTable, "userId" | "gameId">;

  interface PlayerClient
    extends data.EntityClientBase<data.PlayerTable, NewPlayer, Player> {}
}
