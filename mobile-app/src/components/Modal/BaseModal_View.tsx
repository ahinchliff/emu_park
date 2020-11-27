import React, { ReactNode, useRef, useEffect } from "react";
import { Animated, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { BlurView } from "expo-blur";
import { variables } from "../../styles";
import { TextButton } from "../TextButton";

export type Props = {
  show: boolean;
  children: ReactNode;
  onClose?(): void;
};

const Modal: React.FC<Props> = (props) => {
  const yPosition = useRef(new Animated.Value(variables.screen.height)).current;

  const onClose = () => {
    Animated.timing(yPosition, {
      toValue: variables.screen.height,
      duration: 500,
      useNativeDriver: false,
    }).start(props.onClose);
  };

  useEffect(() => {
    Animated.timing(yPosition, {
      toValue: props.show ? 0 : variables.screen.height,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [props.show]);

  if (!props.show) {
    return null;
  }

  return (
    <BlurView intensity={90} tint="dark" style={[StyleSheet.absoluteFill]}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Animated.View
          style={{
            position: "absolute",
            top: yPosition,
            zIndex: 2,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 1,
              height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
          }}
        >
          <View
            style={{
              borderRadius: 10,
              backgroundColor: variables.colors.yellow,
              width: "80%",
              borderColor: variables.colors.black,
              borderWidth: 2,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, paddingTop: 30, paddingLeft: 30 }}></View>
              <View style={{ paddingRight: 15, paddingTop: 10 }}>
                <TextButton onPress={onClose} text="CLOSE" />
              </View>
            </View>
            <View style={{ padding: 30 }}>{props.children}</View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </BlurView>
  );
};

export default Modal;
