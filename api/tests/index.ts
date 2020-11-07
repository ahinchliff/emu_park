import * as supertest from "supertest";
import initApp from "../src/app";
import * as mysql from "../../data/src/mysql/index";
import Logger from "../../core-backend/src/logger";
import { Pool } from "mysql2/promise";
import { generateJWT, hashPassword } from "../src/utils/authUtils";

const JWT_SECRET = "superSecret";

export type TestHelpers = {
  api: supertest.SuperTest<supertest.Test>;
  mysqlPool: Pool;
  dataClients: data.DataClients;
  clearDatabase(): Promise<void>;
  tearDown(): Promise<void>;
};

export const initTestHelpers = async (): Promise<TestHelpers> => {
  const config: api.Config = {
    environment: "test",
    aws: {
      accountId: "",
      region: "",
    },
    mysql: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "r00t",
      database: "gotcha",
      connectionLimit: 10,
    },
    jwt: {
      secret: JWT_SECRET,
    },
  };

  const logger = new Logger("test");

  const mysqlPool = await mysql.initialise(config.mysql, logger);
  const dataClients = mysql.getClients(mysqlPool, logger, false);

  const services = (_logger: core.backend.Logger): api.Services => ({
    data: dataClients,
  });

  const app = initApp(config, services);
  const server = app.listen(3000);

  const api = supertest(server);

  const clearDatabase = async () => {
    await mysqlPool.query("DELETE FROM player");
    await mysqlPool.query("DELETE FROM game");
    await mysqlPool.query("DELETE FROM user");
  };

  return {
    api,
    mysqlPool: mysqlPool as Pool,
    dataClients,
    clearDatabase,
    tearDown: async () => {
      await mysqlPool.end();
      server.close();
    },
  };
};

export const createUserAndLogin = async (
  testHelpers: TestHelpers
): Promise<{ user: data.User; jwt: string }> => {
  const user = await createUser({}, testHelpers);

  const jwt = generateJWT({ userId: user.userId }, JWT_SECRET);

  return {
    user,
    jwt,
  };
};

export const createUser = async (
  data: Partial<data.User>,
  testHelpers: TestHelpers
) => {
  const user: Omit<data.User, "userId"> = {
    displayName: `display-name-${Math.random() * 100000}`,
    username: `test-user-${Math.random() * 100000}`,
    password: await hashPassword("password"),
    ...data,
  };

  return testHelpers.dataClients.user.create(user);
};

export const createGame = async (
  data: Pick<data.Game, "ownerId"> & Partial<data.Game>,
  testHelpers: TestHelpers
) => {
  const game: Omit<data.Game, "gameId"> = {
    title: `test-game-${Math.random() * 100000}`,
    joinCode: `test-join-code-${Math.random() * 100000}`,
    toFinishAt: undefined,
    startedAt: undefined,
    finishedAt: undefined,
    ...data,
  };

  return testHelpers.dataClients.game.create(game);
};

export const createUserAndAddAsGamePlayer = async (
  gameId: number,
  userData: Partial<data.User>,
  testHelpers: TestHelpers
) => {
  const user = await createUser(userData, testHelpers);

  return testHelpers.dataClients.player.create({ userId: user.userId, gameId });
};

export const createGameWithRandomOwner = async (testHelpers: TestHelpers) => {
  const user = await createUser({}, testHelpers);
  return createGame({ ownerId: user.userId }, testHelpers);
};

export const expectSuccessResponse = (response: supertest.Response) => {
  expect(response.status).toBe(200);
};

export const expectValidationBadRequestResponse = (
  response: supertest.Response
) => {
  expect(response.status).toBe(400);
  expect(response.body?.type).toBe("validation");
};

export const expectGeneralBadRequestResponse = (
  response: supertest.Response
) => {
  expect(response.status).toBe(400);
  expect(response.body?.type).toBe("general");
};

export const expectNoFoundResponse = (response: supertest.Response) => {
  expect(response.status).toBe(404);
};

export const expectNotAuthorisedResponse = (response: supertest.Response) => {
  expect(response.status).toBe(401);
};

export const expectForbiddenResponse = (response: supertest.Response) => {
  expect(response.status).toBe(403);
};
