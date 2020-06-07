import Constants from "expo-constants";

type ReleaseChannel = undefined | "staging" | "production";

const releaseChannel = Constants.manifest.releaseChannel as string | undefined;

const isEnvironment = (env: ReleaseChannel): boolean =>
  (releaseChannel || "").indexOf(env as string) === 0;

const getChannelConfig = () => {
  if (isEnvironment("staging")) {
    return {
      apiEndpoint: "",
    };
  }

  if (isEnvironment("production")) {
    return {
      apiEndpoint: "",
    };
  }

  return {
    apiEndpoint: "http://api-staging.joinbubble.co.uk",
  };
};

const config: config.Config = {
  ...getChannelConfig(),
};

export default config;
