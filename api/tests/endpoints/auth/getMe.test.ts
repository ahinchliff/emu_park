import {
  createUserAndLogin,
  expectNotAuthorisedResponse,
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

describe("Api -> /auth/me", () => {
  it("When not logged in, expect 401 response", async () => {
    const response = await testHelpers.api.get("/auth/me").send();
    expectNotAuthorisedResponse(response);
  });

  it("When logged in, return correct user", async () => {
    const loginResult = await createUserAndLogin(testHelpers);
    const response = await testHelpers.api
      .get("/auth/me")
      .set({ Authorization: `Bearer ${loginResult.jwt}` })
      .send();

    expect(response.body.id).toBe(loginResult.user.userId);
  });
});
