import * as Koa from "koa";
import * as Router from "@koa/router";
import Logger from "../../../core-backend/build/logger";
import { addErrorToContext, notAuthorized } from "../utils/errorsUtils";

export type RequestHandlerPayload<User, Params, QueryString, Body> = {
  user: User;
  config: api.Config;
  logger: core.backend.Logger;
  services: api.Services;
  params: Params;
  queryString: QueryString;
  body: Body;
};

type AuthRequestHandlerPayload<
  Params,
  QueryString,
  Body
> = RequestHandlerPayload<data.User, Params, QueryString, Body>;

type UnAuthRequestHandlerPayload<
  Params,
  QueryString,
  Body
> = RequestHandlerPayload<api.AuthUser | undefined, Params, QueryString, Body>;

type RequestHandler<Payload, Result extends Object> = (
  payload: Payload
) => Promise<Result>;

export type AuthRequestHandler<
  Params,
  QueryString,
  Body,
  Result
> = RequestHandler<
  AuthRequestHandlerPayload<Params, QueryString, Body>,
  Result
>;

export type UnAuthRequestHandler<
  Params,
  QueryString,
  Body,
  Result
> = RequestHandler<
  UnAuthRequestHandlerPayload<Params, QueryString, Body>,
  Result
>;

const getAuthId = async (
  ctx: Koa.Context,
  authService: core.backend.IAuthService,
  logger: core.backend.Logger
): Promise<string | undefined> => {
  const authToken = ctx.get("Authorization");
  const split = authToken && authToken.split && authToken.split("Bearer ");
  const token = split && split[1];
  if (!token) {
    return undefined;
  }

  const result = await authService.decodeJWT(token, logger);
  return result?.authId;
};

const handlerBuilder = (
  config: api.Config,
  getServices: (logger: core.backend.Logger) => api.Services,
  handler:
    | AuthRequestHandler<any, any, any, any>
    | UnAuthRequestHandler<any, any, any, any>,
  authRequired: boolean
): Router.Middleware => async (ctx, next) => {
  const logger = new Logger(config.env);
  const start = Date.now();
  logger.debug(`----> ${ctx.method} ${ctx.url}`);

  const services = getServices(logger);

  const authId = await getAuthId(ctx, services.auth, logger);

  let user: data.User | undefined = undefined;

  if (authId) {
    if (ctx.url === "/auth/signup") {
      user = { authId } as data.User;
    } else {
      user = await services.data.user.get({ authId });
    }
  }

  if (authRequired && !user) {
    addErrorToContext(ctx, notAuthorized());
  } else {
    console.log("------------------");
    console.log(JSON.stringify(ctx));
    const payload: RequestHandlerPayload<any, any, any, any> = {
      user,
      services,
      logger,
      config,
      params: ctx.params,
      queryString: ctx.querystring,
      body: ctx.request.body,
    };

    const result = await handler(payload);
    if (result.hasOwnProperty("statusCode")) {
      addErrorToContext(ctx, result);
    } else {
      ctx.status = 200;
      ctx.body = result;
    }
  }
  const end = Date.now();
  logger.debug(`<---- ${ctx.method} ${ctx.url} ${ctx.status} ${end - start}ms`);
  next();
};

const getBuilder = (requiresAuth: boolean) => (
  config: api.Config,
  getServices: (logger: core.backend.Logger) => api.Services
) => (handler: AuthRequestHandler<any, any, any, any>) =>
  handlerBuilder(config, getServices, handler, requiresAuth);

export const authBuilder = getBuilder(true);
export const noAuthBuilder = getBuilder(false);
