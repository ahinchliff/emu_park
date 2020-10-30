declare namespace data {
  type NewUser = Pick<data.UserTable, "username" | "password">;

  type User = Pick<data.UserTable, "userId" | "username" | "password">;

  interface UserClient
    extends data.EntityClientBase<data.UserTable, NewUser, User> {}
}
