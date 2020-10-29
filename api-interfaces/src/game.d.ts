declare namespace api {
  type Game = {
    id: number;
    title: string;
    ownerId: string;
    startedAt: string;
    finishedAt: string | undefined;
    finishTime: string | undefined;
    players: Player[];
    myMissions: Mission[];
  };

  type Player = {
    userId: number;
    username: string;
    score: number;
  };

  type Mission = {
    missionId: number;
    description: string;
    status: "pending" | "completed" | "failed";
  };
}
