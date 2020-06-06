declare namespace core.backend {
  interface ISocketService {
    closeConnection(connectionId: string): Promise<void>;
    subscribeConnectionToRoom(
      connectionId: string,
      userAuthId: string
    ): Promise<void>;
    unsubscribeConnectionFromRoom(
      connectionId: string,
      room: string
    ): Promise<void>;
    unsubscribeConnectionFromAllRooms(connectionId: string): Promise<void>;
    sendTestMessage(room: string, message: string): Promise<void>;
  }
}
