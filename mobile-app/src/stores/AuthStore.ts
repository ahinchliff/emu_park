import { action, observable } from "mobx";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import BaseStore from "./BaseStore";
import { Api, Auth, IAuthClient, Sockets } from "../clients";

const AUTH_TOKEN_LOCAL_STORE_KEY = "auth-token";
const REFRESH_TOKEN_LOCAL_STORE_KEY = "refresh-token";
const AUTH_TOKEN_EXPIRY_LOCAL_STORE_KEY = "auth-token-expiry";
const USER_EMAIL_ADDRESS_LOCAL_STORE_KEY = "user-email-address";
const CHECK_TOKEN_EXPIRY_INTERVAL_IN_MILLISECONDS = 300000; // five minutes

type AuthTokens = {
  authToken: string;
  refreshToken: string;
  expiry: string;
  email: string;
};

export default class AuthStore extends BaseStore {
  private authClient: IAuthClient;
  private authTokens: AuthTokens | undefined;
  private authTokenExpiryIntervalTimer: number | undefined;

  @observable
  public me: api.AuthUser | undefined;

  constructor(api: Api, sockets: Sockets) {
    super(api, sockets);
    this.authClient = new Auth();
  }

  public signup = async (email: string, password: string) =>
    this.authClient.signup(email, password);

  @action
  public confirmEmailAndLogin = async (
    email: string,
    password: string,
    code: string
  ) => {
    await this.authClient.confirmEmail(email, code);
    const loginResult = await this.authClient.login(email, password);
    await this.onSetTokens(loginResult, true);
    this.me = await this.api.signup({
      email,
    });
  };

  public login = async (email: string, password: string): Promise<void> => {
    const result = await this.authClient.login(email, password);
    await this.onSetTokens(result);
  };

  public resendConfirmationEmail = async (email: string) =>
    this.authClient.resendConfirmEmail(email);

  public requestPasswordResetCode = async (email: string) =>
    this.authClient.requestPasswordResetCode(email);

  public resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => this.authClient.resetPassword(email, code, newPassword);

  public initAuth = async () => {
    await this.initAuthTokens();
    this.startAuthTokenExpiryCheck();
  };

  public stopAuthTokenExpiryCheck = () => {
    clearInterval(this.authTokenExpiryIntervalTimer);
  };

  @action
  private initAuthTokens = async () => {
    const authTokens = await this.getAuthTokensFromLocalStore();
    if (!authTokens) {
      return console.log("AuthStore - No tokens in local store.");
    }

    if (
      this.authTokenHasExpiredOrExpiresInLessThenTenMinutes(authTokens.expiry)
    ) {
      console.log(
        "AuthStore - Auth token is expiring soon or has already expired. Attempting to refresh session with refresh token."
      );

      try {
        await this.refreshSession(authTokens);

        console.log(
          "AuthStore - Successfully refreshed session and fetched user."
        );
      } catch (e) {
        console.log("AuthStore - Failed to refresh session.");
        await this.logout();
      }
    } else {
      console.log(
        "AuthStore - Auth token is valid for at least ten more minutes. Using current auth token."
      );
      this.onSetTokens(authTokens);
    }
  };

  @action
  public logout = async () => {
    this.me = undefined;
    this.api.clearAuthorization();
    await SecureStore.deleteItemAsync(AUTH_TOKEN_LOCAL_STORE_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_LOCAL_STORE_KEY);
    await SecureStore.deleteItemAsync(AUTH_TOKEN_EXPIRY_LOCAL_STORE_KEY);
    await SecureStore.deleteItemAsync(USER_EMAIL_ADDRESS_LOCAL_STORE_KEY);
  };

  private refreshSession = async (authTokens: AuthTokens) => {
    const result = await this.authClient.refreshSession(
      authTokens.email,
      authTokens.refreshToken
    );

    await this.onSetTokens(result);
  };

  private authTokenHasExpiredOrExpiresInLessThenTenMinutes = (
    expiryString: string
  ): boolean => {
    const inTenMinutes = moment().add(10, "minutes");
    const expiry = moment(expiryString);
    return !expiry.isAfter(inTenMinutes);
  };

  @action
  private onSetTokens = async (
    authTokens: AuthTokens,
    withoutFetchUser?: boolean
  ) => {
    this.authTokens = authTokens;
    await this.saveAuthTokensToLocalStore(authTokens);
    this.api.setAuthorization(authTokens.authToken);
    this.sockets.setAuthorization(authTokens.authToken);
    if (!withoutFetchUser) {
      this.me = await this.api.getMe();
    }
  };

  private startAuthTokenExpiryCheck = () => {
    console.log(
      `AuthStore - Scheduling auth token expiry check every ${
        CHECK_TOKEN_EXPIRY_INTERVAL_IN_MILLISECONDS / 60 / 1000
      } minutes.`
    );
    this.authTokenExpiryIntervalTimer = setInterval(async () => {
      console.log(
        "AuthStore - Checking if auth token have expired or is about to expire."
      );

      const authTokens =
        this.authTokens || (await this.getAuthTokensFromLocalStore());
      if (
        authTokens &&
        this.authTokenHasExpiredOrExpiresInLessThenTenMinutes(authTokens.expiry)
      ) {
        console.log("AuthStore - Auth token is about to expire. Refreshing...");
        try {
          this.refreshSession(authTokens);
        } catch (e) {
          console.log("AuthStore - Failed to refresh auth tokens.");
          this.logout();
        }
      }
    }, CHECK_TOKEN_EXPIRY_INTERVAL_IN_MILLISECONDS);
  };

  private saveAuthTokensToLocalStore = async (authTokens: AuthTokens) => {
    await SecureStore.setItemAsync(
      AUTH_TOKEN_LOCAL_STORE_KEY,
      authTokens.authToken
    );
    await SecureStore.setItemAsync(
      REFRESH_TOKEN_LOCAL_STORE_KEY,
      authTokens.refreshToken
    );
    await SecureStore.setItemAsync(
      AUTH_TOKEN_EXPIRY_LOCAL_STORE_KEY,
      authTokens.expiry
    );
    await SecureStore.setItemAsync(
      USER_EMAIL_ADDRESS_LOCAL_STORE_KEY,
      authTokens.email
    );
  };

  private getAuthTokensFromLocalStore = async (): Promise<
    AuthTokens | undefined
  > => {
    const authToken = await SecureStore.getItemAsync(
      AUTH_TOKEN_LOCAL_STORE_KEY
    );
    const refreshToken = await SecureStore.getItemAsync(
      REFRESH_TOKEN_LOCAL_STORE_KEY
    );
    const expiry = await SecureStore.getItemAsync(
      AUTH_TOKEN_EXPIRY_LOCAL_STORE_KEY
    );
    const email = await SecureStore.getItemAsync(
      USER_EMAIL_ADDRESS_LOCAL_STORE_KEY
    );

    if (authToken && refreshToken && expiry && email) {
      return {
        authToken,
        refreshToken,
        expiry,
        email,
      };
    }

    return undefined;
  };
}
