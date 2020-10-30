declare namespace data {
  type Game = {
    gameId: number;
    title: string;
    ownerId: number;
    startedAt: Date | undefined;
    finishedAt: Date | undefined;
    toFinishAt: Date | undefined;
  };

  type NewGame = Pick<data.GameTable, "title" | "ownerId">;

  interface GameClient
    extends data.EntityClientBase<data.GameTable, NewGame, Game> {}
}
