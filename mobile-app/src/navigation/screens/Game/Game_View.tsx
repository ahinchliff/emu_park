import * as React from "react";
import moment from "moment";
import { FlatList, Pressable, Text, TextStyle, View } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-community/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Header,
  BaseModal,
  HorizontalSpacer,
  Loading,
  ScreenWrapper,
  Row,
  Button,
  IconDetails,
  MissionState,
  TextButton,
  ListItem,
} from "../../../components";
import { variables } from "../../../styles";
import { getGameStatus } from "../../../utils";

export type Tab = "players" | "missions" | "timeline";

export type MarkMission = api.Mission & {
  againstPlayerId: number | undefined;
};

type Props = {
  me: api.AuthUser;
  game: api.Game | undefined;
  selectedTab: Tab;
  loading: boolean;
  startingGame: boolean;
  markingMission: boolean;
  selectedMission: MarkMission | undefined;
  finishingGame: boolean;
  showStartGameModal: boolean;
  showFinishGameModal: boolean;
  finishGame(): Promise<void>;
  startGame(): Promise<void>;
  changeTab(tab: Tab): void;
  setSelectedMission(mission: MarkMission | undefined): void;
  markMission(): Promise<void>;
  goBack(): void;
  toggleShowStartGameModal(): void;
  toggleShowFinishGameModal(): void;
};

const GameScreenView: React.FC<Props> = (props) => {
  return (
    <ScreenWrapper
      style={{
        backgroundColor: variables.colors.yellow,
      }}
      removeBottomSafeArea={true}
    >
      <Content {...props} />
      <MarkMissionModal
        me={props.me}
        game={props.game}
        submit={props.markMission}
        markingMission={props.markingMission}
        selectedMission={props.selectedMission}
        setSelectedMission={props.setSelectedMission}
        close={() => props.setSelectedMission(undefined)}
      />
      <StartGameModal
        show={props.showStartGameModal}
        onClose={props.toggleShowStartGameModal}
        startGame={props.startGame}
        startingGame={props.startingGame}
      />
      <FinishGameModal
        show={props.showFinishGameModal}
        onClose={props.toggleShowFinishGameModal}
        finishGame={props.finishGame}
        finishingGame={props.finishingGame}
      />
    </ScreenWrapper>
  );
};

const Content: React.FC<Props> = (props) => {
  if (props.loading && !props.game) {
    return <Loading />;
  }

  if (!props.game) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center" }}>Something has gone wrong :(</Text>
      </View>
    );
  }

  const status = getGameStatus(props.game);

  const tabContent: { [key in Tab]: JSX.Element } = {
    players: <PlayerList game={props.game} me={props.me} />,
    missions: (
      <MissionList
        game={props.game}
        setSelectedMission={props.setSelectedMission}
      />
    ),
    timeline: <TimeLine game={props.game} />,
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: variables.standardPadding.horizontal,
        }}
      >
        <Header
          hideIcon={true}
          leftButton={{
            text: "BACK",
            onPress: props.goBack,
          }}
          rightComponent={
            <View style={{ justifyContent: "flex-end" }}>
              <IconDetails
                icon="status"
                details={status.displayText}
                color={variables.colors.black}
              />
            </View>
          }
        />
      </View>
      <HorizontalSpacer height={10} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: variables.standardPadding.horizontal,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TabButton
            text="PLAYERS"
            textAlign="left"
            selected={props.selectedTab === "players"}
            onPress={() => props.changeTab("players")}
          />
          <TabButton
            text="MISSIONS"
            textAlign="center"
            selected={props.selectedTab === "missions"}
            onPress={() => props.changeTab("missions")}
          />
          <TabButton
            text="TIMELINE"
            textAlign="right"
            selected={props.selectedTab === "timeline"}
            onPress={() => props.changeTab("timeline")}
          />
        </View>
        <View style={{ flex: 1, paddingTop: 10 }}>
          {tabContent[props.selectedTab]}
        </View>
      </View>
      <FinishGameButton
        game={props.game}
        me={props.me}
        onPress={props.toggleShowFinishGameModal}
      />
      <StartGameButton
        game={props.game}
        me={props.me}
        onPress={props.toggleShowStartGameModal}
      />
      <JoinCode game={props.game} />
    </View>
  );
};

