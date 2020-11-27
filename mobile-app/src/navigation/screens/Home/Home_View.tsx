import * as React from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { variables } from "../../../styles";
import {
  Input,
  ScreenWrapper,
  BaseModal,
  HorizontalSpacer,
  Row,
  Button,
  Header,
  IconDetails,
  ListItemWithTitle,
  MissionState,
} from "../../../components";
import { getGameStatus } from "../../../utils/game";
import { InputProps } from "../../../hooks";

type Props = {
  user: api.AuthUser;
  myGames: RemoteData<api.GameSearchResult>;
  showCreateGameModal: boolean;
  toggleCreateGameModal(): void;
  creatingGame: boolean;
  gameTitleInputState: InputProps<string>;
  createGame(): Promise<void>;
  showJoinGameModal: boolean;
  toggleJoinGameModal(): void;
  joiningGame: boolean;
  joinCodeInputState: InputProps<string>;
  joinCodeInvalid: boolean;
  joinGame(): Promise<void>;
  goToGame(gameId: number): void;
};

const HomeScreenView: React.FC<Props> = (props) => {
  return (
    <ScreenWrapper
      removeBottomSafeArea={true}
      style={{
        backgroundColor: variables.colors.yellow,
        paddingHorizontal: variables.standardPadding.horizontal,
      }}
    >
      <Header
        leftButton={{
          text: "CREATE",
          onPress: props.toggleCreateGameModal,
        }}
        rightButton={{
          text: "JOIN",
          onPress: props.toggleJoinGameModal,
        }}
      />
      <GameList {...props} />
      <CreateGameModal
        show={props.showCreateGameModal}
        creatingGame={props.creatingGame}
        onClose={props.toggleCreateGameModal}
        createGame={props.createGame}
        gameTitleInputState={props.gameTitleInputState}
      />
      <JoinGameModal
        show={props.showJoinGameModal}
        joiningGame={props.joiningGame}
        onClose={props.toggleJoinGameModal}
        joinGame={props.joinGame}
        joinCodeInvalid={props.joinCodeInvalid}
        joinCodeInputState={props.joinCodeInputState}
      />
    </ScreenWrapper>
  );
};

const GameList: React.FC<Props> = (props) => {
  if (!props.myGames.data.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {props.myGames.loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            You aren't part of any games. Join or create one above{" "}
            {String.fromCodePoint(0x261d)}
          </Text>
        )}
      </View>
    );
  }
  return (
    <FlatList
      data={props.myGames.data}
      contentContainerStyle={{ paddingTop: 20 }}
      renderItem={({ item }) => (
        <Game game={item} onPress={() => props.goToGame(item.id)} />
      )}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
    />
  );
};

const Game: React.FC<{ game: api.GameSearchResult; onPress(): void }> = (
  props
) => {
  const status = getGameStatus(props.game);

  return (
    <ListItemWithTitle title={props.game.title} onPress={props.onPress}>
      {({ pressed }) => {
        const color = pressed
          ? variables.colors.yellow
          : variables.colors.black;
        return (
          <Row>
            <Row>
              <IconDetails
                icon="player"
                details={props.game.playerCount}
                color={color}
              />
              <IconDetails
                icon="status"
                details={status.displayText}
                color={color}
              />
            </Row>
            <MissionState
              missionState={props.game.missionState}
              started={!!props.game.startedAt}
              pressed={pressed}
            />
          </Row>
        );
      }}
    </ListItemWithTitle>
  );
};

const CreateGameModal: React.FC<{
  show: boolean;
  gameTitleInputState: InputProps<string>;
  creatingGame: boolean;
  onClose(): void;
  createGame: Props["createGame"];
}> = (props) => {
  return (
    <BaseModal show={props.show} onClose={props.onClose}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
        What do you want to name your game?
      </Text>
      <HorizontalSpacer height={40} />
      <Input {...props.gameTitleInputState} placeholder="The BBBs" />
      <HorizontalSpacer height={20} />
      <Button onPress={props.createGame} loading={props.creatingGame}>
        CREATE {String.fromCodePoint(0x1f389)}
      </Button>
      <HorizontalSpacer height={30} />
    </BaseModal>
  );
};

const JoinGameModal: React.FC<{
  show: boolean;
  joinCodeInputState: InputProps<string>;
  joiningGame: boolean;
  joinCodeInvalid: boolean;
  onClose(): void;
  joinGame: Props["joinGame"];
}> = (props) => {
  return (
    <BaseModal show={props.show} onClose={props.onClose}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
        What code did your mate give you?
      </Text>
      <HorizontalSpacer height={40} />
      <Input
        {...props.joinCodeInputState}
        placeholder="thirty purple dogs"
        autoCapitalize="none"
      />
      <HorizontalSpacer height={20} />
      <Button onPress={props.joinGame} loading={props.joiningGame}>
        JOIN {String.fromCodePoint(0x1f389)}
      </Button>
      <HorizontalSpacer height={30} />
      {props.joinCodeInvalid && (
        <Text style={{ color: "#eb4d4b", textAlign: "center" }}>
          Game not found. Please try again.
        </Text>
      )}
    </BaseModal>
  );
};

export default HomeScreenView;
