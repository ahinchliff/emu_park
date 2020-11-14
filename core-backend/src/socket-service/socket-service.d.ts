declare namespace core.backend {
  interface ISocketService {
    subscribeToUser(connectionId: string, userId: number): Promise<void>;
    unsubscribeFromUser(connectionId: string, userId: number): Promise<void>;
    subscribeToGame(connectionId: string, gameId: number): Promise<void>;
    unsubscribeFromGame(connectionId: string, gameId: number): Promise<void>;
    closeConnection(connectionId: string): Promise<void>;
    unsubscribeConnectionFromAllRooms(connectionId: string): Promise<void>;
    emitTestEventToUser(userId: number, message: string): Promise<void>;
    emitGameUpdate(gameId: number, game: any): Promise<void>;
  }
}
