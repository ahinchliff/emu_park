declare namespace api {
  type Config = Pick<
    core.backend.config.Config,
    "env" | "aws" | "mysql" | "auth" | "bucketNames" | "websockets"
  >;
}
