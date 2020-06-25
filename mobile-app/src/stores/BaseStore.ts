import { Api, Sockets } from "../clients";

export default class BaseStore {
  constructor(protected api: Api, protected sockets: Sockets) {}
}
