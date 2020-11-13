import * as React from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-community/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BaseModal,
  HorizontalSpacer,
  Loading,
  MainText,
  ScreenWrapper,
} from "../../../components";
import { variables } from "../../../styles";
import { getGameStatus } from "../../../utils";

export type Tab = "players" | "missions";

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
  finishGame(): Promise<void>;
  startGame(): Promise<void>;
  changeTab(tab: Tab): void;
  setSelectedMission(mission: MarkMission | undefined): void;
  markMission(): Promise<void>;
  goBack(): void;
};

const GameScreenView: React.FC<Props> = (props) => {
  return (
    <ScreenWrapper
      style={{
        backgroundColor: variables.colors.primary,
      }}
      removeBottomSafeArea={true}
    >
      <View style={{ flexDirection: "row", padding: 20, alignItems: "center" }}>
        <Pressable
          onPress={props.goBack}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "black" : "#f0932b",
              justifyContent: "center",
              alignItems: "center",
              height: 36,
              width: 36,
              borderRadius: 18,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
          ]}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={variables.colors.white}
          />
        </Pressable>
        {props.game && (
          <MainText style={{ marginLeft: 20, fontSize: 25 }}>
            {props.game.title}
          </MainText>
        )}
      </View>
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
        <MainText style={{ textAlign: "center" }}>
          Something has gone wrong :(
        </MainText>
      </View>
    );
  }

  const status = getGameStatus(props.game);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 0 }}>
        <View style={{ backgroundColor: status.color, paddingVertical: 10 }}>
          <MainText style={{ textAlign: "center" }} removeShadow={true}>
            {status.displayText}
          </MainText>
        </View>
        <HorizontalSpacer height={20} />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TabButton
            text="Players"
            selected={props.selectedTab === "players"}
            onPress={() => props.changeTab("players")}
          />
          <TabButton
            text="Missions"
            selected={props.selectedTab === "missions"}
            onPress={() => props.changeTab("missions")}
          />
        </View>

        <View style={{ flex: 1, paddingTop: 10 }}>
          {props.selectedTab === "players" ? (
            <PlayerList game={props.game} me={props.me} />
          ) : (
            <MissionList
              game={props.game}
              setSelectedMission={props.setSelectedMission}
            />
          )}
        </View>
      </View>
      <FinishGameButton
        game={props.game}
        me={props.me}
        onPress={props.finishGame}
        loading={props.finishingGame}
      />
      <StartGameButton
        game={props.game}
        me={props.me}
        onPress={props.startGame}
        loading={props.startingGame}
      />
      <JoinCode game={props.game} />
    </View>
  );
};

const TabButton: React.FC<{
  text: string;
  selected: boolean;
  onPress(): void;
}> = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={() => [
        {
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
        },
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            {
              paddingBottom: 5,
              borderBottomWidth: 4,
              paddingHorizontal: 5,
              borderBottomColor: props.selected
                ? variables.colors.white
                : variables.colors.primary,
            },
          ]}
        >
          <MainText
            style={{
              fontSize: 20,
              textAlign: "center",
              color: pressed ? variables.colors.black : variables.colors.white,
            }}
          >
            {props.text}
          </MainText>
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
        <MainText
          style={{ fontSize: 20, paddingHorizontal: 20, textAlign: "center" }}
        >
          No one has joined the game yet {String.fromCodePoint(0x1f61e)}
          Friends can join using the code below {String.fromCodePoint(0x1f447)}
        </MainText>
      </View>
    );
  }

  return (
    <FlatList
      data={props.game.players}
      contentContainerStyle={{
        padding: 15,
      }}
      renderItem={({ item }) => {
        return (
          <View
            style={{
              backgroundColor: "white",
              marginBottom: 15,
              borderRadius: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 15 }}>
              <MainText
                style={{ color: "black", fontSize: 23 }}
                removeShadow={true}
              >
                {item.displayName}
              </MainText>
            </View>
            <View
              style={{
                width: 90,
                backgroundColor: variables.colors.black,
                justifyContent: "center",
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              <MainText
                removeShadow={true}
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {item.score}
              </MainText>
            </View>
          </View>
        );
      }}
      keyExtractor={(item) => item.userId.toString()}
      showsVerticalScrollIndicator={false}
    />
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
        <MainText
          style={{ fontSize: 20, paddingHorizontal: 20, textAlign: "center" }}
        >
          You will be assigned missions once {owner?.displayName} starts the
          game {String.fromCodePoint(0x1f554)}
        </MainText>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 15, flex: 1 }}>
      <HorizontalSpacer height={20} />
      <MainText
        style={{ fontSize: 30, color: variables.colors.black }}
        removeShadow={true}
      >
        Get someone to...
      </MainText>
      <HorizontalSpacer height={20} />
      <FlatList
        data={props.game.myMissions}
        contentContainerStyle={{ flex: 1 }}
        renderItem={({ item }) => {
          return (
            <Pressable
              disabled={item.status !== "pending" || !!props.game.finishedAt}
              onPress={() =>
                props.setSelectedMission({
                  ...item,
                  againstPlayerId: undefined,
                })
              }
              style={{
                backgroundColor: "white",
                marginBottom: 15,
                borderRadius: 10,
                flexDirection: "row",
                padding: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <MainText
                  style={{ color: "black", fontSize: 14 }}
                  removeShadow={true}
                >
                  {item.description}
                </MainText>
              </View>
              {item.status === "pending" && (
                <View
                  style={{
                    height: 25,
                    width: 25,
                    borderWidth: 2,
                    borderColor: variables.colors.black,
                    borderRadius: 5,
                  }}
                />
              )}
              {item.status === "failed" && (
                <FontAwesome name="times" size={25} color="#eb4d4b" />
              )}
              {item.status === "completed" && (
                <Entypo name="check" size={25} color="#6ab04c" />
              )}
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.missionId.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
        backgroundColor: "#22a6b3",
        padding: 15,
        paddingBottom: 15 + insets.bottom,
      }}
    >
      <MainText style={{ fontSize: 20, textAlign: "center" }}>
        {props.game.joinCode}
      </MainText>
    </View>
  );
};

const StartGameButton: React.FC<{
  game: api.Game;
  me: Props["me"];
  onPress: Props["startGame"];
  loading: Props["startingGame"];
}> = (props) => {
  const isOwner = props.game.ownerId === props.me.id;

  if (!isOwner || props.game.startedAt || props.game.players.length === 1) {
    return null;
  }

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "black" : "#f0932b",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15,
        },
      ]}
    >
      {props.loading ? (
        <ActivityIndicator size="small" color={variables.colors.white} />
      ) : (
        <MainText style={{ fontSize: 20, textAlign: "center" }}>
          Start game!
        </MainText>
      )}
    </Pressable>
  );
};

