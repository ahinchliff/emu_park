declare namespace api {
  type Game = {
    id: number;
    title: string;
    ownerId: number;
    startedAt: string | undefined;
    finishedAt: string | undefined;
    toFinishAt: string | undefined;
    players: Player[];
    myMissions: Mission[];
  };

  type Player = {
    userId: number;
    username: string;
    score: number;
    status: "pending" | "accepted" | "declined";
  };

  type Mission = {
    missionId: number;
    description: string;
    status: "pending" | "completed" | "failed";
  };

  type CreateGameRequestBody = Pick<Game, "title" | "toFinishAt">;

  type JoinGameRequestParams = api.Params<"gameId">;

  type JoinGameRequestBody = {
    joinCode: string;
  };
}
