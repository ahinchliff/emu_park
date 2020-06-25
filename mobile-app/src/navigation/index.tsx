import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import Landing from "./screens/Landing/Landing_Logic";
import { observer } from "mobx-react-lite";
import useStores from "../hooks/useStores";

const Navigation: React.FC = () => {
  const { authStore } = useStores();
  if (authStore.me) {
    return <MainNavigation />;
  }
  return <AuthNavigation />;
};

export default observer(Navigation);

export type AuthStackParamList = {
  Landing: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigation: React.FC = () => {
  return (
    <AuthStack.Navigator headerMode="none">
      <AuthStack.Screen name="Landing" component={Landing} />
    </AuthStack.Navigator>
  );
};

export type MainStackParamList = {
  Landing: undefined;
};

const MainStack = createStackNavigator<AuthStackParamList>();

const MainNavigation: React.FC = () => {
  const tesst = () => <Text>Hello</Text>;
  return (
    <MainStack.Navigator headerMode="none">
      <MainStack.Screen name="Landing" component={tesst} />
    </MainStack.Navigator>
  );
};
