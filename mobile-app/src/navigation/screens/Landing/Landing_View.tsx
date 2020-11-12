import * as React from "react";
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { variables } from "../../../styles";
import {
  HorizontalSpacer,
  Input,
  MainText,
  ScreenWrapper,
} from "../../../components";
import { InputProps } from "../../../hooks/useInputState";

type Props = {
  displayNameInputState: InputProps<string>;
  loading: boolean;
  signupSuccessful: boolean;
  canSignup: boolean;
  onSignup(): Promise<void>;
};

const LandingScreenView: React.FC<Props> = (props) => {
  const onSignup = () => {
    Keyboard.dismiss();
    props.onSignup();
  };

  return (
    <ScreenWrapper
      style={{
        backgroundColor: variables.colors.primary,
        paddingHorizontal: 30,
      }}
    >
      <KeyboardAvoidingView behavior="position">
        <Pressable onPressIn={Keyboard.dismiss}>
          <HorizontalSpacer height={40} />
          <MainText style={{ fontSize: 80, textAlign: "center" }}>
            Gotcha!
          </MainText>
          <HorizontalSpacer height={30} />
          <MainText style={{ fontSize: 30, textAlign: "center" }}>
            What do your mates call you?
          </MainText>
          <HorizontalSpacer height={45} />
          <Input
            {...props.displayNameInputState}
            placeholder="nickname"
            autoCapitalize="none"
            editable={!props.loading || props.signupSuccessful}
          />
          <HorizontalSpacer height={40} />
          <View style={{ alignItems: "center" }}>
            <Pressable
              onPressIn={onSignup}
              disabled={
                !props.canSignup || props.loading || props.signupSuccessful
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "black" : "#f0932b",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 110,
                  width: 110,
                  borderRadius: 55,
                  shadowColor: "#000",
                  opacity: 0.7,
                },
                props.canSignup && {
                  opacity: 1,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                },
              ]}
            >
              {props.loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Entypo
                  name={props.signupSuccessful ? "check" : "arrow-right"}
                  size={50}
                  color="white"
                />
              )}
            </Pressable>
            <HorizontalSpacer height={20} />
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default LandingScreenView;
