import {
  createUserAndLogin,
  expectSuccessResponse,
  initTestHelpers,
  TestHelpers,
} from "../";

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

test("Api -> Game Flow", async () => {
  const playerOne = await createUserAndLogin(testHelpers);
  const playerTwo = await createUserAndLogin(testHelpers);
  const playerThree = await createUserAndLogin(testHelpers);
  const playerFour = await createUserAndLogin(testHelpers);

  const createGameRequestBody: api.CreateGameRequestBody = {
    title: "test game",
    toFinishAt: undefined,
  };

  const createGameResponse = await testHelpers.api
    .post("/game")
    .set({ Authorization: `Bearer ${playerOne.jwt}` })
    .send(createGameRequestBody);

  expectSuccessResponse(createGameResponse);

  const createGameResponseBody: api.Game = createGameResponse.body;

  const joinGameRequestBody: api.JoinGameRequestBody = {
    joinCode: createGameResponseBody.joinCode,
  };

  const joinGamePlayerTwoResponse = await testHelpers.api
    .post(`/game/join`)
    .set({ Authorization: `Bearer ${playerTwo.jwt}` })
    .send(joinGameRequestBody);

  const joinGamePlayerThreeResponse = await testHelpers.api
    .post(`/game/join`)
    .set({ Authorization: `Bearer ${playerThree.jwt}` })
    .send(joinGameRequestBody);

  const joinGamePlayerFourResponse = await testHelpers.api
    .post(`/game/join`)
    .set({ Authorization: `Bearer ${playerFour.jwt}` })
    .send(joinGameRequestBody);

  expectSuccessResponse(joinGamePlayerTwoResponse);
  expectSuccessResponse(joinGamePlayerThreeResponse);
  expectSuccessResponse(joinGamePlayerFourResponse);

  const startGameResponse = await testHelpers.api
    .post(`/game/${createGameResponseBody.id}/start`)
    .set({ Authorization: `Bearer ${playerOne.jwt}` })
    .send();

  expectSuccessResponse(startGameResponse);

  const getPlayerOneGameResponseFirst = await testHelpers.api
    .get(`/game/${createGameResponseBody.id}`)
    .set({ Authorization: `Bearer ${playerOne.jwt}` })
    .send();

  const getPlayerTwoGameResponseFirst = await testHelpers.api
    .get(`/game/${createGameResponseBody.id}`)
    .set({ Authorization: `Bearer ${playerTwo.jwt}` })
    .send();

  const getPlayerThreeGameResponseFirst = await testHelpers.api
    .get(`/game/${createGameResponseBody.id}`)
    .set({ Authorization: `Bearer ${playerThree.jwt}` })
    .send();

  const getPlayerFourGameResponseFirst = await testHelpers.api
    .get(`/game/${createGameResponseBody.id}`)
    .set({ Authorization: `Bearer ${playerFour.jwt}` })
    .send();

  expectSuccessResponse(getPlayerOneGameResponseFirst);
  expectSuccessResponse(getPlayerTwoGameResponseFirst);
  expectSuccessResponse(getPlayerThreeGameResponseFirst);
  expectSuccessResponse(getPlayerFourGameResponseFirst);

  const getPlayerOneGameResponseBodyFirst: api.Game =
    getPlayerOneGameResponseFirst.body;

  const playerOneFirstMission = getPlayerOneGameResponseBodyFirst.myMissions[0];

  const playerOneGetsPlayerTwoFirstRequestBody: api.MarkMissionRequestBody = {
    status: "completed",
    againstPlayerId: playerTwo.user.userId,
  };

  const playerOneGetsPlayerTwoFirstResponse = await testHelpers.api
    .post(
      `/game/${createGameResponseBody.id}/mission/${playerOneFirstMission.missionId}`
    )
    .set({ Authorization: `Bearer ${playerOne.jwt}` })
    .send(playerOneGetsPlayerTwoFirstRequestBody);

  expectSuccessResponse(playerOneGetsPlayerTwoFirstResponse);

  const getPlayerFourGameResponseSecond = await testHelpers.api
    .get(`/game/${createGameResponseBody.id}`)
    .set({ Authorization: `Bearer ${playerFour.jwt}` })
    .send();

  expectSuccessResponse(getPlayerFourGameResponseSecond);

  const getPlayerFourGameResponseBodySecond: api.Game =
    getPlayerFourGameResponseSecond.body;

  expect(
    getPlayerFourGameResponseBodySecond.players.find(
      (p) => p.userId === playerOne.user.userId
    )!.score
  ).toBe(1);
  expect(
    getPlayerFourGameResponseBodySecond.players.find(
      (p) => p.userId === playerTwo.user.userId
    )!.score
  ).toBe(0);
  expect(
    getPlayerFourGameResponseBodySecond.players.find(
      (p) => p.userId === playerThree.user.userId
    )!.score
  ).toBe(0);
  expect(
    getPlayerFourGameResponseBodySecond.players.find(
      (p) => p.userId === playerFour.user.userId
    )!.score
  ).toBe(0);

  const finishGameResponse = await testHelpers.api
    .post(`/game/${createGameResponseBody.id}/finish`)
    .set({ Authorization: `Bearer ${playerOne.jwt}` })
    .send();

  expect(finishGameResponse).toBeTruthy();
});
