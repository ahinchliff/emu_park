import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as cors from "@koa/cors";
import routes from "./routes";

const initApp = (
  config: api.Config,
  services: (logger: any) => api.Services
): Koa => {
  const app = new Koa();
  app.use(cors());
  app.use(bodyParser());
  routes(app, config, services);
  return app;
};

export default initApp;
