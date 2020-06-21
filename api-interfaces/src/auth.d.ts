declare namespace api {
  type AuthUser = { email: string } & api.User;

  type SignupBody = Pick<api.AuthUser, "email">;
}
