declare namespace data {
  type User = {
    userId: number;
    username: string;
    password: string;
  };

  type NewUser = Pick<data.User, "username" | "password">;

  interface UserClient extends data.EntityClientBase<User, NewUser> {}
}
