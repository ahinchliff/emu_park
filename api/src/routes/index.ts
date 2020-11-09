import * as Koa from "koa";
import * as Router from "@koa/router";
import { authBuilder, noAuthBuilder } from "./handlerBuilders";
import authHandlers from "./auth";
import gameHandlers from "./game";

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

  const gameRouter = new Router({ prefix: "/game" });
  gameRouter.post("/", auth(gameHandlers.create));
  gameRouter.get("/:gameId", auth(gameHandlers.get));
  gameRouter.post("/:gameId/join", auth(gameHandlers.join));
  gameRouter.post("/:gameId/start", auth(gameHandlers.start));
  gameRouter.post(
    "/:gameId/mission/:missionId",
    auth(gameHandlers.markMission)
  );
  gameRouter.post("/:gameId/finish", auth(gameHandlers.finish));

  app.use(authRouter.routes());
  app.use(gameRouter.routes());
};
