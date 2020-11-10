import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { variables } from "../../styles";
import { View, ViewStyle } from "react-native";
import HorizontalSpacer from "../HorizontalSpacer";
import Loading from "../Loading";

type Props = {
  removeTopSafeArea?: boolean;
  removeBottomSafeArea?: boolean;
  style?: ViewStyle;
  loading?: boolean;
};

const ScreenWrapper_View: React.FC<Props> = (props) => {
  const insets = useSafeAreaInsets();

  const style = {
    backgroundColor: variables.colors.primary,
    height: variables.screen.height,
    ...props.style,
  };

  return (
    <View style={style}>
      <HorizontalSpacer height={props.removeTopSafeArea ? 0 : insets.top} />
      {props.loading ? <Loading /> : props.children}
      <HorizontalSpacer
        height={props.removeBottomSafeArea ? 0 : insets.bottom}
      />
    </View>
  );
};

export default ScreenWrapper_View;
