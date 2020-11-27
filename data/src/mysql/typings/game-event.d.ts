declare namespace data {
  type GameEventBase = {
    gameEventId: data.GameEventTable["gameEventId"];
    gameId: data.GameEventTable["gameId"];
    eventType: data.GameEventTable["eventType"];
    createdAt: data.GameEventTable["createdAt"];
  };

  type JoinGameEvent = GameEventBase & {
    eventType: "joinedGame";
    data: {
      userId: number;
    };
  };

  type GameStartedEvent = GameEventBase & {
    eventType: "gameStarted";
    data: undefined;
  };

  type GameFinishedEvent = GameEventBase & {
    eventType: "gameFinished";
    data: undefined;
  };

  type MarkedMissionEvent = GameEventBase & {
    eventType: "markedMission";
    data: {
      userId: number;
      againstPlayerId: number;
      missionId: number;
      success: boolean;
    };
  };

  type GameEvent =
    | JoinGameEvent
    | GameStartedEvent
    | GameFinishedEvent
    | MarkedMissionEvent;

  type NewGameEvent = Omit<GameEvent, "gameEventId" | "createdAt">;

  interface GameEventClient
    extends data.EntityClientBase<
      data.GameEventTable,
      NewGameEvent,
      GameEvent
    > {}
}
