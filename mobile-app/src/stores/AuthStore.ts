import { action, observable } from "mobx";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import BaseStore from "./BaseStore";
import { IAuthClient } from "../typings/auth-client";
import Api from "../api";
import CognitoAuthClient from "../api/auth-client";

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

  @observable
  public me: api.AuthUser | undefined;

  constructor(api: Api) {
    super(api);
    this.authClient = new CognitoAuthClient();
    this.initAuthTokens();
    this.startAuthTokenExpiryCheck();
  }

  public signup = async (email: string, password: string) =>
    this.authClient.signup(email, password);

  public confirmEmailAndLogin = async (
    email: string,
    password: string,
    code: string
  ) => {
    await this.authClient.confirmEmail(email, code);
    const loginResult = await this.authClient.login(email, password);
    await this.onNewTokens(loginResult);
    this.me = await this.api.signup({
      email,
    });
  };

  public login = async (email: string, password: string): Promise<void> => {
    const result = await this.authClient.login(email, password);
    await this.onNewTokens(result);
    this.me = await this.api.getMe();
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

  @action
  public initAuthTokens = async () => {
    await this.setAuthTokensFromLocalStore();
    if (!this.authTokens) {
      return console.log("AuthStore - No tokens in local store.");
    }

    if (
      this.authTokenHasExpiredOrExpiresInLessThenTenMinutes(
        this.authTokens.expiry
      )
    ) {
      console.log(
        "AuthStore - Auth token is expiring soon or has already expired. Attempting to refresh session with refresh token."
      );

      try {
        await this.refreshSession();

        console.log(
          "AuthStore - Successfully refreshed session and fetched user."
        );
      } catch (e) {
        console.log("AuthStore - Failed to refresh session.");
        // clear local state everything and this.me
      }
    } else {
      console.log(
        "AuthStore - Auth token is valid for at least ten more minutes. Using current auth token."
      );
    }
  };

  private refreshSession = async () => {
    if (this.authTokens) {
      const result = await this.authClient.refreshSession(
        this.authTokens.email,
        this.authTokens.refreshToken
      );
      await this.onNewTokens(result);
    }
  };

  private authTokenHasExpiredOrExpiresInLessThenTenMinutes = (
    expiryString: string
  ): boolean => {
    const inTenMinutes = moment().add(10, "minutes");
    const expiry = moment(expiryString);
    return !expiry.isAfter(inTenMinutes);
  };

  private onNewTokens = async (authTokens: AuthTokens) => {
    this.authTokens = authTokens;
    await this.saveAuthTokensToLocalStore(authTokens);
    this.api.setAuthorization(authTokens.authToken);
  };

  private startAuthTokenExpiryCheck = () => {
    console.log(
      `AuthStore - Scheduling auth token expiry check every ${
        CHECK_TOKEN_EXPIRY_INTERVAL_IN_MILLISECONDS / 60 / 1000
      } minutes.`
    );
    setInterval(() => {
      console.log(
        "AuthStore - Checking if auth token have expired or is about to expire."
      );
      if (
        this.authTokens &&
        this.authTokenHasExpiredOrExpiresInLessThenTenMinutes(
          this.authTokens.expiry
        )
      ) {
        console.log("AuthStore - Auth token is about to expire. Refreshing...");
        try {
          this.refreshSession();
        } catch (e) {
          console.log("AuthStore - Failed to refresh auth tokens.");
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

  private setAuthTokensFromLocalStore = async (): Promise<void> => {
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
      this.authTokens = {
        authToken,
        refreshToken,
        expiry,
        email,
      };
    }
  };
}
