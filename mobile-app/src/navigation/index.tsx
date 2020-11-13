import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./screens/Landing/Landing_Logic";
import Home from "./screens/Home/Home_Logic";
import Game from "./screens/Game/Game_Logic";
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
  Home: undefined;
  Game: { gameId: number; dontFetchOnMount?: boolean };
};

const MainStack = createStackNavigator<MainStackParamList>();

const MainNavigation: React.FC = () => {
  return (
    <MainStack.Navigator headerMode="none">
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen name="Game" component={Game} />
    </MainStack.Navigator>
  );
};
