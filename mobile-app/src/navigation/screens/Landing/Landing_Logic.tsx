import React, { useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { ScreenProps } from "../../../typings/screen-props";
import LandingScrenView, { Screen } from "./Landing_View";
import { useFormInput } from "../../../hooks/useInputState";
import useStores from "../../../hooks/useStores";
import {
  ResetPasswordError,
  LoginError,
  SignupError,
  ConfirmEmailError,
} from "../../../clients/typings/auth-client";
import { useHandledErrorState } from "../../../hooks/useHandledErrorState";

type Props = ScreenProps<"Landing">;

const LandingScreen: React.FC<Props> = () => {
  const { authStore, uiStore } = useStores();
  const [activeScreen, setActiveScreen] = useState<Screen>("login");
  const [loadingMajorAuthAction, setLoadingMajorAuthAction] = useState(false); // login, signup
  const [loadingMinorAuthAction, setLoadingMinorAuthAction] = useState(false); // request emails

  const emailInputProps = useFormInput("anthony.hinchliff@gmail.com");
  const passwordInputProps = useFormInput("Password123!");
  const emailValidationCodeInputProps = useFormInput("");
  const passwordResetCodeInputProps = useFormInput("");
  const newPasswordInputProps = useFormInput("");

  const loginErrorState = useHandledErrorState<LoginError>();
  const resetPasswordErrorState = useHandledErrorState<ResetPasswordError>();
  const signupErrorState = useHandledErrorState<SignupError>();
  const confirmEmailErrorState = useHandledErrorState<ConfirmEmailError>();

  const onSignup = useCallback(async () => {
    setLoadingMajorAuthAction(true);
    try {
      await authStore.signup(emailInputProps.value, passwordInputProps.value);
      setActiveScreen("confirm-email");
    } catch (err) {
      const error = err as SignupError;
      if (
        error.code === "invalid-password" ||
        error.code === "username-taken"
      ) {
        signupErrorState.set(err);
      } else {
        uiStore.setUnhandledError(err);
      }
    }
    setLoadingMajorAuthAction(false);
  }, [emailInputProps.value, emailInputProps.value]);

  const onConfirmEmail = useCallback(async () => {
    setLoadingMajorAuthAction(true);

    try {
      await authStore.confirmEmailAndLogin(
        emailInputProps.value,
        passwordInputProps.value,
        emailValidationCodeInputProps.value
      );
    } catch (err) {
      const error = err as ConfirmEmailError;
      if (error.code === "code-invalid") {
        confirmEmailErrorState.set(error);
      } else {
        uiStore.setUnhandledError(err);
      }
    }
    setLoadingMajorAuthAction(false);
  }, [
    emailInputProps.value,
    passwordInputProps.value,
    emailValidationCodeInputProps.value,
  ]);

  const onLogin = useCallback(async () => {
    setLoadingMajorAuthAction(true);
    try {
      await authStore.login(emailInputProps.value, passwordInputProps.value);
    } catch (err) {
      const error = err as LoginError;
      if (error.code === "account-not-found") {
        loginErrorState.set(err);
      } else if (error.code === "email-not-confirmed") {
        await authStore.resendConfirmationEmail(emailInputProps.value);
        setActiveScreen("confirm-email");
      } else {
        uiStore.setUnhandledError(err);
      }
    }
    setLoadingMajorAuthAction(false);
  }, [emailInputProps.value, passwordInputProps.value]);

  const onResendConfirmationEmail = useCallback(async () => {
    setLoadingMinorAuthAction(true);
    try {
      await authStore.resendConfirmationEmail(emailInputProps.value);
    } catch (err) {
      uiStore.setUnhandledError(err);
    }
    setLoadingMinorAuthAction(false);
  }, [emailInputProps.value]);

  const onRequestPasswordResetCode = useCallback(async () => {
    setLoadingMajorAuthAction(true);
    try {
      await authStore.requestPasswordResetCode(emailInputProps.value);
    } catch (err) {
      uiStore.setUnhandledError(err);
    }
    setLoadingMajorAuthAction(false);
    setActiveScreen("set-password");
  }, [emailInputProps.value]);

  const onResetPassword = useCallback(async () => {
    setLoadingMajorAuthAction(true);
    try {
      await authStore.resetPassword(
        emailInputProps.value,
        passwordResetCodeInputProps.value,
        newPasswordInputProps.value
      );
      setActiveScreen("login");
    } catch (err) {
      const error = err as ResetPasswordError;
      if (
        error.code === "code-invalid" ||
        error.code === "password-invalid" ||
        error.code === "reached-max-attempts"
      ) {
        resetPasswordErrorState.set(err);
      } else {
        uiStore.setUnhandledError(err);
      }
    }
    setLoadingMajorAuthAction(false);
  }, [passwordResetCodeInputProps.value, newPasswordInputProps.value]);

  return (
    <LandingScrenView
      activeScreen={activeScreen}
      loadingMajorAuthAction={loadingMajorAuthAction}
      loadingMinorAuthAction={loadingMinorAuthAction}
      emailInputProps={emailInputProps}
      passwordInputProps={passwordInputProps}
      emailValidationCodeInputProps={emailValidationCodeInputProps}
      passwordResertCodeInputProps={passwordResetCodeInputProps}
      newPasswordInputProps={newPasswordInputProps}
      loginErrorState={loginErrorState}
      resetPasswordErrorState={resetPasswordErrorState}
      signupErrorState={signupErrorState}
      confirmEmailErrorState={confirmEmailErrorState}
      goToScreen={setActiveScreen}
      onSignup={onSignup}
      onResendConfirmationEmail={onResendConfirmationEmail}
      onConfirmEmail={onConfirmEmail}
      onLogin={onLogin}
      onRequestPasswordResetCode={onRequestPasswordResetCode}
      onResetPassword={onResetPassword}
    />
  );
};

export default observer(LandingScreen);
