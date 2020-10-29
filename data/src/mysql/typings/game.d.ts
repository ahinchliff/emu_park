declare namespace data {
  type Game = {
    gameId: number;
    title: string;
    ownerId: number;
    startedAt: string | undefined;
    finishedAt: string | undefined;
    toFinishAt: string | undefined;
  };

  type NewGame = Pick<data.Game, "title" | "ownerId">;

  interface GameClient extends data.EntityClientBase<Game, NewGame> {}
}
