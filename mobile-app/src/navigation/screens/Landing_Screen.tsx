import React from "react";
import { observer } from "mobx-react-lite";
import { ScreenWrapper } from "../../components";
import { ScreenProps } from "../../typings/screenProps";

type Props = ScreenProps<"Landing">;

const LoginScreen: React.FC<Props> = () => {
  return <LoginScrenView />;
};

const LoginScrenView: React.FC = () => {
  return <ScreenWrapper removeTopSafeArea={true}></ScreenWrapper>;
};

export default observer(LoginScreen);
