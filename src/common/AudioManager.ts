import { getSocket } from "../client";
import { useGameStore } from "../stores/gameStore";
import { useMainStore } from "../stores/mainStore";
import { AUDIO_EVENT } from "./Constants";
import { TeamManagerInstance } from './TeamManager';

class AudioManager {
  private static _instance: AudioManager;
  public stream: MediaStream | null = null;
  public context: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  public deltaTimeWithServer: number = 0;
  public socket = getSocket();
  public mainStore = useMainStore();
  public gameStore = useGameStore();

  public static get Instance(): AudioManager {
    return this._instance || (this._instance = new this());
  }

  public async getMicrophone(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.context = new AudioContext();
      const source = this.context.createMediaStreamSource(this.stream);
      this.analyser = this.context.createAnalyser();

      source.connect(this.analyser);
      // this.analyser.connect(this.context.destination);

      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      return true
    } catch (err) {
      return false
    }
  }

  public async startMicrophone() {
    if (this.stream) {
      this.deltaTimeWithServer = await this.getDeltaTimeWithServer();
      TeamManagerInstance.mircoReady(true);
    }
  }

  public async startWithoutMicrophone() {
    this.deltaTimeWithServer = await this.getDeltaTimeWithServer();
    TeamManagerInstance.mircoReady(false);
  }

  public pauseMicrophone() {
    console.log('AudioManager pause micro ', this.stream, this.context)
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }

  public unPauseMicrophone() {
    console.log('AudioManager unPause micro ', this.stream, this.context)
    this.getMicrophone()
  }

  private async getDeltaTimeWithServer(): Promise<number> {
    let latency = 0;
    let t1 = 0;
    let t2 = 0;
    let deltaTime = 0;
    const dateEmit = Date.now()
    await this.socket.emit(AUDIO_EVENT.AUDIO_SYNCHRO, {
      roomId: this.mainStore.roomId,
    }, (response: number) => {
      const end = Date.now();
      latency = end - dateEmit;
      t1 = response - dateEmit - (latency / 2)
      t2 = response - end + (latency / 2)
      deltaTime += (t1 + t2) / 2
      return deltaTime;
    });
    return deltaTime;
  }
}

export let AudioManagerInstance: AudioManager;

export const mountAudioManagerInstance = () => {
  AudioManagerInstance = AudioManager.Instance
};
