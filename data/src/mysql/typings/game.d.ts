declare namespace data {
  type Game = {
    gameId: number;
    title: string;
    ownerId: number;
    joinCode: string;
    startedAt: Date | undefined;
    finishedAt: Date | undefined;
    toFinishAt: Date | undefined;
  };

  type NewGame = Pick<
    data.GameTable,
    "title" | "ownerId" | "joinCode" | "toFinishAt"
  >;

  interface GameClient
    extends data.EntityClientBase<data.GameTable, NewGame, Game> {}
}
