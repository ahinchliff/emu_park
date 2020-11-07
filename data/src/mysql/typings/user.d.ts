declare namespace data {
  type NewUser = Pick<data.UserTable, "username" | "password" | "displayName">;

  type User = Pick<
    data.UserTable,
    "userId" | "username" | "password" | "displayName"
  >;

  interface UserClient
    extends data.EntityClientBase<data.UserTable, NewUser, User> {}
}
