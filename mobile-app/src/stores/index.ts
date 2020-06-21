import UIStore from "./UIStore";
import Api from "../api";
import AuthStore from "./AuthStore";

export interface IStores {
  uiStore: UIStore;
  authStore: AuthStore;
}

export default class Stores implements IStores {
  public authStore: AuthStore;
  public uiStore: UIStore;

  constructor(api: Api) {
    this.authStore = new AuthStore(api);
    this.uiStore = new UIStore(api);
  }
}
