import {Router, useRouter} from "vue-router";
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import {useChapterStore} from "../stores/chapterStore";
import {getSocket} from "./../client";
import {leading} from "../common/Lib";
import {CHAPTER_STATUS, EVENT, GAME_STEP, AUDIO_EVENT, CHAPTER_STEP} from "./Constants";
import {DatabaseManagerInstance} from "./DatabaseManager";

class GameMasterManager {
  private static _instance: GameMasterManager;
  public _router: Router = useRouter();
  private _dbInstance = DatabaseManagerInstance;
  private _socket = getSocket();
  private _mainStore = useMainStore();
  private _chapterStore = useChapterStore();
  private _gameStore = useGameStore();

  private constructor() {
    this.initEventsListeners()
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }

  private initEventsListeners() {
    this._socket.on(EVENT.TEAM_VALIDATION, (arg) => {
      this._gameStore.data.gameSequences[this._gameStore.currentSequence].gamemaster.answers[arg.teamId].status = 'valid';
    });

    this._socket.on(EVENT.GAME_VALIDATION, (arg) => {
      this._gameStore.currentStep = GAME_STEP.END;
    });

    this._socket.on(AUDIO_EVENT.MICRO_READY, (arg) => {
      console.log('GameMasterManager MICRO_READY : ', arg)
      this._gameStore.teams = arg._teams;
    });
  }

  public async launchChapter(chapterId: number, dbChapterId: string) {
    console.log("GameMasterManager LAUNCH_CHAPTER : ", chapterId, dbChapterId);

    this._mainStore.chapterId = chapterId;
    this._mainStore.dbChapterId = dbChapterId;
    // await this._dbInstance.updateChapterStatus(dbChapterId, CHAPTER_STATUS.IN_PROGRESS); // TODO uncomment

    // await this._dbInstance.getPreviousGameId(realId); // TODO uncomment
    //this._gameStore.data = gameData;

    await this._socket.emit(EVENT.LAUNCH_CHAPTER, {
      roomId: this._mainStore.roomId,
      chapterId: this._mainStore.chapterId  // this._mainStore.getChapterId
    });

    this._mainStore.isTransition = true;
    setTimeout(async () => {
      await this._router.push('/chapitre/' + leading(chapterId, 3));
      this._mainStore.isTransition = false;
    }, 700);
  }

  public async startChapter() {
    console.log("GameMasterManager START_CHAPTER");

    await this._socket.emit(EVENT.START_CHAPTER, {
      roomId: this._mainStore.roomId,
      chapterId: this._mainStore.getChapterId
    });
  }

  public async nextParagraph() {
    console.log("GameMasterManager NEXT_PARAGRAPH");

    await this._socket.emit(EVENT.NEXT_PARAGRAPH, {
      roomId: this._mainStore.roomId,
      currentParagraph: this._chapterStore.currentParagraph
    });
  }

  public async nextSequence() {
    console.log("GameMasterManager GAME_NEXT_SEQUENCE");

    await this._socket.emit(EVENT.GAME_NEXT_SEQUENCE, {
      roomId: this._mainStore.roomId,
      currentSequence: this._gameStore.currentSequence
    });
  }

  public async launchGame(gameId: number) {
    console.log("GameMasterManager LAUNCH_GAME : ", gameId);
    await this._gameStore.reset();
    this._chapterStore.currentParagraph = 0;
    this._mainStore.gameId = gameId;
    await this._socket.emit(EVENT.LAUNCH_GAME, {
      roomId: this._mainStore.roomId,
      gameId: this._mainStore.gameId
    });

    this._mainStore.isTransition = true;
    setTimeout(async () => {
      this._chapterStore.currentStep = CHAPTER_STEP.IDLE;
      await this._router.push('/exercice/' + this._mainStore.getFullGameId);
      this._mainStore.isTransition = false;
    }, 700);
  }

  public async startGame() {
    console.log("GameMasterManager START_GAME")
    this._gameStore.currentStep = GAME_STEP.PLAY;
    await this._socket.emit(EVENT.START_GAME, {
      roomId: this._mainStore.roomId,
      //gameStep: GAME_STEP.PLAY
    });
  }

  public async endGame() {
    console.log("GameMasterManager END_GAME", this._mainStore.dbChapterId);

    if (this._mainStore.dbChapterId) {
      // await this._dbInstance.updatePreviousGameId(this._mainStore.dbChapterId, this._mainStore.gameId);
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
    this._gameStore.currentStep = GAME_STEP.IDLE;
    this._mainStore.isTransition = true;
    setTimeout(async () => {
      await this._router.push('/chapitre/' + this._mainStore.chapterId)
      this._mainStore.isTransition = false;
    }, 700);
  }

  public async endChapter() {
    if (this._mainStore.dbChapterId) {
      // await this._dbInstance.updateChapterStatus(this._mainStore.dbChapterId, CHAPTER_STATUS.DONE);
    }
    await this._socket.emit(EVENT.END_CHAPTER, {
      roomId: this._mainStore.roomId,
    })
    this._chapterStore.currentStep = CHAPTER_STEP.IDLE;
    this._gameStore.currentStep = GAME_STEP.IDLE;
    this._mainStore.chapterId = 0;
    this._mainStore.gameId = 0;

    this._mainStore.isTransition = true;
    setTimeout(async () => {
      await this._router.push('/chapitres');
      this._mainStore.isTransition = false;
    }, 700);
  }

  public async killRoom() {
    await this._socket.emit('killRoom', {
      roomId: this._mainStore.roomId,
    });
    this._chapterStore.currentStep = CHAPTER_STEP.IDLE;
    this._gameStore.currentStep = GAME_STEP.IDLE;
    this._mainStore.chapterId = 0;
    this._mainStore.gameId = 0;
    await this._router.push({name: 'Dashboard'});
  }
}

export let GameMasterManagerInstance: GameMasterManager;

export const mountGameMasterManagerInstance = (router: Router) => {
  GameMasterManagerInstance = GameMasterManager.Instance
  GameMasterManagerInstance._router = router;
};
