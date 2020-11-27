import * as React from "react";
import { Text, Pressable, View } from "react-native";
import { variables } from "../../styles";

export type Props = {
  onPress?(): void;
  disabled?: boolean;
  children:
    | React.ReactNode
    | ((state: { pressed: boolean }) => React.ReactNode);
};

const ListItem: React.FC<Props> = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => ({
        padding: 10,
        borderRadius: 10,
        backgroundColor: pressed
          ? variables.colors.black
          : variables.colors.yellowLight,
        marginBottom: 20,
      })}
      disabled={!props.onPress || props.disabled}
    >
      {({ pressed }) => {
        return (
          <React.Fragment>
            {typeof props.children === "function"
              ? (props.children as any)({ pressed })
              : props.children}
          </React.Fragment>
        );
      }}
    </Pressable>
  );
};

export default ListItem;
