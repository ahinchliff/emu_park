import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { MainStackScreenProps } from "../../../typings/screen-props";
import HomeScreenView from "./Home_View";
import { useInputState, useStores } from "../../../hooks";
import { toApiError } from "../../../utils";

type Props = MainStackScreenProps<"Home">;

const HomeScreen: React.FC<Props> = (props) => {
  const { authStore, gameStore, uiStore } = useStores();
  const [showCreateGameModal, setShowCreateGameModal] = useState<boolean>(
    false
  );
  const [creatingGame, setCreatingGame] = useState<boolean>(false);
  const gameTitleInputState = useInputState<string>("");

  const [showJoinGameModal, setShowJoinGameModal] = useState<boolean>(false);
  const [joiningGame, setJoiningGame] = useState<boolean>(false);
  const [joinCodeInvalid, setJoinCodeInvalid] = useState<boolean>(false);
  const joinCodeInputState = useInputState<string>("", () =>
    setJoinCodeInvalid(false)
  );

  useEffect(() => {
    gameStore.fetchMyGames();
  }, []);

  const createGame = async () => {
    setCreatingGame(true);
    try {
      const game = await gameStore.createGame({
        title: gameTitleInputState.value,
        toFinishAt: undefined,
      });
      setShowCreateGameModal(false);
      props.navigation.navigate("Game", {
        gameId: game.id,
        dontFetchOnMount: true,
      });
    } catch (err) {
      uiStore.setUnhandledError(err);
    }
    setCreatingGame(false);
  };

  const joinGame = async () => {
    setJoiningGame(true);
    try {
      const game = await gameStore.joinGame({
        joinCode: joinCodeInputState.value,
      });
      setShowJoinGameModal(false);
      props.navigation.navigate("Game", {
        gameId: game.id,
        dontFetchOnMount: true,
      });
    } catch (err) {
      const apiError = toApiError(err);
      if (
        apiError &&
        ((apiError.reason === "not_found" && apiError.resource === "game") ||
          apiError.reason === "bad_request")
      ) {
        setJoinCodeInvalid(true);
      } else {
        uiStore.setUnhandledError(err);
      }
    }
    setJoiningGame(false);
  };

  const toggleCreateGameModal = () =>
    setShowCreateGameModal(!showCreateGameModal);

  const toggleJoinGameModal = () => setShowJoinGameModal(!showJoinGameModal);

  const goToGame = (gameId: number) =>
    props.navigation.navigate("Game", {
      gameId,
    });

  return (
    <HomeScreenView
      user={authStore.me!}
      myGames={gameStore.myGames}
      showCreateGameModal={showCreateGameModal}
      toggleCreateGameModal={toggleCreateGameModal}
      creatingGame={creatingGame}
      gameTitleInputState={gameTitleInputState}
      createGame={createGame}
      showJoinGameModal={showJoinGameModal}
      toggleJoinGameModal={toggleJoinGameModal}
      joiningGame={joiningGame}
      joinCodeInputState={joinCodeInputState}
      joinGame={joinGame}
      joinCodeInvalid={joinCodeInvalid}
      goToGame={goToGame}
    />
  );
};

export default observer(HomeScreen);
