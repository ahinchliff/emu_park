export type AuthClientError<T> = {
  code: T | "unknown-error";
  message: string;
};

type SignupErrorCode = "username-taken" | "invalid-password";

type LoginErrorCode = "email-not-confirmed" | "account-not-found";

type ResetPasswordErrorCode =
  | "code-expired"
  | "code-invalid"
  | "password-invalid"
  | "reached-max-attempts";

type ConfirmEmailErrorCode = "code-invalid";

export type SignupError = AuthClientError<SignupErrorCode>;
export type LoginError = AuthClientError<LoginErrorCode>;
export type ResetPasswordError = AuthClientError<ResetPasswordErrorCode>;
export type ConfirmEmailError = AuthClientError<ConfirmEmailErrorCode>;

export type AuthenticationResult = {
  success: true;
  authToken: string;
  refreshToken: string;
  email: string;
  expiry: string;
};

export interface IAuthClient {
  signup(email: string, password: string): Promise<void>;
  confirmEmail(email: string, code: string): Promise<void>;
  login(email: string, password: string): Promise<AuthenticationResult>;
  refreshSession(
    email: string,
    refreshToken: string
  ): Promise<AuthenticationResult>;
  resendConfirmEmail(email: string): Promise<void>;
  requestPasswordResetCode(email: string): Promise<void>;
  resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<void>;
}
