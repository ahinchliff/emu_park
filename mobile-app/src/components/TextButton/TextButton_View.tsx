import { ViewProps, TextProps } from "react-native";
import * as React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  text: string;
  onPress(): void;
  containerStyle?: ViewProps["style"];
  style?: TextProps["style"];
};

const TextButton: React.FC<Props> = (props) => (
  <Pressable
    onPress={props.onPress}
    style={[props.containerStyle]}
    hitSlop={10}
  >
    <Text style={[{ fontWeight: "900", fontSize: 14 }, props.style]}>
      {props.text}
    </Text>
  </Pressable>
);

export default TextButton;
