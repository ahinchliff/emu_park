import {
  createGame,
  createGameWithRandomOwner,
  createUser,
  createUserAndAddAsGamePlayer,
  createUserAndLogin,
  expectForbiddenResponse,
  expectGeneralBadRequestResponse,
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

describe("Api -> POST /game/:gameId/finish", () => {
  it("When not logged in, expect 401 response", async () => {
    const gameOwner = await createUser({}, testHelpers);
    const game = await createGame({ ownerId: gameOwner.userId }, testHelpers);

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/finish`)
      .send();

    expectNotAuthorisedResponse(response);
  });

  it("When user is not owner of game, expect 403 response", async () => {
    const user = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/finish`)
      .set({ Authorization: `Bearer ${user.jwt}` })
      .send();

    expectForbiddenResponse(response);
  });

  it("when game hasn't started, expect general bad request response", async () => {
    const owner = await createUserAndLogin(testHelpers);
    const game = await createGame({ ownerId: owner.user.userId }, testHelpers);
    await createUserAndAddAsGamePlayer(game.gameId, {}, testHelpers);

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/finish`)
      .set({ Authorization: `Bearer ${owner.jwt}` })
      .send();

    expectGeneralBadRequestResponse(response);
  });

  it("When request is valid, expect success response", async () => {
    const owner = await createUserAndLogin(testHelpers);
    const game = await createGame({ ownerId: owner.user.userId }, testHelpers);
    await createUserAndAddAsGamePlayer(game.gameId, {}, testHelpers);

    await startGame(game.gameId, testHelpers);

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/finish`)
      .set({ Authorization: `Bearer ${owner.jwt}` })
      .send();

    expectSuccessResponse(response);
    const responseBody: api.Game = response.body;
    expect(responseBody.finishedAt).toBeTruthy();
  });
});