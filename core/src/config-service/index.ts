import * as AWS from "aws-sdk";

export default class ConfigService implements core.config.IConfigService {
  private ssm: AWS.SSM;
  constructor(private logger: core.Logger, defaultRegion?: "eu-west-1") {
    if (defaultRegion) {
      AWS.config.update({ region: "eu-west-1" });
    }
    this.ssm = new AWS.SSM();
  }

  public get = async <T>(
    sensitiveConfigKeys: core.config.SensitiveConfigKey[]
  ) => {
    const nonSensitiveKeys: core.config.NonSensitiveConfigKey[] = [
      "env",
      "mysql_host",
      "mysql_port",
      "mysql_application_user_username",
      "mysql_database_name",
      "jwt_issuer",
      "profile_pictures_s3_bucket_domain",
      "web_sockets_dynamo_table_name",
      "web_sockets_endpoint",
    ];
    const allKeys: core.config.ConfigKey[] = [
      ...sensitiveConfigKeys,
      ...nonSensitiveKeys,
    ];
    this.logger.debug("Fetching config params");
    const paramsResult = await this.ssm
      .getParameters({
        Names: allKeys,
        WithDecryption: true,
      })
      .promise();

    const parameters = paramsResult.Parameters || [];

    const fetchedParams = allKeys.reduce(
      (builder: {}, key: core.config.ConfigKey) => {
        const param = parameters.find((p) => p.Name === key);
        if (!param) {
          const error = new Error(
            `'${key}' could not be retrieved from Param Store`
          );
          this.logger.error(`Failed to fetch config`, error);
          throw error;
        }

        return {
          ...builder,
          [key]: param.Value,
        };
      },
      {}
    ) as { [key in core.config.ConfigKey]: any };

    const config: core.config.Config = {
      env: fetchedParams.env,
      auth: {
        jwtIssuer: fetchedParams.jwt_issuer,
        jwksPath: "/.well-known/jwks.json",
      },
      aws: {
        region: fetchedParams.region,
        accountId: "todo",
      },
      mysql: {
        host: fetchedParams.mysql_host,
        port: Number(fetchedParams.mysql_port),
        user: fetchedParams.mysql_application_user_username,
        password: fetchedParams.mysql_application_user_password,
        database: fetchedParams.mysql_database_name,
        connectionLimit: 1,
      },
      bucketNames: {
        profilePictures: this.getBucketNameFromDomain(
          fetchedParams.profile_pictures_s3_bucket_domain
        ),
      },
      websockets: {
        dynamoTableName: fetchedParams.web_sockets_dynamo_table_name,
        endpoint: this.getWebsocketHttpInvokeEndpointFromWSSDomain(
          fetchedParams.web_sockets_endpoint
        ),
      },
    };

    this.logger.debug("Successfully fetched config");
    return (config as unknown) as T;
  };

  private getBucketNameFromDomain = (domain: string) => {
    return domain.split(".")[0];
  };

  private getWebsocketHttpInvokeEndpointFromWSSDomain = (wssDomain: string) => {
    const parts = wssDomain.split(":");
    return `https:${parts[1]}`;
  };
}
