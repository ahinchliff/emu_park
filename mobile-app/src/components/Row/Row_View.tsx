import * as React from "react";
import { View, ViewProps } from "react-native";

const Row: React.FC<ViewProps> = (props) => {
  const { children, style, ...rest } = props;
  return (
    <View
      style={[
        {
          flexDirection: "row",
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Row;
