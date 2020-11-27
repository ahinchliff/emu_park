import * as React from "react";
import { View } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { variables } from "../../styles";
import { Row } from "../Row";

const MissionState: React.FC<{
  missionState: api.MissionState;
  started: boolean;
  pressed: boolean;
}> = (props) => {
  const { missionState, started } = props;
  const CompletedIcon = () => <Entypo name="check" size={18} color="#6ab04c" />;
  const PendingIcon = () => (
    <View
      style={{
        width: 10,
        height: 10,
        borderWidth: 1,
        borderColor: props.pressed
          ? variables.colors.yellow
          : variables.colors.black,
        marginHorizontal: 3,
      }}
    />
  );

  const FailedIcon = () => (
    <Ionicons
      name="md-close"
      size={18}
      color="#eb4d4b"
      style={{
        paddingHorizontal: 3,
      }}
    />
  );

  return (
    <Row
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {!started && [...Array(5).keys()].map((_, i) => <PendingIcon key={i} />)}
      {[...Array(missionState.completed).keys()].map((_, i) => (
        <CompletedIcon key={i} />
      ))}
      {[...Array(missionState.pending).keys()].map((_, i) => (
        <PendingIcon key={i} />
      ))}
      {[...Array(missionState.failed).keys()].map((_, i) => (
        <FailedIcon key={i} />
      ))}
    </Row>
  );
};

export default MissionState;