const TabButton: React.FC<{
  text: string;
  textAlign: TextStyle["textAlign"];
  selected: boolean;
  onPress(): void;
}> = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={() => [
        {
          justifyContent: "center",
        },
      ]}
    >
      {() => (
        <View
          style={[
            {
              paddingBottom: 5,
              borderBottomWidth: 4,
              paddingHorizontal: 5,
              borderBottomColor: props.selected
                ? variables.colors.black
                : variables.colors.yellow,
            },
          ]}
        >
          <Text
            style={{
              textAlign: props.textAlign,
              color: variables.colors.black,
              fontWeight: "bold",
            }}
          >
            {props.text}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const PlayerList: React.FC<{ game: api.Game; me: api.AuthUser }> = (props) => {
  const isOwner = props.game.ownerId === props.me.id;

  if (isOwner && props.game.players.length === 1) {
    return (
      <View>
        <HorizontalSpacer height={30} />
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          No one has joined your game yet {String.fromCodePoint(0x1f61e)}.
          Friends can join using the code below {String.fromCodePoint(0x1f447)}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={props.game.players}
      contentContainerStyle={{ paddingTop: 20 }}
      renderItem={({ item }) => (
        <Player player={item} gameStarted={!!props.game.startedAt} />
      )}
      keyExtractor={(item) => item.userId.toString()}
      showsVerticalScrollIndicator={false}
    />
  );
};

const Player: React.FC<{ player: api.Player; gameStarted: boolean }> = (
  props
) => {
  return (
    <Row style={{ paddingBottom: 10 }}>
      <Text style={{ fontWeight: "bold" }}>{props.player.displayName}</Text>
      <MissionState
        missionState={props.player.missionState}
        started={props.gameStarted}
        pressed={false}
      />
    </Row>
  );
};

const MissionList: React.FC<{
  game: api.Game;
  setSelectedMission: Props["setSelectedMission"];
}> = (props) => {
  if (!props.game.startedAt) {
    const owner = props.game.players.find(
      (p) => p.userId === props.game.ownerId
    );
    return (
      <View>
        <HorizontalSpacer height={30} />
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          You will be assigned missions once {owner?.displayName} starts the
          game {String.fromCodePoint(0x1f554)}
        </Text>
      </View>
    );
  }

  if (props.game.finishedAt) {
    return (
      <View>
        <HorizontalSpacer height={30} />
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          The game is finished!
        </Text>
      </View>
    );
  }

  return (
    <>
      <HorizontalSpacer height={20} />
      <Text style={{ color: variables.colors.black, fontWeight: "bold" }}>
        Get someone to...
      </Text>
      <HorizontalSpacer height={20} />
      <FlatList
        data={props.game.myMissions}
        contentContainerStyle={{ flex: 1 }}
        renderItem={({ item }) => (
          <Mission
            mission={item}
            onPress={() =>
              props.setSelectedMission({
                ...item,
                againstPlayerId: undefined,
              })
            }
          />
        )}
        keyExtractor={(item) => item.missionId.toString()}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

const Mission: React.FC<{
  mission: api.Mission;
  onPress(): void;
}> = (props) => {
  return (
    <ListItem onPress={props.onPress}>
      {({ pressed }) => {
        const color = pressed
          ? variables.colors.yellow
          : variables.colors.black;
        return (
          <Row style={{ alignItems: "center" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ color }}>{props.mission.description}</Text>
            </View>
            {props.mission.status === "pending" && (
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderWidth: 2,
                  borderColor: color,
                  borderRadius: 5,
                }}
              />
            )}
            {props.mission.status === "failed" && (
              <FontAwesome name="times" size={25} color="#eb4d4b" />
            )}
            {props.mission.status === "completed" && (
              <Entypo name="check" size={25} color="#6ab04c" />
            )}
          </Row>
        );
      }}
    </ListItem>
  );
};

const TimeLine: React.FC<{ game: api.Game }> = (props) => {
  return (
    <FlatList
      data={props.game.events}
      contentContainerStyle={{ flex: 1, marginTop: 20 }}
      renderItem={({ item }) => <Event game={props.game} event={item} />}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
    />
  );
};

const Event: React.FC<{ event: api.Event; game: api.Game }> = (props) => {
  let content = "";

  if (props.event.eventType === "joinedGame") {
    const userId = props.event.data.userId;
    const player = props.game.players.find((p) => p.userId === userId)!;
    content = `${player.displayName} joined the game`;
  }

  if (
    props.event.eventType === "gameStarted" ||
    props.event.eventType === "gameFinished"
  ) {
    const owner = props.game.players.find(
      (p) => p.userId === props.game.ownerId
    )!;
    content = `${owner.displayName} ${
      props.event.eventType === "gameStarted" ? "started" : "ended"
    } the game`;
  }

  if (props.event.eventType === "markedMission") {
    const getterId = props.event.data.userId;
    const getter = props.game.players.find((p) => p.userId === getterId)!;
    const againstId = props.event.data.againstPlayerId;
    const against = props.game.players.find((p) => p.userId === againstId)!;
    content = `${getter.displayName} ${
      props.event.data.success ? "got" : "failed to get"
    } ${against.displayName}`;
  }

  return (
    <Row style={{ paddingBottom: 10 }}>
      <View style={{ flex: 3 }}>
        <Text style={{ fontWeight: "bold" }}>
          {moment(props.event.createdAt).fromNow()}
        </Text>
      </View>
      <View style={{ flex: 5 }}>
        <Text style={{ textAlign: "right" }}>{content}</Text>
      </View>
    </Row>
  );
};

const JoinCode: React.FC<{ game: api.Game }> = (props) => {
  const insets = useSafeAreaInsets();

  if (props.game.startedAt) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: variables.colors.black,
        padding: 15,
        paddingBottom: 15 + insets.bottom,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          color: variables.colors.yellow,
          fontWeight: "bold",
        }}
      >
        {props.game.joinCode}
      </Text>
    </View>
  );
};

