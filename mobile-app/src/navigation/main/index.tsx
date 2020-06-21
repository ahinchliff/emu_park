import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "../screens/Landing/Landing_Logic";
export type StackParamList = {
  Landing: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Landing" component={Landing} />
  </Stack.Navigator>
);
