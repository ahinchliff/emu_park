import Constants from "expo-constants";

type ReleaseChannel = undefined | "staging" | "production";

const releaseChannel = Constants.manifest.releaseChannel as string | undefined;

const isEnvironment = (env: ReleaseChannel): boolean =>
  (releaseChannel || "").indexOf(env as string) === 0;

const devConfig: config.Config = {
  apiEndpoint:
    "https://fcau42vxcc.execute-api.ap-southeast-2.amazonaws.com/development",
  authEndpoint: "",
  socketEndpoint:
    "wss://h08zh2mkk8.execute-api.ap-southeast-2.amazonaws.com/development",
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
