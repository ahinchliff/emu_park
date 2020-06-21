import Constants from "expo-constants";

type ReleaseChannel = undefined | "staging" | "production";

const releaseChannel = Constants.manifest.releaseChannel as string | undefined;

const isEnvironment = (env: ReleaseChannel): boolean =>
  (releaseChannel || "").indexOf(env as string) === 0;

const devConfig: config.Config = {
  apiEndpoint: "http://192.168.0.23:3001",
  authEndpoint: "",
};

const stagingConfig: config.Config = {
  apiEndpoint: "",
  authEndpoint: "",
};

const productionConfig: config.Config = {
  apiEndpoint: "",
  authEndpoint: "",
};

const getChannelConfig = () => {
  if (isEnvironment("staging")) {
    stagingConfig;
  }

  if (isEnvironment("production")) {
    return productionConfig;
  }

  return devConfig;
};

const config: config.Config = {
  ...getChannelConfig(),
};

export default config;
