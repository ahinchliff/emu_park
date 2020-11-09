declare namespace data {
  type UserTable = {
    userId: number;
    username: string;
    password: string;
    displayName: string;
    createdAt: Date;
    updatedAt: Date | undefined;
  };

  type GameTable = {
    gameId: number;
    title: string;
    ownerId: number;
    joinCode: string;
    startedAt: Date;
    finishedAt: Date | undefined;
    toFinishAt: Date | undefined;
    createdAt: Date;
    updatedAt: Date | undefined;
  };

  type PlayerTable = {
    gameId: number;
    userId: number;
    status: "pending" | "accepted" | "declined";
    statusSetAt: Date | undefined;
    leftAt: Date | undefined;
    createdAt: Date;
    updatedAt: Date | undefined;
  };

  type MissionTable = {
    missionId: number;
    description: string;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date | undefined;
  };

  type GameUserMissionTable = {
    gameId: number;
    userId: number;
    missionId: number;
    againstPlayerId: number | undefined;
    status: "pending" | "completed" | "failed";
    createdAt: Date;
    updatedAt: Date | undefined;
  };

  type UserColumns = keyof UserTable;
  type GameColumns = keyof GameTable;
  type PlayerColumns = keyof PlayerTable;
  type MissionColumns = keyof MissionTable;
  type gameUserMissionColumns = keyof GameUserMissionTable;

  interface ITables {
    user: { [key in UserColumns]: unknown };
    game: { [key in GameColumns]: unknown };
    player: { [key in PlayerColumns]: unknown };
    mission: { [key in MissionColumns]: unknown };
    gameUserMission: { [key in gameUserMissionColumns]: unknown };
  }
}
