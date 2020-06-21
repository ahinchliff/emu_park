import React, { useEffect, useRef, useCallback } from "react";
import { Button as ButtonNative, Divider, Icon } from "react-native-elements";
import ViewPager from "@react-native-community/viewpager";
import {
  ScreenWrapper,
  HorizontalSpacer,
  Input,
  Button,
  EmailInput,
  PasswordInput,
  MessageModal,
} from "../../../components";
import { InputProps } from "../../../hooks/useInputState";
import { View, Text, ScrollView } from "react-native";
import {
  ResetPasswordError,
  LoginError,
  SignupError,
  ConfirmEmailError,
} from "mobile-app/src/typings/auth-client";
import { HandledErrorState } from "mobile-app/src/hooks/useHandledErrorState";

export type Screen =
  | "login"
  | "signup"
  | "confirm-email"
  | "request-password-code"
  | "set-password";

type Props = {
  activeScreen: Screen;
  loadingMajorAuthAction: boolean;
  loadingMinorAuthAction: boolean;
  emailInputProps: InputProps<string>;
  passwordInputProps: InputProps<string>;
  emailValidationCodeInputProps: InputProps<string>;
  passwordResertCodeInputProps: InputProps<string>;
  newPasswordInputProps: InputProps<string>;
  resetPasswordErrorState: HandledErrorState<ResetPasswordError>;
  loginErrorState: HandledErrorState<LoginError>;
  signupErrorState: HandledErrorState<SignupError>;
  confirmEmailErrorState: HandledErrorState<ConfirmEmailError>;
  goToScreen(screen: Screen): void;
  onSignup(): Promise<void>;
  onConfirmEmail(): Promise<void>;
  onLogin(): Promise<void>;
  onResendConfirmationEmail(): Promise<void>;
  onRequestPasswordResetCode(): Promise<void>;
  onResetPassword(): Promise<void>;
};

const LandingScreenView: React.FC<Props> = (props) => {
  const inputEl = useRef<ViewPager>(null);
  useEffect(() => {
    scrollToScreen();
  }, []);

  useEffect(() => {
    scrollToScreen();
  }, [props.activeScreen]);

  const scrollToScreen = useCallback(() => {
    const screenMap: { [key in Screen]: true } = {
      "set-password": true,
      "request-password-code": true,
      login: true,
      signup: true,
      "confirm-email": true,
    };
    if (inputEl.current) {
      inputEl.current.setPage(
        Object.keys(screenMap).indexOf(props.activeScreen)
      );
    }
  }, [props.activeScreen]);

  return (
    <ScreenWrapper>
      <ViewPager style={{ flex: 1 }} ref={inputEl} scrollEnabled={false}>
        <SetPassword {...props} />
        <RequestPasswordCode {...props} />
        <Login {...props} />
        <Signup {...props} />
        <ValidateEmail {...props} />
      </ViewPager>
      <LoginErrorModal {...props} />
      <SignupErrorModal {...props} />
      <ConfirmEmailErrorModal {...props} />
      <ResetPasswordErrorModal {...props} />
    </ScreenWrapper>
  );
};

const Login: React.FC<Props> = (props) => {
  return (
    <Slide title="Login">
      <FormWrapper>
        <EmailInput {...props.emailInputProps} />
        <Divider style={{ marginBottom: 15 }} />
        <PasswordInput {...props.passwordInputProps} />
      </FormWrapper>
      <HorizontalSpacer height={30} />
      <Button
        title="Go"
        loading={props.loadingMajorAuthAction}
        onPress={props.onLogin}
        icon="arrow-right"
      />
      <HorizontalSpacer height={20} />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 5,
        }}
      >
        <ButtonNative
          title="Reset password"
          onPress={() => props.goToScreen("request-password-code")}
          type="clear"
        />
        <ButtonNative
          title="Signup"
          onPress={() => props.goToScreen("signup")}
          type="clear"
        />
      </View>
    </Slide>
  );
};

const Signup: React.FC<Props> = (props) => {
  return (
    <Slide title="Signup" onGoBack={() => props.goToScreen("login")}>
      <FormWrapper>
        <EmailInput {...props.emailInputProps} />
        <Divider style={{ marginBottom: 15 }} />
        <PasswordInput {...props.passwordInputProps} />
      </FormWrapper>
      <HorizontalSpacer height={30} />
      <Button
        title="Next"
        loading={props.loadingMajorAuthAction}
        onPress={props.onSignup}
        icon="arrow-right"
      />
    </Slide>
  );
};

const ValidateEmail: React.FC<Props> = (props) => {
  return (
    <Slide title="Confirm email" onGoBack={() => props.goToScreen("signup")}>
      <Text style={{ textAlign: "center", fontSize: 12 }}>
        A confirmation email has been sent to {props.emailInputProps.value}.
        Enter the code below.
      </Text>
      <HorizontalSpacer height={20} />
      <FormWrapper>
        <Input
          {...props.emailValidationCodeInputProps}
          placeholder="Code"
          icon="check"
        />
      </FormWrapper>
      <HorizontalSpacer height={30} />
      <Button
        title="Confirm"
        loading={props.loadingMajorAuthAction}
        onPress={props.onConfirmEmail}
        icon="arrow-right"
      />
      <HorizontalSpacer height={30} />
      <ButtonNative
        title="Resend email"
        onPress={props.onResendConfirmationEmail}
        type="clear"
        loading={props.loadingMinorAuthAction}
      />
    </Slide>
  );
};

