import { AuthStackParamList } from "../navigation";
import { NavigationProp } from "@react-navigation/native";

export const getNavigate = <ScreenName extends keyof AuthStackParamList>(
  screenName: ScreenName,
  props: { navigation: NavigationProp<AuthStackParamList> }
) => {
  return (params: AuthStackParamList[ScreenName]) =>
    props.navigation.navigate(screenName as any, params);
};
