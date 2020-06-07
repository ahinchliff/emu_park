import React from "react";
import { observer } from "mobx-react-lite";
import { LiveLeagueScreen } from "../../components";
import { ScreenProps } from "../../typings/screenProps";

type Props = ScreenProps<"Landing">;

const LoginScreen: React.FC<Props> = () => {
  return <LoginScrenView />;
};

const LoginScrenView: React.FC = () => {
  return <LiveLeagueScreen removeTopSafeArea={true}></LiveLeagueScreen>;
};

export default observer(LoginScreen);
