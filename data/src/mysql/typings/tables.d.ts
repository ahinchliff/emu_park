declare namespace data {
  type UserColumns =
    | "userId"
    | "username"
    | "password"
    | "createdAt"
    | "updatedAt";

  type GameColumns =
    | "gameId"
    | "title"
    | "ownerId"
    | "startedAt"
    | "finishedAt"
    | "toFinishAt"
    | "createdAt"
    | "updatedAt";

  type PlayerColumns =
    | "gameId"
    | "userId"
    | "leftAt"
    | "createdAt"
    | "updatedAt";

  type MissionColumns =
    | "missionId"
    | "description"
    | "disabled"
    | "createdAt"
    | "updatedAt";

  type GamePlayerMissionColumns =
    | "gameId"
    | "playerId"
    | "missionId"
    | "status"
    | "createdAt"
    | "updatedAt";

  interface ITables {
    user: { [key in UserColumns]: unknown };
    game: { [key in GameColumns]: unknown };
    player: { [key in PlayerColumns]: unknown };
    mission: { [key in MissionColumns]: unknown };
    gamePlayerMission: { [key in GamePlayerMissionColumns]: unknown };
  }
}
