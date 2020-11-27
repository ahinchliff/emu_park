import * as React from "react";
import { Text } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Row } from "../Row";

type Props = {
  icon: "player" | "status";
  details: string | number;
  color: string;
};

const IconDetails: React.FC<Props> = (props) => {
  const iconMap: { [key in Props["icon"]]: React.ReactNode } = {
    player: (
      <FontAwesome
        name="user"
        size={16}
        color={props.color}
        style={{ paddingRight: 5 }}
      />
    ),
    status: (
      <MaterialCommunityIcons
        name="clock"
        size={16}
        color={props.color}
        style={{ paddingRight: 5 }}
      />
    ),
  };
  return (
    <Row style={{ alignItems: "center", paddingRight: 10 }}>
      {iconMap[props.icon]}
      <Text style={{ fontSize: 12, color: props.color }}>{props.details}</Text>
    </Row>
  );
};

export default IconDetails;
