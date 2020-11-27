declare namespace data {
  type GameSearch = data.Game & {
    playerCount: number;
  };

  interface GameSearchClient
    extends data.EntityClientBase<data.GameTable, void, GameSearch> {
    myGames(
      userId: number,
      t?: data.IDBTransaction
    ): Promise<data.GameSearch[]>;
  }
}