const FinishGameButton: React.FC<{
  game: api.Game;
  me: Props["me"];
  onPress: Props["finishGame"];
  loading: Props["finishingGame"];
}> = (props) => {
  const insets = useSafeAreaInsets();

  const isOwner = props.game.ownerId === props.me.id;

  if (!isOwner || !props.game.startedAt || props.game.finishedAt) {
    return null;
  }

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "black" : "#f0932b",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15,
          paddingBottom: 15 + insets.bottom,
        },
      ]}
    >
      {props.loading ? (
        <ActivityIndicator size="small" color={variables.colors.white} />
      ) : (
        <MainText style={{ fontSize: 20, textAlign: "center" }}>
          Finish Game
        </MainText>
      )}
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
      <MainText style={{ color: variables.colors.black }} removeShadow={true}>
        {props.selectedMission?.description}
      </MainText>
      <HorizontalSpacer height={40} />
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() =>
            props.setSelectedMission({
              ...props.selectedMission!,
              status: "completed",
            })
          }
          style={({ pressed }) => [
            {
              backgroundColor:
                pressed || props.selectedMission?.status === "completed"
                  ? "#f0932b"
                  : "#535c68",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 15,
              flex: 1,
            },
          ]}
        >
          <MainText
            style={{ color: variables.colors.black }}
            removeShadow={true}
          >
            Got! {String.fromCodePoint(0x1f389)}
          </MainText>
        </Pressable>
        <View style={{ width: 5 }} />
        <Pressable
          onPress={() =>
            props.setSelectedMission({
              ...props.selectedMission!,
              status: "failed",
            })
          }
          style={({ pressed }) => [
            {
              backgroundColor:
                pressed || props.selectedMission?.status === "failed"
                  ? "#f0932b"
                  : "#535c68",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 15,
              flex: 1,
            },
          ]}
        >
          <MainText
            style={{ color: variables.colors.black }}
            removeShadow={true}
          >
            Failed {String.fromCodePoint(0x1f44e)}
          </MainText>
        </Pressable>
      </View>
      <HorizontalSpacer height={20} />
      {moreThanOneOtherPlayer && (
        <>
          <MainText
            style={{ color: variables.colors.black }}
            removeShadow={true}
          >
            Who against?
          </MainText>
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
      <Pressable
        onPress={props.submit}
        disabled={
          props.selectedMission?.status! === "pending" || props.markingMission
        }
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "black" : "#22a6b3",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 15,
            width: "100%",
          },
        ]}
      >
        {props.markingMission ? (
          <ActivityIndicator size="small" color={variables.colors.white} />
        ) : (
          <MainText style={{ fontSize: 20, textAlign: "center" }}>
            Submit
          </MainText>
        )}
      </Pressable>
    </BaseModal>
  );
};

export default GameScreenView;
