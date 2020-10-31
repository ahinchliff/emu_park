declare namespace core.backend.config {
  type Config = {
    environment: "test" | "development" | "staging" | "production";
    aws: {
      accountId: string;
      region: string;
    };
    mysql: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      connectionLimit: number;
    };
    jwt: {
      secret: string;
    };
    // auth: {
    //   jwtIssuer: string;
    //   jwksPath: string;
    // };
    // bucketNames: {
    //   profilePictures: string;
    // };
    // websockets: {
    //   dynamoTableName: string;
    //   endpoint: string;
    // };
  };

  type NonSensitiveConfigKey =
    | "environment"
    | "region"
    | "mysql_host"
    | "mysql_port"
    | "mysql_application_user_username"
    | "mysql_database_name"
    | "jwt_issuer"
    | "profile_pictures_s3_bucket_domain"
    | "web_sockets_dynamo_table_name"
    | "web_sockets_endpoint";

  type SensitiveConfigKey = "mysql_application_user_password" | "jwt_secret";

  type ConfigKey = SensitiveConfigKey | NonSensitiveConfigKey;

  interface IConfigService {
    get(sensitiveConfigKeys: SensitiveConfigKey[]): Promise<Config>;
  }
}
