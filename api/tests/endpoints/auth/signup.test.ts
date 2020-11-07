import { expectSuccessResponse, initTestHelpers, TestHelpers } from "../..";

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

describe("Api -> POST /auth/signup", () => {
  it("When valid request, expect success response", async () => {
    const displayName = "ant";
    const requestBody: api.SignupRequestBody = { displayName };
    const response = await testHelpers.api
      .post("/auth/signup")
      .send(requestBody);
    expectSuccessResponse(response);
  });
});
