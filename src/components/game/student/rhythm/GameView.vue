<template>
  <Pulse ref="pulse" :color="feedbackMessage.number === 0 || feedbackMessage.number === 1 ? 'green' : (feedbackMessage.number === 2 || feedbackMessage.number === 3 ? 'red' : 'purple')" />
  <div ref="feedback" class="feedback relatif text-purple uppercase text-2xl font-sans font-black"></div>
  <!-- <p>deltaTimeWithServer : {{ deltaTimeWithServer }}</p> -->
  <!-- <div class="fixed top-[200px] left-[50px]">
    <p class="w-[200px]">gain : {{ gain }}</p>
  <p class="w-[200px]">decibelAverage : {{ decibel }}</p>
  <div class="w-24 h-[300px] bg-green-light flex flex-col justify-end mt-24">
    <div class="w-full bg-green" :style="`height: ${decibel}%`"></div>
  </div>
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getSocket } from "../../../../client";
import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import { AUDIO_EVENT } from "../../../../common/Constants";
import GameFacade from "../../../../common/GameFacade";
import Pulse from './Pulse.vue';

interface Feedback {
  number: number,
  text: string
}

export default defineComponent({
  components: { Pulse },
  emits: ['validated', 'openModal'],
  props: {
    gameFacade: {
      default: null,
      type: GameFacade
    }
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      rhythmFreq: 800 as number, // ms
      lastTime: 0 as number,
      rhythm: 0 as number, // value between -1 & 1, -1 il faut surtout pas clapper, 1 c'est le meilleur moment pour clapper
      feedbackRythm: [
        {number: 0, text: "Parfait"},
        {number: 1, text: "Bien"},
        {number: 2, text: "Moyen"},
        {number: 3, text: "Mauvais"},
      ],
      feedbackMessage: {number: -1, text: ''} as Feedback,
      deltaTimeWithServer: 0 as number,
      raf: 0 as number,
      lastClap: 0 as number,
      decibel: 0 as number,
      gain: 1 as number,
    };
  },
  async mounted() {
    if (!this.gameFacade.audio) {
      this.gameFacade.microIsNeeded()
    }
    if (!this.gameFacade.audio) return
    this.deltaTimeWithServer = await this.gameFacade.audio.getDeltaTimeWithServer()
    this.play()
    window.addEventListener("blur", this.stop);
    window.addEventListener("focus", this.play);
  },
  methods: {
    hasMicro() { // TODO var de l'audiogame ?
      const team = this.gameStore.teams.find(team => team._name === this.gameStore.teamName)
      if (team) {
        return team?.hasMicro
      } else {
        return false
      }
    },
    async stop() {
    if (!this.gameFacade.audio) return
      this.gameFacade.audio.pauseMicrophone()
      cancelAnimationFrame(this.raf)
    },
    async play() {
      if (this.hasMicro() && this.gameFacade.audio) {
        this.gameFacade.audio.unPauseMicrophone()
      }
      const waitTime = this.rhythmFreq - ((Date.now() + this.deltaTimeWithServer) % this.rhythmFreq)
      setTimeout(() => {
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
      const time = (Date.now() + this.deltaTimeWithServer) % this.rhythmFreq
      this.rhythm = Math.abs((time / this.rhythmFreq) - 0.5) * -4 + 1

      if (this.hasMicro() && this.gameFacade.audio) {
        if ((this.lastClap + (this.rhythmFreq / 2)) < (Date.now() + this.deltaTimeWithServer)) {
          this.feedbackMessage = {number: -1, text: ''}
        }

        const isClap = this.gameFacade.audio.isClapping()

        if ((this.lastClap + (this.rhythmFreq / 4)) < (Date.now() + this.deltaTimeWithServer)) {
          if (isClap) {
            this.onClap()
          }
        }

        this.decibel = this.gameFacade.audio.lastDecibelAverage
        this.gain = this.gameFacade.audio.gainNode?.gain.value as number
      }


      if (time < this.lastTime) {
        (this.$refs.pulse as typeof Pulse).startAnimation();
      }
      this.lastTime = time
      this.raf = requestAnimationFrame(this.loop);
    },
    onClap() {
      this.lastClap = Date.now() + this.deltaTimeWithServer
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
      const div = document.createElement("div");
      const p = document.createElement("p");
      const img = document.createElement("img") as HTMLImageElement;
      img.src = `/game/icons/00104/clap-${this.feedbackMessage.number}.svg`;
      const node = document.createTextNode(this.feedbackMessage.text);
      p.appendChild(node);
      p.style.textAlign = 'center'
      div.appendChild(img);
      div.appendChild(p);
      (this.$refs.feedback as HTMLElement).appendChild(div);
      div.style.position = 'absolute'
      div.style.display = 'flex'
      div.style.flexDirection = 'column'
      div.style.alignItems = 'center'
      img.style.width = '60px'
      img.style.height = '60px'
      div.style.top = 'calc(' + (Math.random() * 20 + 40) + '%)'
      div.style.left = 'calc(' + (Math.random() * 20 + 40) + '%)'
      div.style.transform = 'scale(0) translate(-50%, -50%)'
      div.style.transformOrigin = 'top left'
      // div.style.opacity = '0'
      setTimeout(() => {
        div.style.transform = 'scale(0.8) translate(-50%, -50%)'
        div.style.opacity = '1'
        div.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
      }, 10)
      setTimeout(() => {
        div.style.transition = 'transform 1s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.8s cubic-bezier(0.5, 0, 0.75, 0)'
        div.style.opacity = '0'
        div.style.transform = 'scale(0) translate(-50%, -50%)'
      }, 300)
      setTimeout(() => {
        if (this.$refs.feedback) {
          (this.$refs.feedback as HTMLElement).removeChild(div);
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
