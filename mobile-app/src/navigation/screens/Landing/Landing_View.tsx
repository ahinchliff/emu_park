import * as React from "react";
import {
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { variables } from "../../../styles";
import {
  FingerGunSVG,
  HorizontalSpacer,
  Input,
  Button,
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
        backgroundColor: variables.colors.yellow,
        paddingHorizontal: variables.standardPadding.horizontal,
      }}
    >
      <KeyboardAvoidingView behavior="position">
        <Pressable onPressIn={Keyboard.dismiss}>
          <HorizontalSpacer height={40} />
          <View style={{ alignItems: "center" }}>
            <FingerGunSVG height={150} width={150} />
          </View>
          <HorizontalSpacer height={50} />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              textAlign: "center",
            }}
          >
            What do your mates call you?
          </Text>
          <HorizontalSpacer height={45} />
          <Input
            {...props.displayNameInputState}
            placeholder="nickname"
            autoCapitalize="none"
            editable={!props.loading || props.signupSuccessful}
          />
          <HorizontalSpacer height={20} />
          <Button
            onPress={onSignup}
            loading={props.loading}
            disabled={
              !props.canSignup || props.loading || props.signupSuccessful
            }
          >
            JOIN {String.fromCodePoint(0x1f389)}
          </Button>
        </Pressable>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default LandingScreenView;
