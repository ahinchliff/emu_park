import UIStore from "./UIStore";
import { Api, Sockets } from "../clients";
import AuthStore from "./AuthStore";
import GameStore from "./GameStore";

export interface IStores {
  uiStore: UIStore;
  authStore: AuthStore;
}

export default class Stores implements IStores {
  public authStore: AuthStore;
  public uiStore: UIStore;
  public gameStore: GameStore;

  constructor(api: Api, sockets: Sockets) {
    this.authStore = new AuthStore(api, sockets);
    this.uiStore = new UIStore(api, sockets);
    this.gameStore = new GameStore(api, sockets);
  }
}
