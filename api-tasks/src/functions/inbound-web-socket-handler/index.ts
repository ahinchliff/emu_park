// import { Handler } from "aws-lambda";
// import generateLambda, { AWSEvent } from "../generate-lambda";
// import InboundWebSocketHandlerExecution from "./execution";
// // import AuthService from "../../../../core-backend/build/auth-service";
// import SocketService from "../../../../core-backend/build/socket-service";

// type APIGatewaySocketEvent = AWSEvent & {
//   requestContext: {
//     routeKey: "$connect" | "$disconnect" | "$default";
//     connectionId: string;
//   };
//   body: string;
// };

// export const handler: Handler<APIGatewaySocketEvent, void> = generateLambda({
//   sensitiveConfig: [],
//   initServices: async (config) => ({
//     // authService: new AuthService(config.auth),
//     socketService: new SocketService(config.websockets),
//   }),
//   eventToVariables: (event) => ({
//     routeKey: event.requestContext.routeKey,
//     connectionId: event.requestContext.connectionId,
//     data: event.body,
//   }),
//   execution: InboundWebSocketHandlerExecution,
// });
