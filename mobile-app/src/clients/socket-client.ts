export default class Sockets {
  private connection: WebSocket | undefined;
  private authToken: string | undefined;
  private subscriptions: { event: string; data: any }[] = [];
  private onEventHandlers: { event: string; fn: any }[] = [];

  constructor(protected config: config.Config) {}

  public addOnEvent = async (event: string, fn: any) => {
    this.onEventHandlers = [...this.onEventHandlers, { event, fn }];
  };

  public subscribe = async (event: string, data?: any) => {
    const subscribeEvent = this.getSubscribeEvent(event);
    this.subscriptions = [
      ...this.subscriptions,
      { event: subscribeEvent, data },
    ];
    await this.send(subscribeEvent, data);
  };

  public unsubscribe = async (event: string, data?: any) => {
    const subscribeEvent = this.getSubscribeEvent(event);
    const unsubscribeEvent = this.getUnsubscribeEvent(event);

    this.subscriptions = this.subscriptions.filter(
      (s) =>
        !(
          s.event === subscribeEvent &&
          JSON.stringify(s.data) === JSON.stringify(data)
        )
    );

    await this.send(unsubscribeEvent, data);
  };

  public send = async (event: string, _data?: any) => {
    const connection = await this.getConnection();
    console.log(`SocketClient - Sending "${event}"`);
    connection.send(
      JSON.stringify({
        event,
        token: this.authToken,
      })
    );
  };

  public disconnect = () => {
    if (this.connection) {
      this.connection.close();
      this.connection = undefined;
    }
  };

  public reconnect = () => {
    this.subscriptions.forEach((s) => this.send(s.event, s.data));
  };

  public clearAuthorization = (): void => {
    this.authToken = undefined;
  };

  public setAuthorization = (authToken: string): void => {
    this.authToken = authToken;
  };

  private connect = async (): Promise<WebSocket> => {
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
    this.connection.onmessage = this.onMessage;
    return connection;
  };

  private getConnection = async () => {
    if (this.connection) {
      return this.connection;
    } else {
      return this.connect();
    }
  };

  private onMessage = (message: { data?: string }) => {
    if (!message.data) {
      return console.log("SocketClient - Message received but data missing");
    }

    const data = JSON.parse(message.data) as { event?: string; body?: any };

    console.log(data);

    if (!data.event) {
      return console.log(
        "SocketClient - Message received but with no message.data.event"
      );
    }

    console.log(`SocketClient - Message received - Event:${data.event}`);

    const handler = this.onEventHandlers.find((h) => h.event === data.event);

    if (!handler) {
      return console.log(
        `SocketClient - No handler found - Event: ${data.event}`
      );
    }

    handler.fn(data.body);
  };

  private getSubscribeEvent = (event: string) => {
    return `SUBSCRIBE_${event}`;
  };

  private getUnsubscribeEvent = (event: string) => {
    return `UNSUBSCRIBE_${event}`;
  };
}
