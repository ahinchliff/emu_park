import React from "react";
import { observer } from "mobx-react-lite";
import { MainStackScreenProps } from "../../../typings/screen-props";
import GameScreenView from "./Game_View";

type Props = MainStackScreenProps<"Home">;

const GameScreen: React.FC<Props> = () => {
  return <GameScreenView />;
};

export default observer(GameScreen);
