declare namespace api {
  type Game = {
    id: number;
    title: string;
    ownerId: number;
    startedAt: string | undefined;
    finishedAt: string | undefined;
    toFinishAt: string | undefined;
    joinCode: string;
    players: Player[];
    myMissions: Mission[];
    events: Event[];
  };

  type GameSearchResult = Pick<
    Game,
    "id" | "title" | "ownerId" | "startedAt" | "finishedAt" | "toFinishAt"
  > & {
    playerCount: number;
    missionState: MissionState;
  };

  type Player = {
    userId: number;
    displayName: string;
    missionState: MissionState;
  };

  type MissionState = {
    completed: number;
    pending: number;
    failed: number;
  };

  type Mission = {
    missionId: number;
    description: string;
    status: "pending" | "completed" | "failed";
  };

  type EventBase = {
    id: number;
    eventType: "joinedGame" | "gameStarted" | "gameFinished" | "markedMission";
    createdAt: string;
  };

  type JoinGameEvent = EventBase & {
    eventType: "joinedGame";
    data: {
      userId: number;
    };
  };

  type GameStartedEvent = EventBase & {
    eventType: "gameStarted";
    data: undefined;
  };

  type GameFinishedEvent = EventBase & {
    eventType: "gameFinished";
    data: undefined;
  };

  type MarkedMissionEvent = EventBase & {
    eventType: "markedMission";
    data: {
      userId: number;
      againstPlayerId: number;
      missionId: number;
      success: boolean;
    };
  };

  type Event =
    | JoinGameEvent
    | GameStartedEvent
    | GameFinishedEvent
    | MarkedMissionEvent;

  type CreateGameRequestBody = Pick<Game, "title" | "toFinishAt">;

  type JoinGameRequestBody = {
    joinCode: string;
  };

  type StartGameRequestParams = api.Params<"gameId">;

  type GetGameRequestParams = api.Params<"gameId">;

  type MarkMissionRequestParams = api.Params<"gameId" | "missionId">;

  type MarkMissionRequestBody = {
    status: "completed" | "failed";
    againstPlayerId: number;
  };

  type FinishGameRequestParams = api.Params<"gameId">;
}
