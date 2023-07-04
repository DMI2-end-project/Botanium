import {AUDIO} from "./Constants";

class AudioManager {
  private static _instance: AudioManager;
  private _audios: any[] = [];
  
  constructor() {
    this.addNew('/audio/background-sound-V1.mp3', AUDIO.BACKGROUND_SOUND);
    this.addNew('/audio/background-music-V1.mp3', AUDIO.BACKGROUND_MUSIC);
    this.addNew('/audio/connection-pop-V1.mp3', AUDIO.CONNECTION);
    this.addNew('/audio/button-click-V1.mp3', AUDIO.BUTTON);
    this.addNew('/audio/whoosh-V1.mp3', AUDIO.WOOSH);
    this.addNew('/audio/smooth-pop-V1.mp3', AUDIO.POP);
    this.addNew('/audio/trash-V1.mp3', AUDIO.TRASH);
    this.addNew('/audio/flip-page-V1.mp3', AUDIO.FLIP);
    this.addNew('/audio/flipping-pages-V1.mp3', AUDIO.MULTI_FLIP);
    this.addNew('/audio/drawing-V1.mp3', AUDIO.DRAWING);
    this.addNew('/audio/writing-1-V1.mp3', AUDIO.WRITING1);
    this.addNew('/audio/writing-2-V1.mp3', AUDIO.WRITING2);
    this.addNew('/audio/wrong-answer-V1.mp3', AUDIO.WRONG_ANSWER_GROUP_TABLET);
    this.addNew('/audio/good-answer-group-tablet-V1.mp3', AUDIO.GOOD_ANSWER_GROUP_TABLET);
    this.addNew('/audio/good-answer-group-V1.mp3', AUDIO.GOOD_ANSWER_GROUP);
    this.addNew('/audio/good-answer-class-V1.mp3', AUDIO.GOOD_ANSWER_CLASS);
    this.addNew('/audio/victory-V1.mp3', AUDIO.VICTORY);
  }
  
  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
  
  addNew(path: string, name: AUDIO) {
    let audio = new Audio(path);
    this._audios.push({audio, name});
  }
  
  play(name: AUDIO, volume: number = 0.5, playbackRate = 1) {
    let item = this._audios.find(item => item.name === name);
    if (item) {
      item.audio.currentTime = 0;
      item.audio.volume = volume;
      item.audio.playbackRate = playbackRate;
      item.audio.play();
    }
  }
  
  pause(name: AUDIO) {
    let item = this._audios.find(item => item.name === name);
    if (item) {
      item.audio.pause();
      item.audio.currentTime = 0;
    }
  }
  
}

export const AudioManagerInstance = AudioManager.Instance;