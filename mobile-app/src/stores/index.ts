import UIStore from "./UIStore";
import { Api, Sockets } from "../clients";
import AuthStore from "./AuthStore";

export interface IStores {
  uiStore: UIStore;
  authStore: AuthStore;
}

export default class Stores implements IStores {
  public authStore: AuthStore;
  public uiStore: UIStore;

  constructor(api: Api, sockets: Sockets) {
    this.authStore = new AuthStore(api, sockets);
    this.uiStore = new UIStore(api, sockets);
  }
}
