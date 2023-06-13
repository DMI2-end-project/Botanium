import { getSocket } from "../client";
import { useMainStore } from "../stores/mainStore";
import { AUDIO_EVENT } from "./Constants";

class AudioManager {
  private static _instance: AudioManager;
  private stream: MediaStream | null = null;
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private frequencyData: Uint8Array | null = null;
  private lastDecibelAverage: number = 0; // volume le plus fort d'une hauteur parmis toutes les hauteurs enregistré à la dernière frame
  private sensibilityVolume: number = 1; // value between 0.1 & 10 : sensibilité des différences de volume, pour compatbilisé un clappement, 0.1 sensibilité basse, 10 sensibilité très élevé
  private socket = getSocket();
  private mainStore = useMainStore();

  public static get Instance(): AudioManager {
    return this._instance || (this._instance = new this());
  }

  public async getMicrophone(): Promise<boolean> {
    if (this.stream) {
      return true
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.context = new AudioContext();
      const source = this.context.createMediaStreamSource(this.stream);
      this.analyser = this.context.createAnalyser();

      source.connect(this.analyser);

      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

      return true
    } catch (err) {
      return false
    }
  }

  public pauseMicrophone() {
    console.log('AudioManager pause micro')
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
    console.log('AudioManager unPause micro')
    this.getMicrophone()
  }

  public async getDeltaTimeWithServer(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let latency = 0;
      let t1 = 0;
      let t2 = 0;
      let deltaTime = 0;
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const dateEmit = Date.now()
          this.socket.emit(AUDIO_EVENT.AUDIO_SYNCHRO, {
            roomId: this.mainStore.roomId,
          }, (response: number) => {
            const end = Date.now();
            latency = end - dateEmit;
            t1 = response - dateEmit - (latency / 2)
            t2 = response - end + (latency / 2)
            deltaTime += (t1 + t2) / 2
            if (i === 9) {
              deltaTime = deltaTime / 10
              resolve(deltaTime);
            }
          });
        }, 100 * i)
      }
    });
  }

  public isClapping(): Boolean { // TODO remettre dans la gameview
    let clapping = false;
    if (!this.frequencyData) {
      return clapping
    }

    if (!this.analyser) {
      return clapping
    }

    this.analyser.getByteFrequencyData(this.frequencyData);

    // Trouvez le pic le plus haut de la fréquence
    let decibelAverage = 0; // correspond à la hauteur avec le volume le plus haut
    for (var i = 0; i < this.frequencyData.length; i++) {
      decibelAverage += this.frequencyData[i];
    }

    decibelAverage = decibelAverage / this.frequencyData.length;

    if (decibelAverage > 80 && decibelAverage - this.lastDecibelAverage > 20 * (1 / this.sensibilityVolume)) {
      clapping = true
    }

    this.lastDecibelAverage = decibelAverage;
    return clapping
  }
}

export let AudioManagerInstance: AudioManager;

export const mountAudioManagerInstance = () => {
  AudioManagerInstance = AudioManager.Instance
};
