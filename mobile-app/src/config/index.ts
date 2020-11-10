import Constants from "expo-constants";

type ReleaseChannel = undefined | "staging" | "production";

const releaseChannel = Constants.manifest.releaseChannel as string | undefined;

const isEnvironment = (env: ReleaseChannel): boolean =>
  (releaseChannel || "").indexOf(env as string) === 0;

const devConfig: config.Config = {
  apiEndpoint: "http://localhost:3000/dev",
  authEndpoint: "",
  socketEndpoint: "wss://bi56oaf3tj.execute-api.eu-west-1.amazonaws.com/live",
};

const stagingConfig: config.Config = {
  apiEndpoint: "",
  authEndpoint: "",
  socketEndpoint: "",
};

const productionConfig: config.Config = {
  apiEndpoint: "",
  authEndpoint: "",
  socketEndpoint: "",
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