const RequestPasswordCode: React.FC<Props> = (props) => {
  return (
    <Slide
      title="Reset password"
      onGoBack={() => props.goToScreen("login")}
      goBackRight={true}
    >
      <FormWrapper>
        <EmailInput {...props.emailInputProps} />
      </FormWrapper>
      <HorizontalSpacer height={30} />
      <Button
        title="Request"
        loading={props.loadingMajorAuthAction}
        onPress={props.onRequestPasswordResetCode}
      />
      <HorizontalSpacer height={30} />
    </Slide>
  );
};

const SetPassword: React.FC<Props> = (props) => {
  return (
    <Slide
      title="New password"
      onGoBack={() => props.goToScreen("login")}
      goBackRight={true}
    >
      <FormWrapper>
        <Input
          {...props.passwordResertCodeInputProps}
          placeholder="Code"
          icon="check"
        />
        <Divider style={{ marginBottom: 15 }} />
        <PasswordInput
          {...props.newPasswordInputProps}
          placeholder="New password"
        />
      </FormWrapper>
      <HorizontalSpacer height={30} />
      <Button
        title="Confirm"
        loading={props.loadingMajorAuthAction}
        onPress={props.onResetPassword}
        icon="arrow-right"
      />
    </Slide>
  );
};

type SlideProps = {
  title: string;
  onGoBack?(): void;
  goBackRight?: true;
};

const Slide: React.FC<SlideProps> = (props) => {
  const goBackButton = (
    <Icon
      name={props.goBackRight ? "arrow-right" : "arrow-left"}
      type="font-awesome"
      color="#2089dc"
      onPress={props.onGoBack}
    />
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ alignItems: "center", paddingHorizontal: "5%" }}
      scrollEnabled={false}
    >
      <HorizontalSpacer height={50} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 5,
        }}
      >
        {props.onGoBack && !props.goBackRight ? goBackButton : <View />}
        <Text
          style={{
            color: "#3D4149",
            fontSize: 30,
            fontWeight: "500",
          }}
        >
          {props.title}
        </Text>
        {props.onGoBack && props.goBackRight ? goBackButton : <View />}
      </View>
      <HorizontalSpacer height={25} />
      {props.children}
    </ScrollView>
  );
};

const FormWrapper: React.FC = (props) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        width: "100%",
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      {props.children}
    </View>
  );
};

const LoginErrorModal = (props: Props) => {
  return (
    <MessageModal
      isShown={!!props.loginErrorState.error}
      onClose={props.loginErrorState.clear}
      title="Account not found"
      message="The email and password combination you provided could not be validated. Please try again, reset your password or signup."
    />
  );
};

const SignupErrorModal = (props: Props) => {
  const { signupErrorState } = props;
  if (!signupErrorState.error) {
    return null;
  }

  let title: string = "";
  let message: string = "";

  if (signupErrorState.error.code === "username-taken") {
    title = "Email in use";
    message =
      "An account with that email address already exists. Please reset your password.";
  }

  if (signupErrorState.error.code === "invalid-password") {
    title = "Invalid Password";
    message =
      "For security we require that your passwords contains at least one number and one special character.";
  }

  return (
    <MessageModal
      isShown={true}
      onClose={signupErrorState.clear}
      title={title}
      message={message}
    />
  );
};

const ConfirmEmailErrorModal = (props: Props) => {
  const { confirmEmailErrorState } = props;
  if (!confirmEmailErrorState.error) {
    return null;
  }

  let title: string = "";
  let message: string = "";

  if (confirmEmailErrorState.error.code === "code-invalid") {
    title = "Invalid code";
    message =
      "The code you entered doesn't match our records. Please check your emails or request a new code.";
  }

  return (
    <MessageModal
      isShown={true}
      onClose={confirmEmailErrorState.clear}
      title={title}
      message={message}
    />
  );
};

const ResetPasswordErrorModal = (props: Props) => {
  const { resetPasswordErrorState } = props;
  if (!resetPasswordErrorState.error) {
    return null;
  }

  let title: string = "";
  let message: string = "";

  if (resetPasswordErrorState.error.code === "code-invalid") {
    title = "Invalid code";
    message =
      "The code you entered doesn't match our records. Please check your emails or request a new code.";
  }

  if (resetPasswordErrorState.error.code === "code-expired") {
    title = "Code expired";
    message = "The code you entered has expired. Please request a new code.";
  }

  if (resetPasswordErrorState.error.code === "password-invalid") {
    title = "Invalid password";
    message =
      "For security we require that your passwords contains at least one number and one special character.";
  }

  if (resetPasswordErrorState.error.code === "reached-max-attempts") {
    title = "Too many attempts";
    message = "Please try again later";
  }

  return (
    <MessageModal
      isShown={true}
      onClose={resetPasswordErrorState.clear}
      title={title}
      message={message}
    />
  );
};

export default LandingScreenView;
