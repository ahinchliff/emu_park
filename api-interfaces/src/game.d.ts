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
  };

  type GameSearchResult = Pick<
    Game,
    "id" | "title" | "ownerId" | "startedAt" | "finishedAt" | "toFinishAt"
  >;

  type Player = {
    userId: number;
    displayName: string;
    score: number;
  };

  type Mission = {
    missionId: number;
    description: string;
    status: "pending" | "completed" | "failed";
  };

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
