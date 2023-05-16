import { Router, useRouter } from "vue-router";
import { useMainStore } from "../stores/mainStore";
import { useGameStore } from "../stores/gameStore";
import { getSocket } from "./../client";
import { leading } from "../common/Lib";
import { EVENT, STEP } from "./Constants";
import gameData from "../assets/game-data/game-data-v2.json";

// TODO : END_STORY
class GameMasterManager {
  private static _instance: GameMasterManager;
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
    this._socket.on(EVENT.TEAM_VALIDATION, (arg) => {
      this._gameStore.data.games[this._gameStore.currentPart].gamemaster.answers[arg.teamId].status = 'valid';
      this._gameStore.totalTeamsFinished += 1;
    })
  }

  public async launchStory(chapterId: number) {
    console.log("GameMasterManager LAUNCH_STORY : ", chapterId)
    this._mainStore.chapterId = chapterId;
    this._gameStore.data = gameData;
    await this._router.push('/chapitre/' + leading(chapterId, 3));
    await this._socket.emit(EVENT.LAUNCH_STORY, {
      roomId: this._mainStore.roomId,
      chapterId: this._mainStore.getChapterId
    });
  }

  public async launchGame(gameId: number) {
    console.log("GameMasterManager LAUNCH_GAME : ", gameId)
    await this._gameStore.reset();
    this._mainStore.gameId = gameId;
    await this._router.push('/exercice/' + this._mainStore.getFullGameId);
    await this._socket.emit(EVENT.LAUNCH_GAME, {
      roomId: this._mainStore.roomId,
      gameId: this._mainStore.gameId //mainStore.getFullGameId
    });
  }

  public async startGame() {
    console.log("GameMasterManager START_GAME")
    this._gameStore.currentStep = STEP.PLAY;
    await this._socket.emit(EVENT.START_GAME, {
      roomId: this._mainStore.roomId,
      step: STEP.PLAY
    });
  }

  public async endGame() {
    console.log("GameMasterManager END_GAME")
    this._gameStore.currentStep = STEP.CONGRATS;
    await this._socket.emit(EVENT.END_GAME, {
      roomId: this._mainStore.roomId
    })
  }

  public async backStory() {
    console.log("GameMasterManager BACK_STORY")
    await this._router.push('/chapitre/' + this._mainStore.chapterId)
    await this._socket.emit(EVENT.BACK_STORY, {
      roomId: this._mainStore.roomId,
      gameId: this._mainStore.gameId
    });
  }

  public async gameValidation() {
    this._gameStore.currentStep = STEP.END;
    this._socket.emit(EVENT.GAME_VALIDATION, {
      roomId: this._mainStore.roomId,
      step: STEP.END
    })
  }
}

export let GameMasterManagerInstance:GameMasterManager;

export const mountGameMasterManagerInstance = (router: Router) => {
  GameMasterManagerInstance = GameMasterManager.Instance
  GameMasterManagerInstance._router = router
};
