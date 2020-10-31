import { expectSuccessResponse, initTestHelpers, TestHelpers } from "../";

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

test("Api -> Auth Flow", async () => {
  const username = "ant";
  const signupRequestBody: api.SignupRequestBody = { username };
  const signupResponse = await testHelpers.api
    .post("/auth/signup")
    .send(signupRequestBody);
  expectSuccessResponse(signupResponse);
  const signupResponseBody = signupResponse.body as api.SignupResponseBody;
  const { id, password } = signupResponseBody;
  expect(password).toBeTruthy();

  const loginRequestBody: api.LoginRequestBody = { userId: id, password };
  const loginResponse = await testHelpers.api
    .post("/auth/login")
    .send(loginRequestBody);
  expectSuccessResponse(loginResponse);
  const loginResponseBody: api.LoginResponseBody = loginResponse.body;
  const { token } = loginResponseBody;
  expect(password).toBeTruthy();

  const getMeResponse = await testHelpers.api
    .get("/auth/me")
    .set({ Authorization: `Bearer ${token}` })
    .send();
  expectSuccessResponse(getMeResponse);

  const getMeResponeBody: api.AuthUser = getMeResponse.body;
  expect(getMeResponeBody.id).toBe(id);
  expect(getMeResponeBody.username).toBe(username);
});
