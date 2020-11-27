export const toApiGame = (
  userId: number,
  game: data.Game,
  players: data.Player[],
  gameMissions: data.PlayerMission[],
  events: data.GameEvent[]
): api.Game => {
  const myMissions = gameMissions.filter((m) => m.userId === userId);

  return {
    id: game.gameId,
    title: game.title,
    ownerId: game.ownerId,
    startedAt: game.startedAt?.toISOString(),
    finishedAt: game.finishedAt?.toISOString(),
    toFinishAt: game.toFinishAt?.toISOString(),
    joinCode: game.joinCode,
    players: players.map((p) => ({
      userId: p.userId,
      displayName: p.displayName,
      missionState: missionsToMissionState(
        gameMissions.filter((m) => m.userId === p.userId)
      ),
    })),
    myMissions,
    events: events.map((e) => {
      return {
        id: e.gameEventId,
        eventType: e.eventType,
        data: e.data as any,
        createdAt: e.createdAt.toISOString(),
      };
    }),
  };
};

export const toApiGameSearchResult = (
  game: data.GameSearch,
  userMissions: data.PlayerMission[]
): api.GameSearchResult => {
  const missionsForThisGame = userMissions.filter(
    (m) => m.gameId === game.gameId
  );
  const missionState = missionsToMissionState(missionsForThisGame);

  return {
    id: game.gameId,
    title: game.title,
    ownerId: game.ownerId,
    playerCount: game.playerCount,
    missionState,
    startedAt: game.startedAt?.toString(),
    finishedAt: game.finishedAt?.toString(),
    toFinishAt: game.toFinishAt?.toString(),
  };
};

const missionsToMissionState = (
  missions: data.PlayerMission[]
): api.MissionState => {
  const completed = missions.filter((m) => m.status === "completed").length;

  const pending = missions.filter((m) => m.status === "pending").length;

  const failed = missions.filter((m) => m.status === "failed").length;

  return {
    completed,
    pending,
    failed,
  };
};
