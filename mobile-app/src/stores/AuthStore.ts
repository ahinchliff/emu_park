import { action, observable, makeObservable } from "mobx";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import BaseStore from "./BaseStore";
import { Api, Sockets } from "../clients";

const USER_USERNAME_LOCAL_STORE_KEY = "user-username";
const USER_PASSWORD_LOCAL_STORE_KEY = "user-password";
const AUTH_TOKEN_LOCAL_STORE_KEY = "auth-token";
const AUTH_TOKEN_EXPIRY_LOCAL_STORE_KEY = "auth-token-expiry";
const CHECK_TOKEN_EXPIRY_INTERVAL_IN_MILLISECONDS = 300000; // five minutes

type AuthDetails = {
  token: string;
  expiry: string;
};

export default class AuthStore extends BaseStore {
  private authDetails: AuthDetails | undefined;
  private authTokenExpiryIntervalTimer: number | undefined;

  public me: api.AuthUser | undefined = undefined;

  constructor(api: Api, sockets: Sockets) {
    super(api, sockets);
    makeObservable(this, {
      me: observable,
      initAuth: action,
      logout: action,
      onAuthDetailsChange: action,
    });
    this.listenForTestMessages();
  }

  public signup = async (data: api.SignupRequestBody) => {
    const signupResult = await this.api.signup(data);
    await SecureStore.setItemAsync(
      USER_USERNAME_LOCAL_STORE_KEY,
      signupResult.username
    );
    await SecureStore.setItemAsync(
      USER_PASSWORD_LOCAL_STORE_KEY,
      signupResult.password
    );
  };

  public login = async () => {
    const username = await SecureStore.getItemAsync(
      USER_USERNAME_LOCAL_STORE_KEY
    );
    const password = await SecureStore.getItemAsync(
      USER_PASSWORD_LOCAL_STORE_KEY
    );

    if (!username || !password) {
      throw new Error(
        "trying to login when no username or password in secure store"
      );
    }
    const loginResult = await this.api.login({ username, password });
    await this.onAuthDetailsChange(loginResult);
  };

  public initAuth = async () => {
    await this.initAuthTokens();
    if (this.authDetails) {
      this.me = await this.api.getMe();
    }
    this.startAuthTokenExpiryCheck();
  };

  public stopAuthTokenExpiryCheck = () => {
    clearInterval(this.authTokenExpiryIntervalTimer);
  };

  public logout = async () => {
    this.me = undefined;
    this.api.clearAuthorization();
    await SecureStore.deleteItemAsync(USER_USERNAME_LOCAL_STORE_KEY);
    await SecureStore.deleteItemAsync(USER_PASSWORD_LOCAL_STORE_KEY);
    await SecureStore.deleteItemAsync(AUTH_TOKEN_LOCAL_STORE_KEY);
    await SecureStore.deleteItemAsync(AUTH_TOKEN_EXPIRY_LOCAL_STORE_KEY);
  };

  private initAuthTokens = async () => {
    const authDetails = await this.getAuthTokensFromLocalStore();

    if (!authDetails) {
      return console.log("AuthStore - No tokens in local store.");
    }

    if (this.authTokenHasExpiredOrExpiresInLessThan3Days(authDetails.expiry)) {
      await this.login();
    } else {
      await this.onAuthDetailsChange(authDetails);
    }
  };

  public onAuthDetailsChange = async (authDetails: AuthDetails) => {
    this.authDetails = authDetails;
    await this.saveAuthTokensToLocalStore(authDetails);
    this.api.setAuthorization(authDetails.token);
    this.sockets.setAuthorization(authDetails.token);
    this.me = await this.api.getMe();
  };

  private authTokenHasExpiredOrExpiresInLessThan3Days = (
    expiryString: string
  ): boolean => {
    const inThreeDays = moment().add(3, "days");
    const expiry = moment(expiryString);
    return !expiry.isAfter(inThreeDays);
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
        this.authDetails || (await this.getAuthTokensFromLocalStore());
      if (
        authTokens &&
        this.authTokenHasExpiredOrExpiresInLessThan3Days(authTokens.expiry)
      ) {
        console.log("AuthStore - Auth token is about to expire. Refreshing...");
        this.login();
      }
    }, CHECK_TOKEN_EXPIRY_INTERVAL_IN_MILLISECONDS);
  };

  private saveAuthTokensToLocalStore = async (authTokens: AuthDetails) => {
    await SecureStore.setItemAsync(
      AUTH_TOKEN_LOCAL_STORE_KEY,
      authTokens.token
    );
    await SecureStore.setItemAsync(
      AUTH_TOKEN_EXPIRY_LOCAL_STORE_KEY,
      authTokens.expiry
    );
  };

  private getAuthTokensFromLocalStore = async (): Promise<
    AuthDetails | undefined
  > => {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_LOCAL_STORE_KEY);

    const expiry = await SecureStore.getItemAsync(
      AUTH_TOKEN_EXPIRY_LOCAL_STORE_KEY
    );

    if (token && expiry) {
      return {
        token,
        expiry,
      };
    }

    return undefined;
  };

  public subscribeToUserEvents = () => {
    if (this.me) {
      this.sockets.subscribe("ME");
    }
  };

  private listenForTestMessages = () => {
    console.log("listening for test event");
    this.sockets.addOnEvent("TEST_EVENT", (body: any) => {
      console.log(body);
    });
  };
}
