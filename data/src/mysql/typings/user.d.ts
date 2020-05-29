declare namespace data {
  interface User {
    userId: number;
    authId: string;
  }

  interface NewUser {
    authId: string;
    email: string;
  }

  interface UserClient extends data.EntityClientBase<User, NewUser> {}
}
