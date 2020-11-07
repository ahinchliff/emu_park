import {
  createGameWithRandomOwner,
  createUserAndLogin,
  expectGeneralBadRequestResponse,
  expectNotAuthorisedResponse,
  expectSuccessResponse,
  initTestHelpers,
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

describe("Api -> POST /game/:gameId/join", () => {
  it("When not logged in, expect 401 response", async () => {
    const game = await createGameWithRandomOwner(testHelpers);
    const requestBody: api.JoinGameRequestBody = {
      joinCode: game.joinCode,
    };
    const response = await testHelpers.api
      .post(`/game/${game.gameId}/join`)
      .send(requestBody);
    expectNotAuthorisedResponse(response);
  });

  it("When request is valid, expect the returned game to have the joining player", async () => {
    const joiningUser = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);

    const requestBody: api.JoinGameRequestBody = {
      joinCode: game.joinCode,
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/join`)
      .set({ Authorization: `Bearer ${joiningUser.jwt}` })
      .send(requestBody);

    expectSuccessResponse(response);

    const responseBody: api.Game = response.body;

    expect(
      responseBody.players.find((pl) => pl.userId === joiningUser.user.userId)
    ).toBeTruthy();
  });

  it("When join code is incorrect, expect general bad request", async () => {
    const joiningUser = await createUserAndLogin(testHelpers);
    const game = await createGameWithRandomOwner(testHelpers);

    const requestBody: api.JoinGameRequestBody = {
      joinCode: "this is wrong",
    };

    const response = await testHelpers.api
      .post(`/game/${game.gameId}/join`)
      .set({ Authorization: `Bearer ${joiningUser.jwt}` })
      .send(requestBody);

    expectGeneralBadRequestResponse(response);
  });
});
