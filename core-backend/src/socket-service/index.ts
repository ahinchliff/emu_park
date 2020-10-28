import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { toDatabaseDate } from "../utils";

const MAX_BATCH_SIZE = 25;

export default class SocketService implements core.backend.ISocketService {
  private dynamoDB: AWS.DynamoDB.DocumentClient;
  private agw: AWS.ApiGatewayManagementApi;
  // core.backend.config.Config["websockets"]
  constructor(private config: any) {
    this.dynamoDB = new AWS.DynamoDB.DocumentClient();
    this.agw = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: config.endpoint,
    });
  }

  public subscribeToUser = async (connectionId: string, userId: string) => {
    await this.subscribeConnectionToRoom(
      connectionId,
      this.getUserRoom(userId)
    );
  };

  public unsubscribeFromUser = async (connectionId: string, userId: string) => {
    await this.unsubscribeConnectionFromRoom(
      connectionId,
      this.getUserRoom(userId)
    );
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

  private unsubscribeConnectionFromRoom = async (
    connectionId: string,
    room: string
  ) => {
    const subscriptions = await this.dynamoDB
      .query({
        TableName: this.config.dynamoTableName,
        IndexName: "connectionId",
        ExpressionAttributeValues: {
          ":connectionId": connectionId,
          ":room": room,
        },
        KeyConditionExpression: "connectionId = :connectionId and room = :room",
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

  public closeConnection = async (connectionId: string) => {
    await this.agw.deleteConnection({ ConnectionId: connectionId }).promise();
    this.unsubscribeConnectionFromAllRooms(connectionId);
  };

  public emitTestEventToUser = async (userId: string, message: string) => {
    await this.emitEventToRoom(this.getUserRoom(userId), "TEST_EVENT", {
      message,
    });
  };

  private subscribeConnectionToRoom = async (
    connectionId: string,
    room: string
  ) => {
    await this.dynamoDB
      .put({
        TableName: this.config.dynamoTableName,
        Item: {
          id: uuid(),
          connectionId,
          room,
          createdAt: toDatabaseDate(new Date()),
        },
      })
      .promise();
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

    console.log("Emiting event to connections", {
      room,
      event,
      count: usersConnectionSearchResult.Count,
    });

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
          console.log(e);
        }
      }
    });
  };

  private getUserRoom = (userId: string | number) => `USER_${userId}`;
}
