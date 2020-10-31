declare namespace api {
  type Config = Pick<
    core.backend.config.Config,
    "environment" | "aws" | "mysql" | "jwt"
  >;
}

// "environment" | "aws" | "mysql" | "auth" | "bucketNames" | "websockets"
