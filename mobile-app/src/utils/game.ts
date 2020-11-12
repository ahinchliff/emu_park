export const getGameStatus = (
  game: api.Game | api.GameSearchResult
): "finished" | "playing" | "waiting" => {
  if (game.finishedAt) {
    return "finished";
  }

  if (game.startedAt) {
    return "playing";
  }

  return "waiting";
};
