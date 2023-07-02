import { getSocket } from "../client";
import { useMainStore } from "../stores/mainStore";
import { AUDIO_EVENT } from "./Constants";

export default class AudioGame {
  private stream: MediaStream | null = null;
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private frequencyData: Uint8Array | null = null;
  private dataArray: Float32Array | null = null;
  public lastDecibelAverage: number = 0; // volume le plus fort d'une hauteur parmis toutes les hauteurs enregistré à la dernière frame
  public lastDecibelAverageWithoutGain: number = 0; // volume le plus fort d'une hauteur parmis toutes les hauteurs enregistré à la dernière frame
  private sensibilityVolume: number = 1; // value between 0.1 & 10 : sensibilité des différences de volume, pour compatbilisé un clappement, 0.1 sensibilité basse, 10 sensibilité très élevé
  private accumulatedRMS: number = 0;
  private sampleCount: number = 0;
  public gainNode: GainNode | null = null;
  private gainDestination: MediaStreamAudioDestinationNode | null = null;
  private socket = getSocket();
  private mainStore = useMainStore();
  private raf = -1;

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
      this.gainDestination = this.context.createMediaStreamDestination();
      this.gainNode.connect(this.gainDestination);

      return true
    } catch (err) {
      return false
    }
  }

  public async pauseMicrophone() {
    console.log('AudioGame pause micro')
    cancelAnimationFrame(this.raf)
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    if (this.gainDestination) {
      this.gainDestination.disconnect();
      this.gainDestination = null;
    }

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }

  public unPauseMicrophone() {
    console.log('AudioGame unPause micro')
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
    this.analyser.getFloatTimeDomainData(this.dataArray);

    let rms = 0;
    for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
      rms += this.dataArray[i] ** 2;
    }
    rms = Math.sqrt(rms / this.analyser.frequencyBinCount);

    this.accumulatedRMS += rms;
    this.sampleCount++;
    // console.log('rms :', rms);

  }

  public normalizeMicrophoneVolume() {
    if (!this.gainNode) return

      const averageRMS = this.accumulatedRMS / this.sampleCount;
      const targetRMS = 0.5;
      const gain = targetRMS / averageRMS;

      this.gainNode.gain.value = Math.min(gain, 50);

    // console.log('Gain appliqué :', gain);

  }

  public isClapping(): Boolean {
    let clapping = false;
    if (!this.frequencyData) {
      return clapping
    }

    if (!this.analyser) {
      return clapping
    }

    if (this.sampleCount % 250 === 0) {
      this.sampleCount /= 2
      this.accumulatedRMS /= 2
    }

    this.processNormalizeMicrophoneVolume()
    this.normalizeMicrophoneVolume()

    this.analyser.getByteFrequencyData(this.frequencyData);

    let decibelAverage = 0;
    for (var i = 0; i < this.frequencyData.length; i++) {
      decibelAverage += this.frequencyData[i];
    }

    decibelAverage = decibelAverage / this.frequencyData.length;
    this.lastDecibelAverageWithoutGain = decibelAverage
    if (this.gainNode && this.gainNode.gain.value && this.gainNode.gain.value !== 1) {
      decibelAverage = decibelAverage * this.gainNode.gain.value * 0.05
    }

    if (decibelAverage > 40 && decibelAverage - this.lastDecibelAverage > 20 * (1 / this.sensibilityVolume)) {
      clapping = true
    }

    this.lastDecibelAverage = decibelAverage;
    return clapping
  }

  kill() {
    console.log("AudioGame kill")
    this.pauseMicrophone();
    this.stream = null;
    this.context = null;
    this.analyser = null;
    this.frequencyData = null;
    this.dataArray = null;
    this.lastDecibelAverage = 0;
    this.sensibilityVolume = 1;
    this.accumulatedRMS = 0;
    this.sampleCount = 0;
    this.gainNode = null;
    this.gainDestination = null;
    this.raf = -1;
  }
}
