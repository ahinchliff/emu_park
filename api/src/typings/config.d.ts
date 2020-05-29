declare namespace api {
  type Config = Pick<
    core.config.Config,
    "env" | "aws" | "mysql" | "auth" | "bucketNames" | "websockets"
  >;
}
