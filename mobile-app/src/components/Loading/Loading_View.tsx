import React from "react";
import { View, ActivityIndicator, ViewStyle } from "react-native";
import { variables } from "../../styles";

type Props = {
  style?: ViewStyle;
};

const LoadingView: React.FC<Props> = (props) => {
  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: variables.colors.primary,
        ...props.style,
      }}
    >
      <ActivityIndicator size="large" color={variables.colors.white} />
    </View>
  );
};

export default LoadingView;
