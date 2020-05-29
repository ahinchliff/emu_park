declare namespace core {
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
    connectionHasRecord(connectionId: string): Promise<boolean>;
    sendTestMessage(room: string, message: string): Promise<void>;
  }
}
