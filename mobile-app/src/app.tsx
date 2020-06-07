import React from "react";
import { View } from "react-native";
import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import config from "./config";
import Api from "./api";
import { variables } from "./styles";
import Stores from "./stores";
import { storeContext } from "./context";
import Navigation from "./navigation/main";

const api = new Api(config, (e, url) => {
  console.log(e, url);
  throw e;
});

const state = new Stores(api);

const App = () => {
  return (
    <View style={{ flex: 1, backgroundColor: variables.colors.purpleLight }}>
      <SafeAreaProvider>
        <storeContext.Provider value={state}>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </storeContext.Provider>
      </SafeAreaProvider>
    </View>
  );
};

export default registerRootComponent(App);
