import { RouteProp, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList, MainStackParamList } from "../navigation";

export type AuthStackScreenProps<
  ScreenName extends keyof AuthStackParamList
> = {
  route: RouteProp<AuthStackParamList, ScreenName>;
  navigation: NavigationProp<AuthStackParamList, ScreenName>;
};

export type MainStackScreenProps<
  ScreenName extends keyof MainStackParamList
> = {
  route: RouteProp<MainStackParamList, ScreenName>;
  navigation: NavigationProp<MainStackParamList, ScreenName>;
};
