import * as React from "react";
import {
  FlatList,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { variables } from "../../../styles";
import {
  Input,
  MainText,
  ScreenWrapper,
  BaseModal,
  HorizontalSpacer,
} from "../../../components";
import { getGameStatus } from "../../../utils/game";
import { InputProps } from "mobile-app/src/hooks";

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
  const insets = useSafeAreaInsets();

  return (
    <ScreenWrapper
      removeBottomSafeArea={true}
      removeTopSafeArea={true}
      style={{
        backgroundColor: variables.colors.primary,
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <GameList {...props} />
        </View>
        <View
          style={{
            flexDirection: "row",
            height: insets.bottom + 100,
            shadowColor: "#000",
            shadowOffset: {
              width: 1,
              height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
          }}
        >
          <Pressable
            onPressIn={props.toggleJoinGameModal}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "black" : "#f0932b",
                justifyContent: "center",
                alignItems: "center",
                width: "50%",
              },
            ]}
          >
            <MainText style={{ fontSize: 20, textAlign: "center" }}>
              Join game
            </MainText>
          </Pressable>
          <Pressable
            onPressIn={props.toggleCreateGameModal}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "black" : "#22a6b3",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                width: "50%",
              },
            ]}
          >
            <MainText style={{ fontSize: 20, textAlign: "center" }}>
              Create game
            </MainText>
          </Pressable>
        </View>
      </View>
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
  const insets = useSafeAreaInsets();

  if (!props.myGames.data.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {props.myGames.loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <MainText style={{ fontSize: 30, textAlign: "center" }}>
            You don't have any games. Join one or create a new one below{" "}
            {String.fromCodePoint(0x1f447)}
          </MainText>
        )}
      </View>
    );
  }
  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: insets.top + 20,
      }}
      data={props.myGames.data}
      renderItem={({ item }) => {
        const status = getGameStatus(item);

        return (
          <Pressable
            onPress={() => props.goToGame(item.id)}
            style={{
              backgroundColor: "white",
              marginBottom: 15,
              height: 125,
              borderRadius: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 15 }}>
              <MainText
                style={{ color: "black", fontSize: 23 }}
                removeShadow={true}
              >
                {item.title}
              </MainText>
            </View>
            <View
              style={{
                width: 90,
                backgroundColor: status.color,
                justifyContent: "center",
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {status.displayText}
              </Text>
            </View>
          </Pressable>
        );
      }}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
    />
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
      <Input {...props.gameTitleInputState} placeholder="Game title" />
      <HorizontalSpacer height={30} />
      <Pressable
        onPressIn={props.createGame}
        disabled={props.creatingGame}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "black" : "#22a6b3",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          },
        ]}
      >
        {props.creatingGame ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <MainText style={{ fontSize: 25, textAlign: "center" }}>
            Create {String.fromCodePoint(0x1f389)}
          </MainText>
        )}
      </Pressable>
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
      <Input
        {...props.joinCodeInputState}
        placeholder="Join code"
        autoCapitalize="none"
      />
      <HorizontalSpacer height={30} />
      <Pressable
        onPressIn={props.joinGame}
        disabled={props.joiningGame}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "black" : "#22a6b3",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          },
        ]}
      >
        {props.joiningGame ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <MainText style={{ fontSize: 25, textAlign: "center" }}>
            Join {String.fromCodePoint(0x1f389)}
          </MainText>
        )}
      </Pressable>
      <HorizontalSpacer height={30} />
      {props.joinCodeInvalid && (
        <MainText
          style={{ color: "#eb4d4b", textAlign: "center" }}
          removeShadow={true}
        >
          Game not found. Please try again.
        </MainText>
      )}
    </BaseModal>
  );
};

export default HomeScreenView;
