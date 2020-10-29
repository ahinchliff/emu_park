declare namespace data {
  type PlayerMission = {
    missionId: number;
    description: string;
    status: "pending" | "completed" | "failed";
  };

  interface PlayerMissionClient
    extends data.EntityClientBase<PlayerMission, void> {}
}
