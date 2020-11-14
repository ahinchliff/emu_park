import * as Koa from "koa";
import * as serverlessHttp from "serverless-http";
import initApp from "./initApp";
import Logger from "../../core-backend/src/logger";

let app: Koa | undefined = undefined;

export const api = async (
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.Context
) => {
  if (!app) {
    // At this point we don't known what enviorment we are in because we havent
    // fetched config yet. Assume dev as we are just initialising.
    const logger = new Logger("development", "api-init");

    app = await initApp(logger);
  }

  const serverlessApp = serverlessHttp(app);
  return serverlessApp(event, context);
};
