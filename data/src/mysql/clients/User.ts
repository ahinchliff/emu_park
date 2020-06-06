import { Pool, RowDataPacket } from "mysql2/promise";
import EntityClientBase from "./base/EntityClientBase";
import { rowExtractor } from "./utils";

export default class UserClient
  extends EntityClientBase<"user", data.User, data.NewUser>
  implements data.UserClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super("user", pool, logger, logValues, mapper, "userId");
  }
}

const mapper = (row: RowDataPacket): data.User => {
  const user = rowExtractor("user", row);
  return {
    userId: user("userId"),
    authId: user("authId"),
  };
};
