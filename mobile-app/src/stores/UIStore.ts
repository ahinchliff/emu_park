import { action, makeObservable, observable } from "mobx";
import { Api, Sockets } from "../clients";
import BaseStore from "./BaseStore";

export default class UIStore extends BaseStore {
  @observable
  public unhandledError: any;

  constructor(api: Api, sockets: Sockets) {
    super(api, sockets);
    makeObservable(this, {
      unhandledError: observable,
      setUnhandledError: action,
      clearUnhandledError: action,
    });
  }

  public setUnhandledError = (error: any) => (this.unhandledError = error);

  public clearUnhandledError = () => (this.unhandledError = undefined);
}
