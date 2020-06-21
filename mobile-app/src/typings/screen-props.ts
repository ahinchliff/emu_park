import { RouteProp, NavigationProp } from "@react-navigation/native";
import { StackParamList } from "../navigation/main";

export type ScreenProps<ScreenName extends keyof StackParamList> = {
  route: RouteProp<StackParamList, ScreenName>;
  navigation: NavigationProp<StackParamList, ScreenName>;
};
