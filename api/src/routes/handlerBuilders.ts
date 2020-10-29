import * as Koa from "koa";
import * as Router from "@koa/router";
import * as jwt from "jsonwebtoken";
import Logger from "../../../core-backend/src/logger";
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
) => Promise<Result | api.ErrorResponse>;

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

const getDecodedJWT = async (
  ctx: Koa.Context,
  logger: core.backend.Logger
): Promise<api.AuthToken | undefined> => {
  const authToken = ctx.get("Authorization");
  const split = authToken && authToken.split && authToken.split("Bearer ");
  const token = split && split[1];
  if (!token) {
    return undefined;
  }

  try {
    return jwt.verify(token, "superSecret") as api.AuthToken;
  } catch (error) {
    logger.debug(error);
    return undefined;
  }
};

const handlerBuilder = (
  config: api.Config,
  getServices: (logger: core.backend.Logger) => api.Services,
  handler:
    | AuthRequestHandler<any, any, any, any>
    | UnAuthRequestHandler<any, any, any, any>,
  authRequired: boolean
): Router.Middleware => async (ctx, next) => {
  const logger = new Logger(config.environment);
  const start = Date.now();
  logger.debug(`----> ${ctx.method} ${ctx.url}`);

  const services = getServices(logger);

  const decodedJWT = await getDecodedJWT(ctx, logger);

  let user: data.User | undefined = undefined;

  if (decodedJWT) {
    user = await services.data.user.get({ userId: decodedJWT.userId });
  }

  if (authRequired && !user) {
    addErrorToContext(ctx, notAuthorized());
  } else {
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

const getBuilder = <
  Handler extends
    | AuthRequestHandler<any, any, any, any>
    | UnAuthRequestHandler<any, any, any, any>
>(
  requiresAuth: boolean
) => (
  config: api.Config,
  getServices: (logger: core.backend.Logger) => api.Services
) => (handler: Handler) =>
  handlerBuilder(config, getServices, handler, requiresAuth);

export const authBuilder = getBuilder<AuthRequestHandler<any, any, any, any>>(
  true
);
export const noAuthBuilder = getBuilder<
  UnAuthRequestHandler<any, any, any, any>
>(false);
