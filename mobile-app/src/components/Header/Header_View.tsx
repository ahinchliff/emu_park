import * as React from "react";
import { View } from "react-native";
import { TextButton } from "../TextButton";
import { FingerGunSVG } from "../FingerGunSVG";

type Button = {
  text: string;
  onPress(): void;
};

const Header: React.FC<{
  hideIcon?: boolean;
  leftButton?: Button;
  rightButton?: Button;
  rightComponent?: React.ReactNode;
}> = (props) => {
  return (
    <View
      style={{
        paddingBottom: 20,
        backgroundColor: "#FFB700",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 60,
      }}
    >
      {props.leftButton ? (
        <TextButton
          onPress={props.leftButton.onPress}
          containerStyle={{ justifyContent: "flex-end", zIndex: 2 }}
          text={props.leftButton.text}
        />
      ) : (
        <View />
      )}
      {!props.hideIcon && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            alignItems: "center",
          }}
        >
          <FingerGunSVG width={50} height={50} />
        </View>
      )}
      {props.rightButton ? (
        <TextButton
          onPress={props.rightButton.onPress}
          containerStyle={{ justifyContent: "flex-end", zIndex: 2 }}
          text={props.rightButton.text}
        />
      ) : props.rightComponent ? (
        props.rightComponent
      ) : (
        <View />
      )}
    </View>
  );
};

export default Header;
