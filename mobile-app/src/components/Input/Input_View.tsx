import React from "react";
import { Input, IconProps, InputProps } from "react-native-elements";

export type Props = {
  icon: IconProps["name"];
  value: string;
  onChangeText: InputProps["onChangeText"];
  placeholder?: InputProps["placeholder"];
  autoCapitalize?: InputProps["autoCapitalize"];
  secureTextEntry?: InputProps["secureTextEntry"];
};

const InputView: React.FC<Props> = (props) => (
  <Input
    {...props}
    inputContainerStyle={{ borderBottomWidth: 0 }}
    containerStyle={{ margin: 0 }}
    leftIconContainerStyle={{
      paddingRight: 10,
    }}
    leftIcon={{
      type: "font-awesome",
      name: props.icon,
      color: "#A5A6A7",
      size: props.icon === "envelope" ? 20 : undefined,
    }}
    errorStyle={{ height: 0 }}
  />
);

export default InputView;
