import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { MainStackScreenProps } from "../../../typings/screen-props";
import GameScreenView, { Tab, MarkMission } from "./Game_View";
import { useStores } from "../../../hooks";

type Props = MainStackScreenProps<"Game">;

const GameScreen: React.FC<Props> = (props) => {
  const { uiStore, gameStore, authStore } = useStores();
  const { gameId, dontFetchOnMount } = props.route.params;
  const [loadingGame, setLoadingGame] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<Tab>("players");
  const [startingGame, setStartingGame] = useState<boolean>(false);
  const [selectedMission, setSelectedMission] = useState<
    MarkMission | undefined
  >(undefined);
  const [markingMission, setMarkingMission] = useState<boolean>(false);
  const [finishingGame, setFinishingGame] = useState<boolean>(false);

  useEffect(() => {
    const fetchGame = async () => {
      if (!dontFetchOnMount) {
        setLoadingGame(true);
        try {
          await gameStore.fetchGame(gameId);
        } catch (err) {
          uiStore.setUnhandledError(err);
        }
        setLoadingGame(false);
      }
    };
    fetchGame();
    gameStore.subscripeToGameEvents(gameId);
    return () => {
      gameStore.unsubscribeFromGameEvents(gameId);
    };
  }, [gameId]);

  const game = gameStore.games.get(gameId);

  const goBack = () => props.navigation.goBack();

  const startGame = async () => {
    setStartingGame(true);
    if (game) {
      try {
        await gameStore.startGame(game.id);
      } catch (err) {
        uiStore.setUnhandledError(err);
      }
    }
    setStartingGame(false);
  };

  const markMission = async () => {
    setMarkingMission(true);

    if (game && selectedMission) {
      const otherPlayers =
        game.players.filter((p) => p.userId !== authStore.me!.id) || [];

      const moreThanOneOtherPlayer = otherPlayers.length > 1;

      try {
        await gameStore.markMission(game.id, selectedMission.missionId, {
          status: selectedMission.status as "completed" | "failed",
          againstPlayerId: moreThanOneOtherPlayer
            ? (selectedMission.againstPlayerId as number)
            : otherPlayers[0].userId,
        });
        setSelectedMission(undefined);
      } catch (err) {
        uiStore.setUnhandledError(err);
      }
    }
    setMarkingMission(false);
  };

  const finishGame = async () => {
    setFinishingGame(true);

    if (game) {
      try {
        await gameStore.finishGame(game.id);
        setSelectedMission(undefined);
      } catch (err) {
        uiStore.setUnhandledError(err);
      }
    }
    setFinishingGame(false);
  };

  return (
    <GameScreenView
      me={authStore.me!}
      loading={loadingGame}
      game={game}
      goBack={goBack}
      selectedTab={selectedTab}
      changeTab={setSelectedTab}
      startGame={startGame}
      startingGame={startingGame}
      selectedMission={selectedMission}
      setSelectedMission={setSelectedMission}
      markMission={markMission}
      markingMission={markingMission}
      finishGame={finishGame}
      finishingGame={finishingGame}
    />
  );
};

export default observer(GameScreen);
