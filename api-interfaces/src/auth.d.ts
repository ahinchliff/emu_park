declare namespace api {
  type AuthToken = {
    userId: number;
  };

  type AuthUser = {} & api.User;

  type SignupRequestBody = {
    username: string;
  };

  type SignupResponseBody = AuthUser & {
    password: string;
  };

  type LoginRequestBody = {
    userId: number;
    password: string;
  };

  type LoginResponseBody = {
    token: string;
  };
}
