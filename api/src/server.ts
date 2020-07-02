import initApp from "./initApp";
import Logger from "../../core-backend/build/logger";

(async () => {
  // At this point we don't known what enviorment we are in because we havent
  // fetched config yet. Assume dev as we are just initialising.
  const logger = new Logger("development", "api-init");
  const app = await initApp(logger, "eu-west-1");
  app.listen(3001);
  logger.debug("Api running on port 3001");
})();
