import {
  expectNoFoundResponse,
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

describe("Api -> /auth/login", () => {
  it("When valid request, expect success response", async () => {
    const PASSWORD = "abc123";

    const user = await testHelpers.dataClients.user.create({
      username: "ant",
      password: PASSWORD,
    });

    const requestBody: api.LoginRequestBody = {
      userId: user.userId,
      password: PASSWORD,
    };

    const response = await testHelpers.api
      .post("/auth/login")
      .send(requestBody);

    expectSuccessResponse(response);
  });

  it("When wrong password, expect 404", async () => {
    const user = await testHelpers.dataClients.user.create({
      username: "ant",
      password: "abc123",
    });

    const requestBody: api.LoginRequestBody = {
      userId: user.userId,
      password: "123abc",
    };

    const response = await testHelpers.api
      .post("/auth/login")
      .send(requestBody);

    expectNoFoundResponse(response);
  });
});
