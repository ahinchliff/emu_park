import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";

const MAX_BATCH_SIZE = 25;

export default class SocketService implements core.backend.ISocketService {
  private dynamoDB: AWS.DynamoDB.DocumentClient;
  private agw: AWS.ApiGatewayManagementApi;
  constructor(private config: core.backend.config.Config["websockets"]) {
    this.dynamoDB = new AWS.DynamoDB.DocumentClient();
    this.agw = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: config.endpoint,
    });
  }

  public subscribeConnectionToRoom = async (
    connectionId: string,
    room: string,
    connectionExpiry: string
  ) => {
    await this.dynamoDB
      .put({
        TableName: this.config.dynamoTableName,
        Item: {
          id: uuid(),
          connectionId,
          room,
          connectionExpiry,
        },
      })
      .promise();
  };

  public unsubscribeConnectionFromAllRooms = async (connectionId: string) => {
    const subscriptions = await this.dynamoDB
      .query({
        TableName: this.config.dynamoTableName,
        IndexName: "connectionId",
        ExpressionAttributeValues: {
          ":connectionId": connectionId,
        },
        KeyConditionExpression: "connectionId = :connectionId",
      })
      .promise();

    if (subscriptions.Items) {
      const deleteRequests = subscriptions.Items.map((s) => ({
        DeleteRequest: {
          Key: {
            id: s.id,
          },
        },
      }));

      for (let i = 0; i < deleteRequests.length; i += MAX_BATCH_SIZE) {
        const requests = deleteRequests.slice(i, i + MAX_BATCH_SIZE);
        await this.dynamoDB
          .batchWrite({
            RequestItems: {
              [this.config.dynamoTableName]: requests,
            },
          })
          .promise();
      }
    }
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

  public closeConnection = async (connectionId: string) => {
    await this.agw.deleteConnection({ ConnectionId: connectionId }).promise();
    this.unsubscribeConnectionFromAllRooms(connectionId);
  };

  public sendTestMessage = async (room: string, message: string) => {
    await this.emitEventToRoom(room, "test_event", { message });
  };

  private emitEventToRoom = async <T>(room: string, event: string, body: T) => {
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
        } else {
          // logging
        }
      }
    });
  };
}
