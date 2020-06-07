import UserStore from "./UserStore";
import Api from "../api";

export interface IStores {
  userStore: UserStore;
}

export default class Stores implements IStores {
  public userStore: UserStore;

  constructor(api: Api) {
    this.userStore = new UserStore(api);
  }
}
