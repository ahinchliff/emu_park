import * as Koa from "koa";
import * as Router from "@koa/router";
import { authBuilder, noAuthBuilder } from "./handlerBuilders";
import authHandlers from "./auth";
import user from "./user";
import test from "./test";

export default (
  app: Koa,
  config: api.Config,
  services: (logger: core.backend.Logger) => api.Services
): void => {
  const auth = authBuilder(config, services);
  const unAuth = noAuthBuilder(config, services);

  const authRouter = new Router({ prefix: "/auth" });
  authRouter.get("/me", auth(authHandlers.getMe));
  authRouter.post("/signup", auth(authHandlers.signup));

  const userRouter = new Router({ prefix: "/user" });
  userRouter.get(
    "/profile-picture-upload-url",
    auth(user.getProfilePictureUploadUrl)
  );

  const testRouter = new Router({ prefix: "/test" });
  testRouter.post("/user-socket", unAuth(test.sendTestSocketEvent));

  app.use(authRouter.routes());
  app.use(userRouter.routes());
  app.use(testRouter.routes());
};
