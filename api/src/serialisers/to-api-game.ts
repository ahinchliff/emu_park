export const toApiGame = (
  game: data.Game,
  players: data.Player[],
  playerMissions: data.PlayerMission[]
): api.Game => {
  const userIdsToScoreMap = playerMissions.reduce(
    (
      progress: { [key: number]: number },
      playerMission: data.PlayerMission
    ) => {
      if (playerMission.status === "completed") {
        const score: number = (progress[playerMission.userId] || 0) + 1;
        return {
          ...progress,
          [playerMission.userId]: score,
        };
      } else {
        return progress;
      }
    },
    {}
  );

  return {
    id: game.gameId,
    title: game.title,
    ownerId: game.ownerId,
    startedAt: game.startedAt?.toString(),
    finishedAt: game.startedAt?.toString(),
    toFinishAt: game.startedAt?.toString(),
    players: players.map((p) => ({
      userId: p.userId,
      username: p.username,
      status: p.status,
      score: userIdsToScoreMap[p.userId] || 0,
    })),
    myMissions: [],
  };
};