const StartGameButton: React.FC<{
  game: api.Game;
  me: Props["me"];
  onPress(): void;
}> = (props) => {
  const isOwner = props.game.ownerId === props.me.id;

  if (!isOwner || props.game.startedAt || props.game.players.length === 1) {
    return null;
  }

  return (
    <GameActionButton
      text="START GAME"
      onPress={props.onPress}
      withInserts={true}
    />
  );
};

const FinishGameButton: React.FC<{
  game: api.Game;
  me: Props["me"];
  onPress(): void;
}> = (props) => {
  const isOwner = props.game.ownerId === props.me.id;

  if (!isOwner || !props.game.startedAt || props.game.finishedAt) {
    return null;
  }

  return (
    <GameActionButton
      text="FINISH GAME"
      onPress={props.onPress}
      withInserts={true}
    />
  );
};

const GameActionButton: React.FC<{
  text: string;
  onPress(): void;
  withInserts: boolean;
}> = (props) => {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={props.onPress}
      style={() => [
        {
          backgroundColor: variables.colors.black,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15,
          paddingBottom: 15 + (props.withInserts ? insets.bottom : 0),
        },
      ]}
    >
      <TextButton
        style={{
          fontSize: 20,
          textAlign: "center",
          color: variables.colors.white,
        }}
        onPress={props.onPress}
        text={props.text}
      />
    </Pressable>
  );
};

