import { RouteProp, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation";

export type ScreenProps<ScreenName extends keyof AuthStackParamList> = {
  route: RouteProp<AuthStackParamList, ScreenName>;
  navigation: NavigationProp<AuthStackParamList, ScreenName>;
};
