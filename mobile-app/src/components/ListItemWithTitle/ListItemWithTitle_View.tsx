import * as React from "react";
import { Text, View } from "react-native";
import ListItem, { Props as ListItemProps } from "../ListItem/ListItem_View";
import { variables } from "../../styles";

type Props = {
  title: string;
} & ListItemProps;

const ListItemWithTitle: React.FC<Props> = (props) => {
  return (
    <ListItem {...props}>
      {({ pressed }) => {
        const color = pressed
          ? variables.colors.yellow
          : variables.colors.black;
        return (
          <React.Fragment>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", color }}>{props.title}</Text>
            </View>
            {typeof props.children === "function"
              ? (props.children as any)({ pressed })
              : props.children}
          </React.Fragment>
        );
      }}
    </ListItem>
  );
};

export default ListItemWithTitle;
