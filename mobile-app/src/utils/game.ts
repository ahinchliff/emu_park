export const getGameStatus = (
  game: api.Game | api.GameSearchResult
): {
  status: "finished" | "playing" | "waiting";
  color: string;
  displayText: string;
} => {
  if (game.finishedAt) {
    return {
      status: "finished",
      color: "#eb4d4b",
      displayText: "Finished",
    };
  }

  if (game.startedAt) {
    return {
      status: "playing",
      color: "#686de0",
      displayText: "Playing!",
    };
  }

  return {
    status: "waiting",
    color: "#535c68",
    displayText: "Waiting to begin",
  };
};

export const playerCount = (_game: api.Game | api.GameSearchResult) => 3;
