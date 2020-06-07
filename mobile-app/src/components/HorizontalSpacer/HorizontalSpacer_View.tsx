import React from "react";
import { View } from "react-native";

type Props = {
  height: number;
};

const HorizontalSpacerView: React.FC<Props> = (props) => {
  return <View style={{ height: props.height, width: "100%" }} />;
};

export default HorizontalSpacerView;
