import * as AWS from "aws-sdk";

export default class SocketService implements core.ISocketService {
  private dynamoDB: AWS.DynamoDB.DocumentClient;
  private agw: AWS.ApiGatewayManagementApi;
  constructor(private config: core.config.Config["websockets"]) {
    this.dynamoDB = new AWS.DynamoDB.DocumentClient();
    this.agw = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: config.endpoint,
    });
  }

  public subscribeConnectionToRoom = async (
    connectionId: string,
    room: string
  ) => {
    await this.dynamoDB
      .put({
        TableName: this.config.dynamoTableName,
        Item: {
          connectionId,
          room,
        },
      })
      .promise();
  };

  public unsubscribeConnectionFromAllRooms = async (connectionId: string) => {
    await this.dynamoDB
      .delete({
        TableName: this.config.dynamoTableName,
        Key: {
          connectionId,
        },
      })
      .promise();
  };

  public unsubscribeConnectionFromRoom = async (
    connectionId: string,
    room: string
  ) => {
    await this.dynamoDB
      .delete({
        TableName: this.config.dynamoTableName,
        Key: {
          connectionId,
        },
        ExpressionAttributeValues: {
          ":room": room,
        },
        ConditionExpression: "room = :room",
      })
      .promise();
  };

  public connectionHasRecord = async (
    connectionId: string
  ): Promise<boolean> => {
    const connectionRecordResults = await this.dynamoDB
      .query({
        TableName: this.config.dynamoTableName,
        ExpressionAttributeValues: {
          ":connectionId": connectionId,
        },
        KeyConditionExpression: "connectionId = :connectionId",
      })
      .promise();

    return !!connectionRecordResults.Items?.length;
  };

  public closeConnection = async (connectionId: string) => {
    await this.agw.deleteConnection({ ConnectionId: connectionId }).promise();
  };

  public sendTestMessage = async (room: string, message: string) => {
    await this.emitEvent(room, "test_event", { message });
  };

  private emitEvent = async <T>(room: string, event: string, body: T) => {
    const usersConnectionSearchResult = await this.dynamoDB
      .query({
        TableName: this.config.dynamoTableName,
        IndexName: "room",
        ExpressionAttributeValues: {
          ":room": room,
        },
        KeyConditionExpression: "room = :room",
      })
      .promise();

    usersConnectionSearchResult.Items?.forEach(async (c) => {
      const data = {
        event,
        body,
      };

      try {
        await this.agw
          .postToConnection({
            ConnectionId: c.connectionId,
            Data: JSON.stringify(data),
          })
          .promise();
      } catch (e) {
        const error = e as AWS.AWSError;
        if (error.code === "GoneException") {
          this.unsubscribeConnectionFromAllRooms(c.connectionId);
        }
      }
    });
  };
}
