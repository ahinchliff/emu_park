import {
  createUser,
  expectNotFoundResponse,
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

describe("Api -> POST /auth/login", () => {
  it("When valid request, expect success response", async () => {
    const user = await createUser({}, testHelpers);

    const requestBody: api.LoginRequestBody = {
      username: user.username,
      password: "password",
    };

    const response = await testHelpers.api
      .post("/auth/login")
      .send(requestBody);

    expectSuccessResponse(response);
  });

  it("When wrong password, expect 404", async () => {
    const user = await createUser({}, testHelpers);

    const requestBody: api.LoginRequestBody = {
      username: user.username,
      password: "123abc",
    };

    const response = await testHelpers.api
      .post("/auth/login")
      .send(requestBody);

    expectNotFoundResponse(response);
  });
});
