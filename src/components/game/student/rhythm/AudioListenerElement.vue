<template>
  <Pulse ref="pulse" />
  <div ref="feedback" class="feedback relatif text-purple uppercase text-xl font-title font-bold"></div>
  <!-- <p>Message : {{ feedbackMessage }}</p>
  <p>En train de clapper : {{ isClapping }}</p>
  <p>En rythme : {{ rhythm }}</p> -->
  <!-- <div ref="labels"></div> -->
  <!-- <div class="w-16 h-32 bg-white fixed  top-[45vh] left-[35vw]">
    <div :style="'transform: scaleY(' + rhythm + ')'" class="absolute top-0 w-full bg-purple h-full origin-bottom" />
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getSocket } from "../../../../client";
import {useMainStore} from "../../../../stores/mainStore";
import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";
import { CLAP_EVENT } from "../../../../common/Constants";
import Pulse from './Pulse.vue';

export default defineComponent({
  components: { Pulse },
  props: {
    analyser: {
      type: AnalyserNode,
      default: null
    },
    microActive: {
      type: Boolean,
      default: false,
    },
    deltaTime: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      pathModel: window.location.origin + "/tensorflow/m3/",
      frequencyData: {} as Uint8Array,
      rhythmFreq: 600 as number, // ms
      lastTime: 0 as number,
      lastFreq: 0 as number, // volume le plus fort d'une hauteur parmis toutes les hauteurs enregistré à la dernière frame
      rhythm: 0 as number, // value between -1 & 1, -1 il faut surtout pas clapper, 1 c'est le meilleur moment pour clapper
      isClapping: 0 as number, // value between 0 & 1 => Probability is clapping
      sensibilityVolume: 1 as number, // value between 0.1 & 10 : sensibilité des différences de volume, pour compatbilisé un clappement, 0.1 sensibilité basse, 10 sensibilité très élevé
      feedbackRythm: [
        "Excellent",
        "Bien",
        "Mauvais",
        "Très mauvais",
      ],
      feedbackMessage: "",
      recognizer: {} as speechCommands.SpeechCommandRecognizer,
      raf: 0 as number,
      raf2: 0 as number,
    };
  },
  watch: {
    feedbackMessage() {
      if (!this.$refs.feedback) {
        return
      }
      console.log(this.feedbackMessage)
      const para = document.createElement("p");
      const node = document.createTextNode(this.feedbackMessage);
      para.appendChild(node);
      (this.$refs.feedback as HTMLElement).appendChild(para);
      para.style.position = 'absolute'
      para.style.top = 'calc(' + Math.random() * 60 + 20 + '% + 10px)'
      para.style.left = 'calc(' + Math.random() * 60 + 20 + '% + 60px)'
       para.style.transform = 'scale(1) translateY(0)'
      para.style.opacity = '1'
      para.style.transition = 'transform 1s cubic-bezier(0.36, 0, 0.66, -0.56), opacity 1s cubic-bezier(0.36, 0, 0.66, -0.56)'
      setTimeout(() => {
        para.style.transform = 'scale(0) translateY(0)'
      }, 10)
      setTimeout(() => {
        // (this.$refs.feedback as HTMLElement).removeChild(para);
      }, 2000)
    }
  },
  mounted() {
    const waitTime = this.rhythmFreq - ((Date.now() + this.deltaTime) % this.rhythmFreq)
    setTimeout(() => {
      if (this.microActive) {
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.initClapRecognition()
      }
      this.start()
    }, waitTime)
  },
  methods: {
    start() {
      (this.$refs.pulse as typeof Pulse).startAnimation();
      this.lastTime = 0
      if (this.microActive) {
        cancelAnimationFrame(this.raf)
        this.raf = requestAnimationFrame(this.listenLoop);
      } else {
        cancelAnimationFrame(this.raf2)
        this.raf2 = requestAnimationFrame(this.loop);
      }
    },
    loop() {
      const time = (Date.now() + this.deltaTime) % this.rhythmFreq
      if (time < this.lastTime) {
        (this.$refs.pulse as typeof Pulse).startAnimation();
      }
      this.lastTime = time
      this.raf2 = requestAnimationFrame(this.loop);
    },
    listenLoop() {
      const time = (Date.now() + this.deltaTime) % this.rhythmFreq
      this.rhythm = Math.abs((time / this.rhythmFreq) - 0.5) * -4 + 1
      this.analyser.getByteFrequencyData(this.frequencyData);
      this.detectClap(this.frequencyData);
      if (time < this.lastTime) {
        (this.$refs.pulse as typeof Pulse).startAnimation();
      }
      this.lastTime = time
      this.raf = requestAnimationFrame(this.listenLoop);
    },
    detectClap(frequencyData:Uint8Array) {
      // Trouvez le pic le plus haut de la fréquence
      var maxIndex = 0; // correspond à la hauteur avec le volume le plus haut
      for (var i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > frequencyData[maxIndex]) {
          maxIndex = i;
        }
      }

      const currentFreq: number = frequencyData[maxIndex];

      if (
        currentFreq > 100 &&
        currentFreq - this.lastFreq > 40 * (1 / this.sensibilityVolume) &&
        this.isClapping > 0.5
      ) {
        this.onClap()
      }

      this.lastFreq = currentFreq;
    },
    onClap() {
      this.socket.emit(CLAP_EVENT.CLAP_SCORE, {
        roomId: this.mainStore.roomId,
        clapScore: this.rhythm
      });
      this.feedbackMessage = this.feedbackRythm[this.rhythm > 0.8 ? 0 : (this.rhythm > 0 ? 1 : (this.rhythm > -0.5 ? 2 : 3))]
    },
    async createModel():Promise<speechCommands.SpeechCommandRecognizer> {
        const checkpointURL = this.pathModel + "model.json"; // model topology
        const metadataURL = this.pathModel + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    },
    async initClapRecognition() {
        tf.setBackend('webgl');
        this.recognizer = await this.createModel();
        // const classLabels = this.recognizer.wordLabels(); // get class labels
        // const labelContainer:HTMLElement = this.$refs.labels as HTMLElement;
        // for (let i = 0; i < classLabels.length; i++) {
        //     labelContainer.appendChild(document.createElement("div"));
        // }

      this.recognizer.listen(async (result: speechCommands.SpeechCommandRecognizerResult) => {
        const scores: Float32Array | Float32Array[] = Array.isArray(result.scores) ? result.scores[0] : result.scores;
        if (scores[0] > 0.75) {
          this.isClapping -= (100/this.rhythmFreq) * scores[0];
        } else if (scores[1] > 0.75) {
          this.isClapping += 0.6 * scores[1];
        }

        this.isClapping += 1

        this.isClapping = Math.min(Math.max(this.isClapping, 0), 1);

        // for (let i = 0; i < classLabels.length; i++) {
        //     const classPrediction = classLabels[i] + ": " + scores[i].toFixed(2);
        //     (labelContainer.childNodes[i] as HTMLElement).innerHTML = classPrediction;
        // }
      }, {
          includeSpectrogram: true, // in case listen should return result.spectrogram
          probabilityThreshold: 0.75,
          invokeCallbackOnNoiseAndUnknown: true,
          overlapFactor: 0.75 // probably want between 0.5 and 0.75. More info in README
      });
    },
  },
  beforeUnmount() {
    this.recognizer.stopListening()
    cancelAnimationFrame(this.raf)
    cancelAnimationFrame(this.raf2)
  }
});
</script>

<style scoped>
.feedback {
  -webkit-text-stroke: 1px #fff;
}
</style>
