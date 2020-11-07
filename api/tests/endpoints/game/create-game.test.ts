import {
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

describe("Api -> POST /game", () => {
  it("When not logged in, expect 401 response", async () => {
    const response = await testHelpers.api.post("/game").send();
    expectNotAuthorisedResponse(response);
  });

  it("When request is valid with 'toFinishAt' set to undefined, expect a new game with correct properties", async () => {
    const loginResult = await createUserAndLogin(testHelpers);
    const title = "Awesome Game";

    const request: api.CreateGameRequestBody = {
      title,
      toFinishAt: undefined,
    };

    const response = await testHelpers.api
      .post("/game")
      .set({ Authorization: `Bearer ${loginResult.jwt}` })
      .send(request);

    expectSuccessResponse(response);

    const responseBody: api.Game = response.body;

    expect(responseBody.ownerId).toBe(loginResult.user.userId);
    expect(responseBody.title).toBe(title);
    expect(responseBody.players).toHaveLength(1);
    expect(responseBody.toFinishAt).toBeUndefined();
  });

  it("When request is valid with 'toFinishAt' set to a time in future, expect a new game with correct properties", async () => {
    const loginResult = await createUserAndLogin(testHelpers);
    const title = "Awesome Game";

    const request: api.CreateGameRequestBody = {
      title,
      toFinishAt: "2022-01-01T00:00:00+0000",
    };

    const response = await testHelpers.api
      .post("/game")
      .set({ Authorization: `Bearer ${loginResult.jwt}` })
      .send(request);

    expectSuccessResponse(response);

    const responseBody: api.Game = response.body;

    expect(responseBody.ownerId).toBe(loginResult.user.userId);
    expect(responseBody.title).toBe(title);
    expect(responseBody.players).toHaveLength(1);
    expect(responseBody.toFinishAt).toBeTruthy();
  });

  it('When "toFinishAt" is set to a time in past, expect "general bad request"', async () => {
    const loginResult = await createUserAndLogin(testHelpers);
    const title = "Awesome Game";

    const request: api.CreateGameRequestBody = {
      title,
      toFinishAt: "1999-01-01T00:00:00+0000",
    };

    const response = await testHelpers.api
      .post("/game")
      .set({ Authorization: `Bearer ${loginResult.jwt}` })
      .send(request);

    expectGeneralBadRequestResponse(response);
  });
});
