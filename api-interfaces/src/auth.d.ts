declare namespace api {
  type AuthToken = {
    userId: number;
  };

  type AuthUser = {} & api.User;

  type SignupRequestBody = {
    displayName: string;
  };

  type SignupResponseBody = {
    username: string;
    password: string;
  };

  type LoginRequestBody = {
    username: string;
    password: string;
  };

  type LoginResponseBody = {
    token: string;
    expiry: string;
  };
}
