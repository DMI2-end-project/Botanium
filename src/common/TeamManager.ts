import {Router, useRouter} from "vue-router";
import {useMainStore} from "../stores/mainStore";
import {useChapterStore} from "../stores/chapterStore";
import {useGameStore} from "../stores/gameStore";
import {getSocket} from "./../client";
import {EVENT, GAME_STEP, ROLE, AUDIO_EVENT} from "./Constants";
import gameData from "../assets/game-data/game-data.json";

class TeamManager {
  private static _instance: TeamManager;
  private _mainStore = useMainStore();
  private _chapterStore = useChapterStore();
  private _gameStore = useGameStore();
  public _router: Router = useRouter();
  private _socket = getSocket();

  private constructor() {
    this.initEventsListeners()
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }

  private initEventsListeners() {
    this._socket.on(EVENT.LAUNCH_CHAPTER, async (arg) => {
      this._mainStore.chapterId = arg.chapterId;
      //this._gameStore.data = gameData;

      await this._router.push('/chapitre/' + this._mainStore.getChapterId);
    });

    this._socket.on(EVENT.TEAM_STATUS, async (arg) => {
      console.log('TeamManager EVENT.TEAM_STATUS :', arg);

      if (arg._name) {
        this._gameStore.teamName = arg._name;
        localStorage.setItem('teamName', arg._name);
      }

      if (arg._teamId) {
        this._gameStore.teamId = arg._teamId;
        localStorage.setItem('teamId', arg._teamId);
      }
    });

    this._socket.on(EVENT.START_CHAPTER, async (arg) => {
      console.log('TeamManager EVENT.START_CHAPTER : ', arg)
      this._gameStore.teamId = arg.teamId;
      this._gameStore.teamName = arg.teamName;
      localStorage.setItem('teamId', arg.teamId);
      localStorage.setItem('teamName', arg.teamName);
    })

    this._socket.on(EVENT.LAUNCH_GAME, async (arg) => {
      console.log('TeamManager EVENT.LAUNCH_GAME : ', arg)
      await this._gameStore.reset();
      this._chapterStore.currentParagraph = 0;
      this._mainStore.gameId = arg.gameId;

      console.log('TeamManager EVENT.LAUNCH_GAME', this._mainStore.getFullGameId);
      await this._router.push('/exercice/' + this._mainStore.getFullGameId);
    });

    this._socket.on(EVENT.START_GAME, async (arg) => {
      console.log('TeamManager EVENT.START_GAME : ', arg)
      this._gameStore.currentStep = GAME_STEP.PLAY;
      this._gameStore.teamId = arg.teamId;
      this._gameStore.teamName = arg.teamName;
      localStorage.setItem('teamId', arg.teamId);
      localStorage.setItem('teamName', arg.teamName);
    });

    this._socket.on(EVENT.GAME_VALIDATION, () => {
      this._gameStore.currentStep = GAME_STEP.END;
    });

    this._socket.on(EVENT.END_GAME, () => {
      this._gameStore.currentStep = GAME_STEP.CONGRATS;
      localStorage.removeItem('teamId');
    });

    this._socket.on(EVENT.BACK_CHAPTER, async () => {
      await this._router.push('/chapitre/' + this._mainStore.getChapterId);
    });

    this._socket.on(EVENT.END_CHAPTER, async () => {
      if (this._mainStore.role === ROLE.STUDENT) {
        await this._router.push('/accueil');
      }
    });

    this._socket.on('killRoom', async () => {
      if (this._mainStore.role === ROLE.STUDENT) {
        await this._router.push('/accueil');
      }
    });
  }

  public teamValidation() {
    this._gameStore.currentStep = GAME_STEP.WAIT;
    this._socket.emit(EVENT.TEAM_VALIDATION, {
      roomId: this._mainStore.roomId,
      teamId: this._gameStore.teamId
    });
  }

  public async nextSequence() {
    console.log("TeamManager TEAM_NEXT_SEQUENCE");

    await this._socket.emit(EVENT.TEAM_NEXT_SEQUENCE, {
      roomId: this._mainStore.roomId,
      teamId: this._gameStore.teamId,
      currentSequence: this._gameStore.currentSequence
    });
  }

  public async microReady(hasMicro: boolean) {
    console.log("TeamManager MICRO_READY", hasMicro);

    await this._socket.emit(AUDIO_EVENT.MICRO_READY, {
      roomId: this._mainStore.roomId,
      teamName: this._gameStore.teamName,
      hasMicro
    });
  }
}

export let TeamManagerInstance: TeamManager;

export const mountTeamManagerInstance = (router: Router) => {
  TeamManagerInstance = TeamManager.Instance
  TeamManagerInstance._router = router
};
