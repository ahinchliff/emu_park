declare namespace api {
  type AuthToken = {
    userId: number;
    email: string;
    authId: string;
    expiry: number;
  };

  type AuthUser = { email: string } & api.User;

  type SignupBody = {};
}
