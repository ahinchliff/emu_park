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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: variables.colors.yellow,
        ...props.style,
      }}
    >
      <ActivityIndicator size="small" color={variables.colors.black} />
    </View>
  );
};

export default LoadingView;
