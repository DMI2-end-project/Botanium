import { getSocket } from "../client";
import { useMainStore } from "../stores/mainStore";
import { AUDIO_EVENT } from "./Constants";

class AudioManager {
  private static _instance: AudioManager;
  private stream: MediaStream | null = null;
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private frequencyData: Uint8Array | null = null;
  private dataArray: Float32Array | null = null;
  public lastDecibelAverage: number = 0; // volume le plus fort d'une hauteur parmis toutes les hauteurs enregistré à la dernière frame
  private sensibilityVolume: number = 1; // value between 0.1 & 10 : sensibilité des différences de volume, pour compatbilisé un clappement, 0.1 sensibilité basse, 10 sensibilité très élevé
  private accumulatedRMS: number = 0;
  private sampleCount: number = 0;
  public gainNode: GainNode | null = null;
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
      // this.analyser.smoothingTimeConstant = 0.8;

      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.dataArray = new Float32Array(this.analyser.frequencyBinCount);

      this.gainNode = this.context.createGain()
      this.analyser.connect(this.gainNode);
      // this.gainNode.connect(this.context.destination);
      const tempDestination = this.context.createMediaStreamDestination();
      this.gainNode.connect(tempDestination);

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

  public processNormalizeMicrophoneVolume() {
    if (!this.dataArray) return
    if (!this.analyser) return
    // Lecture des données audio du microphone
    this.analyser.getFloatTimeDomainData(this.dataArray);

    // Calcul de l'amplitude RMS
    let rms = 0;
    for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
      rms += this.dataArray[i] ** 2;
    }
    rms = Math.sqrt(rms / this.analyser.frequencyBinCount);

    // Accumulation de la valeur RMS pendant 1 seconde
    this.accumulatedRMS += rms;
    this.sampleCount++;

    // Affichage de la valeur RMS dans la console
    console.log('Valeur RMS :', rms);
  }

  public normalizeMicrophoneVolume() {
    if (!this.gainNode) return

      // Calcul du gain moyen
      const averageRMS = this.accumulatedRMS / this.sampleCount;
      const targetRMS = 0.5; // Valeur cible pour l'amplitude RMS
      const gain = targetRMS / averageRMS;

      // Application du gain pour le reste de l'enregistrement
      this.gainNode.gain.value = gain;

      // Affichage du gain appliqué dans la console
      console.log('Gain appliqué :', gain);

      // Arrêt du traitement du flux audio
      // gainNode.disconnect();
      // audioContext.close();
  }

  public isClapping(): Boolean { // TODO remettre dans la gameview
    if (this.sampleCount < 1000) {
      this.processNormalizeMicrophoneVolume()
    } else if (this.gainNode?.gain.value === 1) {
      this.normalizeMicrophoneVolume()
    }

    let clapping = false;
    if (!this.frequencyData) {
      return clapping
    }

    if (!this.analyser) {
      return clapping
    }

    this.analyser.getByteFrequencyData(this.frequencyData);

    let decibelAverage = 0;
    for (var i = 0; i < this.frequencyData.length; i++) {
      decibelAverage += this.frequencyData[i];
    }

    decibelAverage = decibelAverage / this.frequencyData.length;

    if (decibelAverage > 20 && decibelAverage - this.lastDecibelAverage > 5 * (1 / this.sensibilityVolume)) {
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
