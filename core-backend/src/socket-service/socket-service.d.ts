declare namespace core.backend {
  interface ISocketService {
    subscribeToUser(connectionId: string, userId: string): Promise<void>;
    unsubscribeFromUser(connectionId: string, userId: string): Promise<void>;
    closeConnection(connectionId: string): Promise<void>;
    unsubscribeConnectionFromAllRooms(connectionId: string): Promise<void>;
    emitTestEventToUser(userId: string, message: string): Promise<void>;
  }
}
