<template>
  <Pulse ref="pulse" :color="feedbackMessage === 'Excellent' || feedbackMessage === 'Bien' ? 'green' : (feedbackMessage === 'Très mauvais' || feedbackMessage === 'Mauvais' ? 'red' : 'purple')" />
  <div ref="feedback" class="feedback relatif text-purple uppercase text-xl font-title font-bold"></div>
  <p>deltaTimeWithServer : {{ delta }}</p>
  <p>En rythme : {{ rhythm }}</p>
  <div class="w-16 h-32 bg-white fixed  top-[45vh] left-[35vw]">
    <div :style="'transform: scaleY(' + rhythm + ')'" class="absolute top-0 w-full bg-purple h-full origin-bottom" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getSocket } from "../../../../client";
import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import { AUDIO_EVENT } from "../../../../common/Constants";
import { AudioManagerInstance } from "../../../../common/AudioManager";
import Pulse from './Pulse.vue';

export default defineComponent({
  components: { Pulse },
  emits: ['validated'],
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      pathModel: window.location.origin + "/tensorflow/m3/",
      frequencyData: null as Uint8Array | null,
      rhythmFreq: 800 as number, // ms
      lastTime: 0 as number,
      lastFreq: 0 as number, // volume le plus fort d'une hauteur parmis toutes les hauteurs enregistré à la dernière frame
      rhythm: 0 as number, // value between -1 & 1, -1 il faut surtout pas clapper, 1 c'est le meilleur moment pour clapper
      isClapping: 1 as number, // value between 0 & 1 => Probability is clapping
      sensibilityVolume: 2 as number, // value between 0.1 & 10 : sensibilité des différences de volume, pour compatbilisé un clappement, 0.1 sensibilité basse, 10 sensibilité très élevé
      feedbackRythm: [
        "Excellent",
        "Bien",
        "Mauvais",
        "Très mauvais",
      ],
      feedbackMessage: "",
      raf: 0 as number,
      lastClap: 0 as number,
      delta: AudioManagerInstance.deltaTimeWithServer as number
    };
  },
  mounted() {
    this.play()
    window.addEventListener("blur", this.stop);
    window.addEventListener("focus", this.play);
  },
  methods: {
    hasMicro() {
      const team = this.gameStore.teams.find(team => team._name === this.gameStore.teamName)
      if (team) {
        return team?.hasMicro
      } else {
        return false
      }
    },
    async stop() {
      AudioManagerInstance.pauseMicrophone()
      cancelAnimationFrame(this.raf)
    },
    async play() {
      if (this.hasMicro() && !AudioManagerInstance.stream) {
        AudioManagerInstance.unPauseMicrophone()
      }
      const waitTime = this.rhythmFreq - ((Date.now() + AudioManagerInstance.deltaTimeWithServer) % this.rhythmFreq)
      setTimeout(() => {
        if (AudioManagerInstance.stream && AudioManagerInstance.analyser) {
          this.frequencyData = new Uint8Array(AudioManagerInstance.analyser.frequencyBinCount);
        }
        this.startListen()
      }, waitTime)
    },
    startListen() {
      (this.$refs.pulse as typeof Pulse).startAnimation();
      this.lastTime = 0
      cancelAnimationFrame(this.raf)
      this.raf = requestAnimationFrame(this.loop);
    },
    loop() {
      const time = (Date.now() + AudioManagerInstance.deltaTimeWithServer) % this.rhythmFreq
      this.rhythm = Math.abs((time / this.rhythmFreq) - 0.5) * -4 + 1

      if (this.lastClap + (this.rhythmFreq / 2) < Date.now() + AudioManagerInstance.deltaTimeWithServer && AudioManagerInstance.analyser && AudioManagerInstance.stream && this.frequencyData) {

        this.feedbackMessage = ''
        AudioManagerInstance.analyser.getByteFrequencyData(this.frequencyData);
        this.detectClap(this.frequencyData);
      }

      if (time < this.lastTime) {
        (this.$refs.pulse as typeof Pulse).startAnimation();
      }
      this.lastTime = time
      this.raf = requestAnimationFrame(this.loop);
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
      this.lastClap = Date.now() + AudioManagerInstance.deltaTimeWithServer
      this.socket.emit(AUDIO_EVENT.CLAP_SCORE, {
        roomId: this.mainStore.roomId,
        rhythm: this.rhythm
      });
      this.feedbackMessage = this.feedbackRythm[this.rhythm > 0.8 ? 0 : (this.rhythm > 0 ? 1 : (this.rhythm > -0.5 ? 2 : 3))]
      this.addFeedbackMessage()
    },
    addFeedbackMessage() {
      if (!this.$refs.feedback) {
        return
      }
      const para = document.createElement("p");
      const node = document.createTextNode(this.feedbackMessage);
      para.appendChild(node);
      (this.$refs.feedback as HTMLElement).appendChild(para);
      para.style.position = 'absolute'
      para.style.top = 'calc(' + (Math.random() * 10 + 40) + '% + 10px)'
      para.style.left = 'calc(' + (Math.random() * 10 + 40) + '% + 60px)'
      para.style.transform = 'scale(1) translateY(0)'
      para.style.opacity = '1'
      para.style.transition = 'transform 1s cubic-bezier(0.36, 0, 0.66, -0.56), opacity 1s cubic-bezier(0.36, 0, 0.66, -0.56)'
      setTimeout(() => {
        para.style.transform = 'scale(0) translateY(0)'
      }, 10)
      setTimeout(() => {
        if (this.$refs.feedback) {
          (this.$refs.feedback as HTMLElement).removeChild(para);
        }
      }, 2000)
    },
  },
  beforeUnmount() {
    window.removeEventListener("blur", this.stop);
    window.removeEventListener("focus", this.play);
    this.stop()
  }
});
</script>

<style scoped>
.feedback {
  -webkit-text-stroke: 1px #fff;
}
</style>
