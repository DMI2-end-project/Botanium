import { Router, useRouter } from "vue-router";
import { useMainStore } from "../stores/mainStore";
import { useGameStore } from "../stores/gameStore";
import { getSocket } from "./../client";
import { leading } from "../common/Lib";
import { EVENT, STEP } from "./Constants";
import gameData from "../assets/game-data/game-data-v2.json";

// TODO : END_STORY
class TeamManager {
  private static _instance: TeamManager;
  private _mainStore = useMainStore();
  private _gameStore = useGameStore();
  public _router: Router = useRouter();
  private _socket = getSocket();

  private constructor() {
    this.initEventsListenners()
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }

  private initEventsListenners() {
    this._socket.on(EVENT.LAUNCH_STORY, async (arg) => {
      this._mainStore.chapterId = arg.chapterId;
      this._gameStore.data = gameData;
      await this._router.push('/chapitre/' + leading(arg.chapterId, 3));
    });

    this._socket.on(EVENT.LAUNCH_GAME, async (arg) => {
      await this._gameStore.reset();
      this._mainStore.gameId = arg.gameId
      this._gameStore.teamId = arg.teamId;
      localStorage.setItem('teamId', arg.teamId);
      await this._router.push('/exercice/' + this._mainStore.getFullGameId);
    });

    this._socket.on(EVENT.START_GAME, async () => {
      this._gameStore.currentStep = STEP.PLAY;
    });

    this._socket.on(EVENT.END_GAME, () => {
      this._gameStore.currentStep = STEP.CONGRATS;
      localStorage.removeItem('teamId');
    })

    this._socket.on(EVENT.BACK_STORY, async () => {
      await this._router.push('/chapitre/' + this._mainStore.getChapterId);
    })

    this._socket.on(EVENT.GAME_VALIDATION, () => {
      this._gameStore.currentStep = STEP.END;
    })
  }

  public teamValidation() {
    this._gameStore.currentStep = STEP.WAIT;
    this._socket.emit(EVENT.TEAM_VALIDATION, {
      roomId: this._mainStore.roomId,
      teamId: this._gameStore.teamId
    });
  }
}

export let TeamManagerInstance:TeamManager;

export const mountTeamManagerInstance = (router: Router) => {
  TeamManagerInstance = TeamManager.Instance
  TeamManagerInstance._router = router
};
