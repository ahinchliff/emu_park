import { action, observable, makeObservable, runInAction } from "mobx";
import BaseStore from "./BaseStore";
import { Api, Sockets } from "../clients";

export default class GameStore extends BaseStore {
  constructor(api: Api, sockets: Sockets) {
    super(api, sockets);
    makeObservable(this, {
      myGames: observable,
      games: observable,
      fetchMyGames: action,
    });
  }

  public myGames: RemoteData<api.GameSearchResult> = {
    data: [],
    loading: false,
  };

  public games: Map<number, api.Game> = new Map();

  public fetchMyGames = async () => {
    this.myGames = {
      ...this.myGames,
      loading: true,
    };

    try {
      const data = await this.api.getMyGames();

      runInAction(
        () =>
          (this.myGames = {
            data,
            loading: false,
          })
      );
    } catch (error) {
      this.myGames = {
        ...this.myGames,
        loading: false,
      };

      throw error;
    }
  };

  public createGame = async (newGame: api.CreateGameRequestBody) => {
    const game = await this.api.createGame(newGame);
    runInAction(() => {
      this.games.set(game.id, game);
      this.myGames = {
        data: [...this.myGames.data, game],
        loading: false,
      };
    });
  };

  public joinGame = async (data: api.JoinGameRequestBody) => {
    const game = await this.api.joinGame(data);
    runInAction(() => {
      this.games.set(game.id, game);
      this.myGames = {
        data: [...this.myGames.data, game],
        loading: false,
      };
    });
  };
}
