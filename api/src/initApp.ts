import * as Koa from "koa";
import app from "./app";
import * as mysql from "../../data/src/mysql/index";
import ConfigService from "../../core-backend/src/config-service";
import { initServices } from "./services";

export default async (
  logger: core.backend.Logger,
  region?: "eu-west-1"
): Promise<Koa> => {
  logger.debug("Initialising api");
  const configService = new ConfigService(logger, region);

  const config = await configService.get<api.Config>([
    "mysql_application_user_password",
  ]);
  logger.setEnviroment(config.environment);
  const mysqlPool = await mysql.initialise(config.mysql, logger);
  const services = await initServices(config, mysqlPool);
  const initiaisedApp = app(config, services);
  logger.debug("Api successfully intialised");
  return initiaisedApp;
};
