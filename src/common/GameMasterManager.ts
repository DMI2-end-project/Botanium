import {Router, useRouter} from "vue-router";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {useChapterStore} from "../stores/chapterStore";
import {getSocket} from "./../client";
import {leading} from "../common/Lib";
import {CHAPTER_STATUS, EVENT, GAME_STEP} from "./Constants";
import gameData from "../assets/game-data/game-data-v2.json";
import {DatabaseManagerInstance} from "./DatabaseManager";

class GameMasterManager {
  private static _instance: GameMasterManager;
  private _dbInstance = DatabaseManagerInstance;
  private _mainStore = useMainStore();
  private _chapterStore = useChapterStore();
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
      this._gameStore.data.gameSequences[this._gameStore.currentSequence].gamemaster.answers[arg.teamId].status = 'valid';
      this._gameStore.totalTeamsFinished += 1;
    })
  }

  public async launchChapter(chapterId: number, realId: string) {
    console.log("GameMasterManager LAUNCH_CHAPTER : ", chapterId, realId);

    this._mainStore.chapterId = chapterId;
    this._mainStore.realChapterId = realId;
    await this._dbInstance.updateChapterStatus(realId, CHAPTER_STATUS.IN_PROGRESS);

    this._mainStore.gameId = 0  // TODO :await this._dbInstance.getPreviousGameId(realId);
    this._gameStore.data = gameData;

    await this._socket.emit(EVENT.LAUNCH_CHAPTER, {
      roomId: this._mainStore.roomId,
      chapterId: this._mainStore.getChapterId
    });

    await this._router.push('/chapitre/' + leading(chapterId, 3));
  }
  
  public async startChapter() {
    console.log("GameMasterManager START_CHAPTER");
    
    await this._socket.emit(EVENT.START_CHAPTER, {
      roomId: this._mainStore.roomId,
      chapterId: this._mainStore.getChapterId
    });
  }

  public async launchGame(gameId: number) {
    console.log("GameMasterManager LAUNCH_GAME : ", gameId);
    await this._gameStore.reset();
    this._chapterStore.currentParagraph = 0;
    this._mainStore.gameId = gameId;
    await this._socket.emit(EVENT.LAUNCH_GAME, {
      roomId: this._mainStore.roomId,
      gameId: this._mainStore.gameId //mainStore.getFullGameId
    });
    await this._router.push('/exercice/' + this._mainStore.getFullGameId);
  }

  public async startGame() {
    console.log("GameMasterManager START_GAME")
    this._gameStore.currentStep = GAME_STEP.PLAY;
    await this._socket.emit(EVENT.START_GAME, {
      roomId: this._mainStore.roomId,
      step: GAME_STEP.PLAY
    });
  }

  public async gameValidation() {
    this._gameStore.currentStep = GAME_STEP.END;
    this._socket.emit(EVENT.GAME_VALIDATION, {
      roomId: this._mainStore.roomId,
      step: GAME_STEP.END
    })
  }

  public async endGame() {
    console.log("GameMasterManager END_GAME", this._mainStore.realChapterId);

    if (this._mainStore.realChapterId) {
      await this._dbInstance.updatePreviousGameId(this._mainStore.realChapterId, this._mainStore.gameId);
    }

    this._gameStore.currentStep = GAME_STEP.CONGRATS;

    await this._socket.emit(EVENT.END_GAME, {
      roomId: this._mainStore.roomId
    })
  }

  public async backChapter() {
    //this._chapterStore.currentParagraph = 0;
    //this._chapterStore.currentSection += 1;
    console.log("GameMasterManager BACK_CHAPTER", this._mainStore.gameId)
    await this._socket.emit(EVENT.BACK_CHAPTER, {
      roomId: this._mainStore.roomId,
      gameId: this._mainStore.gameId,
      //currentSection: this._mainStore.gameId
    });
    console.log("GameMasterManager BACK_CHAPTER router", this._mainStore.chapterId)
    await this._router.push('/chapitre/' + this._mainStore.chapterId)
  }

  public async endChapter() {
    if (this._mainStore.realChapterId) {
      await this._dbInstance.updateChapterStatus(this._mainStore.realChapterId, CHAPTER_STATUS.DONE);
    }
    await this._socket.emit(EVENT.END_CHAPTER, {
      roomId: this._mainStore.roomId,
    })
    await this._router.push('/chapitres');
  }
}

export let GameMasterManagerInstance: GameMasterManager;

export const mountGameMasterManagerInstance = (router: Router) => {
  GameMasterManagerInstance = GameMasterManager.Instance
  GameMasterManagerInstance._router = router
};
