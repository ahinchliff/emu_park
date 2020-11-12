import React from "react";
import { Text, TextProps } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: TextProps["style"];
  removeShadow?: boolean;
};

const MainText: React.FC<Props> = (props) => {
  return (
    <Text
      style={[
        {
          fontFamily: "FredokaOne_400Regular",
          color: "white",

          ...(props.style as any),
        },
        !props.removeShadow && {
          textShadowColor: "rgba(0, 0, 0, 0.75)",
          textShadowOffset: { width: -1, height: 1 },
          textShadowRadius: 5,
        },
      ]}
    >
      {props.children}
    </Text>
  );
};

export default MainText;
