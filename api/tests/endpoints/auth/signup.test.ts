import {
  expectGeneralBadRequestResponse,
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

describe("Api -> /auth/signup", () => {
  it("When valid request, expect success response", async () => {
    const username = "ant";
    const requestBody: api.SignupRequestBody = { username };
    const response = await testHelpers.api
      .post("/auth/signup")
      .send(requestBody);
    expectSuccessResponse(response);
  });

  it('When signing up with taken username, expect "general bad request"', async () => {
    const username = "ant";

    await testHelpers.dataClients.user.create({ username, password: "abc123" });

    const requestBody: api.SignupRequestBody = { username };
    const response = await testHelpers.api
      .post("/auth/signup")
      .send(requestBody);

    expectGeneralBadRequestResponse(response);
  });
});