const MarkMissionModal: React.FC<{
  game: api.Game | undefined;
  me: api.AuthUser;
  selectedMission: Props["selectedMission"];
  markingMission: Props["markingMission"];
  setSelectedMission: Props["setSelectedMission"];
  submit: Props["markMission"];
  close(): void;
}> = (props) => {
  const otherPlayers =
    props.game?.players.filter((p) => p.userId !== props.me.id) || [];

  const moreThanOneOtherPlayer = otherPlayers.length > 1;

  return (
    <BaseModal show={!!props.selectedMission} onClose={props.close}>
      <Text style={{ color: variables.colors.black, fontWeight: "bold" }}>
        {props.selectedMission?.description}
      </Text>
      <HorizontalSpacer height={40} />
      <View style={{ flexDirection: "row" }}>
        <SuccessFailureButton
          onPress={() =>
            props.setSelectedMission({
              ...props.selectedMission!,
              status: "completed",
            })
          }
          selected={props.selectedMission?.status === "completed"}
          text="GOT"
        />

        <View style={{ width: 5 }} />
        <SuccessFailureButton
          onPress={() =>
            props.setSelectedMission({
              ...props.selectedMission!,
              status: "failed",
            })
          }
          selected={props.selectedMission?.status === "failed"}
          text="FAILED"
        />
      </View>
      <HorizontalSpacer height={30} />
      {moreThanOneOtherPlayer && (
        <>
          <Text style={{ fontWeight: "bold" }}>Who against?</Text>
          <Picker
            selectedValue={props.selectedMission?.againstPlayerId}
            onValueChange={(value) => {
              props.setSelectedMission({
                ...props.selectedMission!,
                againstPlayerId: Number(value.toString()),
              });
            }}
          >
            {props.game?.players.map((p) => (
              <Picker.Item
                label={p.displayName}
                value={p.userId}
                key={p.userId}
              />
            ))}
          </Picker>
        </>
      )}
      <Button
        onPress={props.submit}
        loading={props.markingMission}
        disabled={
          props.selectedMission?.status! === "pending" || props.markingMission
        }
      >
        SUBMIT
      </Button>
    </BaseModal>
  );
};

const SuccessFailureButton: React.FC<{
  text: string;
  selected: boolean;
  onPress(): void;
}> = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={() => [
        {
          backgroundColor: props.selected
            ? variables.colors.black
            : variables.colors.yellow,
          borderWidth: 2,
          borderColor: variables.colors.black,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15,
          flex: 1,
        },
      ]}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: props.selected
            ? variables.colors.yellow
            : variables.colors.black,
        }}
      >
        {props.text}
      </Text>
    </Pressable>
  );
};

const StartGameModal: React.FC<{
  show: boolean;
  onClose(): void;
  startGame(): Promise<void>;
  startingGame: boolean;
}> = (props) => {
  return (
    <BaseModal show={props.show} onClose={props.onClose}>
      <Text style={{ fontWeight: "bold" }}>
        Are you sure you want to start?
      </Text>
      <HorizontalSpacer height={20} />
      <Text>New players wont be able to join once the game has started.</Text>
      <HorizontalSpacer height={20} />

      <Button onPress={props.startGame} loading={props.startingGame}>
        START
      </Button>
    </BaseModal>
  );
};

const FinishGameModal: React.FC<{
  show: boolean;
  onClose(): void;
  finishGame(): Promise<void>;
  finishingGame: boolean;
}> = (props) => {
  return (
    <BaseModal show={props.show} onClose={props.onClose}>
      <Text style={{ fontWeight: "bold" }}>
        Are you sure you want to finish?
      </Text>
      <HorizontalSpacer height={20} />
      <Button onPress={props.finishGame} loading={props.finishingGame}>
        FINISH
      </Button>
    </BaseModal>
  );
};

export default GameScreenView;
