export default class Sockets {
  private connection: WebSocket | undefined;
  private authToken: string | undefined;

  constructor(protected config: config.Config) {}

  public connect = async (): Promise<WebSocket> => {
    const connection = await new Promise<WebSocket>((resolve) => {
      const ws = new WebSocket(this.config.socketEndpoint);
      ws.onopen = () => {
        console.log(`SocketClient - Connected`);
        resolve(ws);
      };
      ws.onclose = () => {
        console.log("SocketClient - Disconnected");
      };
      ws.onerror = (err) => {
        console.log("SocketClient - Error", err);
      };
    });

    this.connection = connection;
    return connection;
  };

  public disconnect = () => {
    console.log(this.authToken);
    if (this.connection) {
      this.connection.close();
    }
  };

  public clearAuthorization = (): void => {
    this.authToken = undefined;
  };

  public setAuthorization = (authToken: string): void => {
    this.authToken = authToken;
  };

  public subscribeToPersonalRoom = async () => {
    (await this.getConnection()).send("");
  };

  private getConnection = async () => {
    if (this.connection) {
      return this.connection;
    } else {
      return this.connect();
    }
  };
}
