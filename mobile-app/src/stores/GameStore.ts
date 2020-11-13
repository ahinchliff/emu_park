import { action, observable, makeObservable, runInAction } from "mobx";
import BaseStore from "./BaseStore";
import { Api, Sockets } from "../clients";

export default class GameStore extends BaseStore {
  public myGames: RemoteData<api.GameSearchResult> = {
    data: [],
    loading: false,
  };
  public games: Map<number, api.Game> = new Map();

  constructor(api: Api, sockets: Sockets) {
    super(api, sockets);
    makeObservable(this, {
      myGames: observable,
      games: observable,
      fetchMyGames: action,
      startGame: action,
    });
  }

  public fetchGame = async (gameId: number) => {
    const game = await this.api.getGame(gameId);
    runInAction(() => {
      this.games.set(game.id, game);
      this.myGames = {
        data: addToOrReplaceInArray(game, this.myGames.data),
        loading: false,
      };
    });
  };

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
    return game;
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
    return game;
  };

  public startGame = async (gameId: number) => {
    const game = await this.api.startGame(gameId);
    runInAction(() => {
      this.games.set(game.id, game);
      this.myGames = {
        data: addToOrReplaceInArray(game, this.myGames.data),
        loading: false,
      };
    });
    return game;
  };

  public markMission = async (
    gameId: number,
    missionId: number,
    data: api.MarkMissionRequestBody
  ) => {
    const game = await this.api.markMission(gameId, missionId, data);
    runInAction(() => {
      this.games.set(game.id, game);
      this.myGames = {
        data: addToOrReplaceInArray(game, this.myGames.data),
        loading: false,
      };
    });
  };

  public finishGame = async (gameId: number) => {
    const game = await this.api.finishGame(gameId);
    runInAction(() => {
      this.games.set(game.id, game);
      this.myGames = {
        data: addToOrReplaceInArray(game, this.myGames.data),
        loading: false,
      };
    });
  };
}

const addToOrReplaceInArray = <T extends { id: number }>(
  item: T,
  currentItems: T[]
): T[] => {
  const indexOfCurrentItem = currentItems.findIndex((ci) => ci.id === item.id);

  if (indexOfCurrentItem < 0) {
    return [...currentItems, item];
  }

  currentItems.splice(indexOfCurrentItem, 1, item);

  return currentItems;
};
