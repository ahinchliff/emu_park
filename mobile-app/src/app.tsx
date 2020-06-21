import React from "react";
import { View } from "react-native";
import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "react-native-elements";
import Api from "./api";
import Navigation from "./navigation/main";
import Stores from "./stores";
import { storeContext } from "./context";
import { variables } from "./styles";
import config from "./config";
import { UnhandledErrorModal } from "./components";

const api = new Api(config, (e, url) => {
  console.log(e, url);
  throw e;
});

const state = new Stores(api);

const App = () => {
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

export default registerRootComponent(App);
