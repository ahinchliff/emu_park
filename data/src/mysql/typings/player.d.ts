declare namespace data {
  type GamePlayer = {
    userId: number;
    username: string;
    score: number;
  };

  type NewGamePlayer = Pick<GamePlayer, "userId"> & Pick<data.Game, "gameId">;

  interface GamePlayerClient
    extends data.EntityClientBase<GamePlayer, NewGamePlayer> {}
}
