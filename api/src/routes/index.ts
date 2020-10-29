import * as Koa from "koa";
import * as Router from "@koa/router";
import { authBuilder, noAuthBuilder } from "./handlerBuilders";
import authHandlers from "./auth";

export default (
  app: Koa,
  config: api.Config,
  services: (logger: core.backend.Logger) => api.Services
): void => {
  const auth = authBuilder(config, services);
  const unAuth = noAuthBuilder(config, services);

  const authRouter = new Router({ prefix: "/auth" });
  authRouter.post("/signup", unAuth(authHandlers.signup));
  authRouter.post("/login", unAuth(authHandlers.login));
  authRouter.get("/me", auth(authHandlers.getMe));

  app.use(authRouter.routes());
};
