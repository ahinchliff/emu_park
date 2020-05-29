import * as Koa from "koa";
import * as Router from "@koa/router";
import { authBuilder } from "./handlerBuilders";
import authHandlers from "./auth";
import user from "./user";

export default (
  app: Koa,
  config: api.Config,
  services: (logger: core.Logger) => api.Services
): void => {
  const auth = authBuilder(config, services);

  const authRouter = new Router({ prefix: "/auth" });
  authRouter.get("/me", auth(authHandlers.getMe));
  authRouter.post("/signup", auth(authHandlers.signup));

  const userRouter = new Router({ prefix: "/user" });
  userRouter.get(
    "/profile-picture-upload-url",
    auth(user.getProfilePictureUploadUrl)
  );

  app.use(authRouter.routes());
  app.use(userRouter.routes());
};
