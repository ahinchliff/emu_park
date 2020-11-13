import React, { ReactNode, useRef, useEffect } from "react";
import {
  Animated,
  Pressable,
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { variables } from "../../styles";
import MainText from "../MainText";

export type Props = {
  show: boolean;
  children: ReactNode;
  title?: string;
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
    <BlurView intensity={70} style={[StyleSheet.absoluteFill]}>
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
          }}
        >
          <View
            style={{
              backgroundColor: variables.colors.white,
              borderRadius: 10,
              width: "80%",
              shadowColor: "#000",
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.5,
              shadowRadius: 3.84,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, paddingTop: 30, paddingLeft: 30 }}>
                {props.title && (
                  <MainText
                    removeShadow={true}
                    style={{ fontSize: 28, color: variables.colors.black }}
                  >
                    {props.title}
                  </MainText>
                )}
              </View>
              <View style={{ paddingRight: 15, paddingTop: 10 }}>
                <Pressable
                  onPressIn={onClose}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "black" : "#f0932b",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 50,
                      width: 50,
                      borderRadius: 55,
                      shadowColor: "#000",
                    },
                  ]}
                >
                  <FontAwesome name="times" size={24} color="white" />
                </Pressable>
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
