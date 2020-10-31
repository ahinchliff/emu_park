import * as supertest from "supertest";
import initApp from "../src/app";
import * as mysql from "../../data/src/mysql/index";
import Logger from "../../core-backend/src/logger";
import { Pool } from "mysql2/promise";
import { generateJWT } from "../src/utils/authUtils";

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
  const user = await testHelpers.dataClients.user.create({
    username: "ant",
    password: "abc123",
  });

  const jwt = generateJWT({ userId: user.userId }, JWT_SECRET);

  return {
    user,
    jwt,
  };
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
