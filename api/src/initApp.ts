import * as Koa from "koa";
import app from "./app";
import * as mysql from "../../data/build/mysql/index";
import ConfigService from "../../core-backend/build/config-service";
import { initServices } from "./services";

export default async (
  logger: core.backend.Logger,
  defaultRegion?: "eu-west-1"
): Promise<Koa> => {
  logger.debug("Initialising api");
  const configService = new ConfigService(logger, defaultRegion);

  const config = await configService.get<api.Config>([
    "mysql_application_user_password",
  ]);
  logger.setEnviroment(config.env);
  const mysqlPool = await mysql.initialise(config.mysql, logger);
  const services = await initServices(config, mysqlPool);
  const initiaisedApp = app(config, services);
  logger.debug("Api successfully intialised");
  return initiaisedApp;
};