import { action, observable } from "mobx";
import BaseStore from "./BaseStore";

export default class AuthStore extends BaseStore {
  @observable
  public unhandledError: any;

  @action
  public setUnhandledError = (error: any) => (this.unhandledError = error);

  @action
  public clearUnhandledError = () => (this.unhandledError = undefined);
}
