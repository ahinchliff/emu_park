import { Callback, Context, Handler } from "aws-lambda";
import Logger from "../../../core-backend/src/logger";
import ConfigService from "../../../core-backend/src/config-service";

export type AWSEvent = {
  incidentId: string;
};

type ExecutionConfig = Partial<core.backend.config.Config> &
  Pick<core.backend.config.Config, "environment" | "jwt">;

export type InitServices<Config, Services> = (
  config: Config,
  logger: core.backend.Logger
) => Promise<Services>;

export type EventToVariables<Event extends AWSEvent, Variables> = (
  event: Event
) => Variables;

export type Execution<
  Variables,
  Config extends ExecutionConfig,
  Services,
  Result
> = (payload: {
  variables: Variables;
  config: Config;
  services: Services;
  logger: core.backend.Logger;
}) => Promise<Result>;

const generateLambda = <
  Event extends AWSEvent,
  Variables,
  Config extends ExecutionConfig,
  Services,
  Result
>(details: {
  sensitiveConfig: core.backend.config.SensitiveConfigKey[];
  initServices: InitServices<Config, Services>;
  eventToVariables: EventToVariables<Event, Variables>;
  execution: Execution<Variables, Config, Services, Result>;
}): Handler<Event, void> => {
  let config: Config;
  let services: Services;

  return async (event: Event, _context: Context, callback: Callback) => {
    const {
      sensitiveConfig,
      initServices,
      eventToVariables,
      execution,
    } = details;
    try {
      const logger = new Logger("development", undefined, event.incidentId);

      if (!config || !services) {
        logger.debug("Initialising config and services");
        const configService = new ConfigService(logger);
        config = await configService.get<any>(sensitiveConfig);
        services = await initServices(config, logger);
      }

      logger.setEnvironment(config.environment);
      logger.debug("starting execution");
      const variables = eventToVariables(event);
      const result = await execution({
        variables,
        config,
        services,
        logger,
      });
      logger.debug("finished execution");
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  };
};

export default generateLambda;
