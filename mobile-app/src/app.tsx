import React, { useState } from "react";
import { View, AppState, AppStateStatus } from "react-native";
import { registerRootComponent, AppLoading } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "react-native-elements";
import { Api, Sockets } from "./clients";
import Navigation from "./navigation";
import Stores from "./stores";
import { storeContext } from "./context";
import { variables } from "./styles";
import config from "./config";
import { UnhandledErrorModal } from "./components";

const api = new Api(config, (e, url) => {
  console.log(e, url);
  throw e;
});

const sockets = new Sockets(config);

const state = new Stores(api, sockets);

const App: React.FC = () => {
  const [appInitialising, setAppInitialising] = useState(true);

  const initApp = async () => {
    initReactToAppStateChange();
    await initAuth();
    if (state.authStore.me) {
      state.authStore.subscribeToUserEvents();
    }
  };

  if (appInitialising) {
    return (
      <AppLoading
        startAsync={initApp}
        onFinish={() => setAppInitialising(false)}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: variables.colors.primary }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <storeContext.Provider value={state}>
            <NavigationContainer>
              <Navigation />
              <UnhandledErrorModal />
            </NavigationContainer>
          </storeContext.Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    </View>
  );
};

const initReactToAppStateChange = () => {
  let appState: AppStateStatus = "active";

  AppState.addEventListener("change", async (nextAppState: AppStateStatus) => {
    if (
      appState === "active" &&
      (nextAppState === "background" || nextAppState === "inactive")
    ) {
      console.log("app.tsx - App paused.");
      state.authStore.stopAuthTokenExpiryCheck();
      sockets.disconnect();
    }

    if (
      (appState === "background" || appState === "inactive") &&
      nextAppState === "active"
    ) {
      console.log("app.tsx - App resumed");
      await initAuth();
      sockets.reconnect();
    }
    appState = nextAppState;
  });
};

const initAuth = () =>
  new Promise(async (resolve) => {
    await state.authStore.initAuth();
    // we want the loading screen to display for an extra half second
    // so that the auth state has time to propagate
    setTimeout(() => resolve(), 500);
  });

export default registerRootComponent(App);
