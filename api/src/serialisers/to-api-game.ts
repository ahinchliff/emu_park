export const toApiGame = (
  userId: number,
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

  const myMissions = playerMissions.filter((m) => m.userId === userId);

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
      username: p.username,
      score: userIdsToScoreMap[p.userId] || 0,
    })),
    myMissions,
  };
};
