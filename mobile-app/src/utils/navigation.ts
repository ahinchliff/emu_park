import { StackParamList } from "../navigation/main";
import { NavigationProp } from "@react-navigation/native";

export const getNavigate = <ScreenName extends keyof StackParamList>(
  screenName: ScreenName,
  props: { navigation: NavigationProp<StackParamList> }
) => {
  return (params: StackParamList[ScreenName]) =>
    props.navigation.navigate(screenName as any, params);
};
