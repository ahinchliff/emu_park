export default class MockSocketService implements core.backend.ISocketService {
  public subscribeToUser = async (_connectionId: string, _userId: number) => {
    //
  };

  public unsubscribeFromUser = async (
    _connectionId: string,
    _userId: number
  ) => {
    //
  };

  public unsubscribeConnectionFromAllRooms = async (_connectionId: string) => {
    //
  };

  public closeConnection = async (_connectionId: string) => {
    //
  };

  public emitTestEventToUser = async (_userId: number, _message: string) => {
    //
  };

  public subscribeToGame = async (_connectionId: string, _gameId: number) => {
    //
  };

  public unsubscribeFromGame = async (
    _connectionId: string,
    _gameId: number
  ) => {
    //
  };

  public emitGameUpdate = async (_gameId: number, _game: api.Game) => {
    //
  };
}
