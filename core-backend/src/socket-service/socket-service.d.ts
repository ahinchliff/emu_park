declare namespace core.backend {
  interface ISocketService {
    subscribeToUser(
      connectionId: string,
      userId: string,
      connectionExpiry: string
    ): Promise<void>;
    unsubscribeFromUser(connectionId: string, userId: string): Promise<void>;
    closeConnection(connectionId: string): Promise<void>;
    unsubscribeConnectionFromAllRooms(connectionId: string): Promise<void>;
    sendTestMessage(room: string, message: string): Promise<void>;
  }
}
