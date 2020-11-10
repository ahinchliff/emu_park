import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { ScreenProps } from "../../../typings/screen-props";
import LandingScrenView from "./Landing_View";
import { useInputState, useStores } from "../../../hooks";

type Props = ScreenProps<"Landing">;

const LandingScreen: React.FC<Props> = () => {
  const { authStore } = useStores();

  const [loading, setLoading] = useState<boolean>(false);
  const [signupSuccessful, setSignupSuccessful] = useState<boolean>(false);
  const displayNameInputState = useInputState<string>("");

  const onSignup = async () => {
    setLoading(true);
    await authStore.signup({ displayName: displayNameInputState.value });
    await authStore.login();
    setLoading(false);
    setSignupSuccessful(true);
  };

  return (
    <LandingScrenView
      loading={loading}
      onSignup={onSignup}
      signupSuccessful={signupSuccessful}
      canSignup={displayNameInputState.value.length > 2}
      displayNameInputState={displayNameInputState}
    />
  );
};

export default observer(LandingScreen);
