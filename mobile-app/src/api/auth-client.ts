import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import {
  IAuthClient,
  AuthenticationResult,
  ResetPasswordError,
  LoginError,
  SignupError,
  ConfirmEmailError,
} from "../typings/auth-client";
import moment from "moment";

export default class CognitoAuthClient implements IAuthClient {
  private userPool: CognitoUserPool;
  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: "eu-west-1_wIXakbxs3",
      ClientId: "130kgqg7dqa21opkkcampp6g9g",
    });
  }

  public signup = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, [], [], (err) => {
        if (err) {
          reject(this.congnitoSignupErrorMessageToErrorMessage(err));
        } else {
          resolve();
        }
      });
    });
  };

  public confirmEmail = async (email: string, code: string) => {
    const cognitoUser = this.getCognitoUser(email);
    return new Promise<void>((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err) => {
        if (err) {
          reject(this.congnitoConfirmEmailErrorToConfirmEmailError(err));
        } else {
          resolve();
        }
      });
    });
  };

  public login = async (
    email: string,
    password: string
  ): Promise<AuthenticationResult> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCognitoUser(email);
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          resolve(this.cognitioUserSessionToAuthTokens(result));
        },
        onFailure: (err) => reject(this.congnitoLoginErrorToLoginError(err)),
      });
    });
  };

  public resendConfirmEmail = async (email: string) => {
    return new Promise<void>((resolve, reject) => {
      const cognitoUser = this.getCognitoUser(email);
      cognitoUser.resendConfirmationCode((error) => {
        if (error) {
          reject();
        } else {
          resolve();
        }
      });
    });
  };

  public refreshSession = async (
    email: string,
    refreshToken: string
  ): Promise<AuthenticationResult> => {
    const cognitoUser = this.getCognitoUser(email);
    const token = new CognitoRefreshToken({ RefreshToken: refreshToken });
    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(token, (error, result) => {
        if (error) {
          reject({ message: "unknown-error", serviceMessage: error.message });
        } else {
          resolve(this.cognitioUserSessionToAuthTokens(result));
        }
      });
    });
  };

  public requestPasswordResetCode = async (email: string): Promise<void> => {
    const cognitoUser = this.getCognitoUser(email);
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: () => {
          resolve();
        },
        onFailure: () => {
          reject();
        },
      });
    });
  };

  public resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> => {
    const cognitoUser = this.getCognitoUser(email);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => {
          resolve();
        },
        onFailure: (err) => {
          reject(this.congnitoResetPasswordErrorToResetPasswordError(err));
        },
      });
    });
  };

  private getCognitoUser = (email: string) => {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    return new CognitoUser(userData);
  };

  private cognitioUserSessionToAuthTokens = (
    x: CognitoUserSession
  ): AuthenticationResult => {
    const accessToken = x.getAccessToken();
    const refreshToken = x.getRefreshToken();
    const idToken = x.getIdToken();

    return {
      success: true,
      authToken: accessToken.getJwtToken(),
      refreshToken: refreshToken.getToken(),
      expiry: moment.unix(accessToken.getExpiration()).utc().format(),
      email: idToken.decodePayload().email,
    };
  };

  private congnitoSignupErrorMessageToErrorMessage = (e: any): SignupError => {
    const code = (() => {
      switch (e.code) {
        case "InvalidPasswordException":
          return "invalid-password";
        case "UsernameExistsException":
          return "username-taken";
        default:
          return "unknown-error";
      }
    })();

    return this.toError(e, code);
  };

  private congnitoLoginErrorToLoginError = (e: any): LoginError => {
    const code = (() => {
      switch (e.code) {
        case "UserNotConfirmedException":
          return "email-not-confirmed";
        case "NotAuthorizedException":
          return "account-not-found";
        default:
          return "unknown-error";
      }
    })();

    return this.toError(e, code);
  };

  private congnitoResetPasswordErrorToResetPasswordError = (
    err: any
  ): ResetPasswordError => {
    const code = (() => {
      switch (err.code) {
        case "ExpiredCodeException":
          return "code-expired";
        case "CodeMismatchException":
          return "code-invalid";
        case "InvalidPasswordException":
          return "password-invalid";
        case "LimitExceededException":
          return "reached-max-attempts";
        default:
          return "unknown-error";
      }
    })();

    return this.toError(err, code);
  };

  private congnitoConfirmEmailErrorToConfirmEmailError = (
    err: any
  ): ConfirmEmailError => {
    const code = (() => {
      switch (err.code) {
        case "CodeMismatchException":
          return "code-invalid";
        default:
          return "unknown-error";
      }
    })();

    return this.toError(err, code);
  };

  private toError = <T>(err: any, code: T) => ({
    code,
    message: `${err.code} - ${err.message}`,
  });
}
