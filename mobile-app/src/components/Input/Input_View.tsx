import React from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { variables } from "../../styles";

export type Props = TextInputProps;

const InputView: React.FC<Props> = (props) => (
  <View
    style={{
      borderBottomWidth: 4,
      borderBottomColor: variables.colors.black,
      paddingBottom: 5,
    }}
  >
    <TextInput
      {...props}
      style={{
        color: variables.colors.black,
        fontSize: 30,
        fontFamily: "FredokaOne_400Regular",
      }}
    />
  </View>
);

export default InputView;
