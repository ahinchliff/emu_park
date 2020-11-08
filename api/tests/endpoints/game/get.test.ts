import {
  addUserAsGamePlayer,
  createGameWithRandomOwner,
  createUserAndAddAsGamePlayer,
  createUserAndLogin,
  expectForbiddenResponse,
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

describe("Api -> GET /game/:gameId", () => {
  it("When not logged in, expect 401 response", async () => {
    const game = await createGameWithRandomOwner(testHelpers);

    const response = await testHelpers.api.get(`/game/${game.gameId}`).send();

    expectNotAuthorisedResponse(response);
  });

  it("When user is not a player of game, expect 403 response", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    await createUserAndAddAsGamePlayer(game.gameId, {}, testHelpers);

    const response = await testHelpers.api
      .get(`/game/${game.gameId}`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send();

    expectForbiddenResponse(response);
  });

  it("When game has not started, expect correct number of players but no missions", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    addUserAsGamePlayer(game.gameId, user.user.userId, testHelpers);

    const randomNumberOfPlayers = Math.floor(Math.random() * 5);

    for (let i = 0; i < randomNumberOfPlayers; i++) {
      await createUserAndAddAsGamePlayer(game.gameId, {}, testHelpers);
    }

    const response = await testHelpers.api
      .get(`/game/${game.gameId}`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send();

    expectSuccessResponse(response);

    const responseBody: api.Game = response.body;

    expect(responseBody.players.length).toBe(randomNumberOfPlayers + 2);
    expect(responseBody.myMissions.length).toBe(0);
  });

  it("When game has started, expect correct number of players and missions", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);
    addUserAsGamePlayer(game.gameId, user.user.userId, testHelpers);

    const randomNumberOfPlayers = Math.floor(Math.random() * 5);

    for (let i = 0; i < randomNumberOfPlayers; i++) {
      await createUserAndAddAsGamePlayer(game.gameId, {}, testHelpers);
    }

    await startGame(game.gameId, testHelpers);

    const response = await testHelpers.api
      .get(`/game/${game.gameId}`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send();

    expectSuccessResponse(response);

    const responseBody: api.Game = response.body;

    expect(responseBody.players.length).toBe(randomNumberOfPlayers + 2);
    expect(responseBody.myMissions.length).toBe(5);
  });
});
