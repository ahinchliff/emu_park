import { ActivityIndicator, Pressable, Text } from "react-native";
import React from "react";
import { variables } from "../../styles";

type Props = {
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  onPress(): void;
};

const ButtonView: React.FC<Props> = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled || props.loading}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? variables.colors.yellowLight
            : variables.colors.black,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
        },
      ]}
    >
      {({ pressed }) => (
        <>
          {props.loading ? (
            <ActivityIndicator color={variables.colors.yellow} size="small" />
          ) : (
            <Text
              style={{
                fontSize: 18,
                color: pressed
                  ? variables.colors.black
                  : variables.colors.yellow,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {props.children}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

export default ButtonView;
