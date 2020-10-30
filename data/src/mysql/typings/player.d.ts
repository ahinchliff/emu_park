declare namespace data {
  type Player = {
    userId: data.PlayerTable["userId"];
    username: data.UserTable["username"];
    status: data.PlayerTable["status"];
  };

  type NewPlayer = Pick<data.PlayerTable, "userId" | "gameId"> & {
    status?: data.PlayerTable["status"];
  };

  interface PlayerClient
    extends data.EntityClientBase<data.PlayerTable, NewPlayer, Player> {}
}
