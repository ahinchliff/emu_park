import * as moment from "moment";
import {
  addUserAsGamePlayer,
  createGameWithRandomOwner,
  createUserAndAddAsGamePlayer,
  createUserAndLogin,
  expectForbiddenResponse,
  expectGeneralBadRequestResponse,
  expectNotFoundResponse,
  expectNotAuthorisedResponse,
  expectSuccessResponse,
  initTestHelpers,
  startGame,
  TestHelpers,
} from "../..";

let testHelpers: TestHelpers;

beforeAll(async () => {
  testHelpers = await initTestHelpers();
});

afterEach(async () => {
  await testHelpers.clearDatabase();
});

afterAll(async () => {
  await testHelpers.tearDown();
});

describe("Api -> POST /game/:gameId/mission/:missionId", () => {
  it("When not logged in, expect 401 response", async () => {
    const game = await createGameWithRandomOwner(testHelpers);
    const user = await createUserAndAddAsGamePlayer(
      game.gameId,
      {},
      testHelpers
    );
    await startGame(game.gameId, testHelpers);

    const playerMissions = await testHelpers.dataClients.playerMission.getMany({
      gameId: game.gameId,
    });

    const mission = playerMissions[0];

    const requestBody: api.MarkMissionRequestBody = {
      status: "completed",
      againstPlayerId: user.userId,
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/mission/${mission.missionId}`)
      .send(requestBody);

    expectNotAuthorisedResponse(response);
  });

  it("When user is not player of game, expect 403 response", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);

    await startGame(game.gameId, testHelpers);

    const playerMissions = await testHelpers.dataClients.playerMission.getMany({
      gameId: game.gameId,
    });

    const mission = playerMissions[0];

    const requestBody: api.MarkMissionRequestBody = {
      status: "completed",
      againstPlayerId: game.ownerId,
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/mission/${mission.missionId}`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send(requestBody);

    expectForbiddenResponse(response);
  });

  it("when game has not started, expect general bad request response", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    await addUserAsGamePlayer(game.gameId, user.user.userId, testHelpers);

    const requestBody: api.MarkMissionRequestBody = {
      status: "completed",
      againstPlayerId: game.ownerId,
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/mission/1`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send(requestBody);

    expectGeneralBadRequestResponse(response);
  });

  it("when game has finished, expect general bad request response", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    await addUserAsGamePlayer(game.gameId, user.user.userId, testHelpers);

    await startGame(game.gameId, testHelpers);

    testHelpers.dataClients.game.update(
      { gameId: game.gameId },
      {
        finishedAt: moment.utc().toDate(),
      }
    );

    const requestBody: api.MarkMissionRequestBody = {
      status: "completed",
      againstPlayerId: game.ownerId,
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/mission/1`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send(requestBody);

    expectGeneralBadRequestResponse(response);
  });

  it("When mission doesn't exist, expect not found response", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    await addUserAsGamePlayer(game.gameId, user.user.userId, testHelpers);

    await startGame(game.gameId, testHelpers);

    const requestBody: api.MarkMissionRequestBody = {
      status: "completed",
      againstPlayerId: game.ownerId,
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/mission/-1`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send(requestBody);

    expectNotFoundResponse(response);
  });

  it("When mission doesn't belong to user, expect 403 response", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    await addUserAsGamePlayer(game.gameId, user.user.userId, testHelpers);

    await startGame(game.gameId, testHelpers);

    const playerMissions = await testHelpers.dataClients.playerMission.getMany({
      gameId: game.gameId,
    });

    const missionsNotOfCurrentUser = playerMissions.find(
      (m) => m.userId !== user.user.userId
    )!;

    const requestBody: api.MarkMissionRequestBody = {
      status: "completed",
      againstPlayerId: game.ownerId,
    };

    const response = await testHelpers.api
      .post(
        `/game/${game.gameId}/mission/${missionsNotOfCurrentUser.missionId}`
      )
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send(requestBody);

    expectForbiddenResponse(response);
  });

  it("When request is valid, expect success response and mission has been updated correctly", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    await addUserAsGamePlayer(game.gameId, user.user.userId, testHelpers);

    await startGame(game.gameId, testHelpers);

    const playerMissions = await testHelpers.dataClients.playerMission.getMany({
      gameId: game.gameId,
      userId: user.user.userId,
    });

    const mission = playerMissions[0];

    const requestBody: api.MarkMissionRequestBody = {
      status: "completed",
      againstPlayerId: game.ownerId,
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/mission/${mission.missionId}`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send(requestBody);

    expectSuccessResponse(response);

    const updatedMission = await testHelpers.dataClients.playerMission.get({
      gameId: game.gameId,
      userId: user.user.userId,
      missionId: mission.missionId,
    });

    expect(updatedMission?.status).toBe("completed");
    expect(updatedMission?.againstPlayerId).toBe(game.ownerId);
  });

  it("When against player id does not match a player, expect bad request response", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    await addUserAsGamePlayer(game.gameId, user.user.userId, testHelpers);

    await startGame(game.gameId, testHelpers);

    const playerMissions = await testHelpers.dataClients.playerMission.getMany({
      gameId: game.gameId,
      userId: user.user.userId,
    });

    const mission = playerMissions[0];

    const requestBody: api.MarkMissionRequestBody = {
      status: "completed",
      againstPlayerId: -1,
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/mission/${mission.missionId}`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send(requestBody);

    expectGeneralBadRequestResponse(response);
  });

  it("When mission has already been marked, expect bad request response", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    await addUserAsGamePlayer(game.gameId, user.user.userId, testHelpers);

    await startGame(game.gameId, testHelpers);

    const playerMissions = await testHelpers.dataClients.playerMission.getMany({
      gameId: game.gameId,
      userId: user.user.userId,
    });

    const mission = playerMissions[0];

    await testHelpers.dataClients.playerMission.update(
      {
        gameId: game.gameId,
        missionId: mission.missionId,
      },
      { status: "completed" }
    );

    const requestBody: api.MarkMissionRequestBody = {
      status: "completed",
      againstPlayerId: -1,
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/mission/${mission.missionId}`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send(requestBody);

    expectGeneralBadRequestResponse(response);
  });
});
