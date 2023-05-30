<template>
  <div class="relative">
    <button @click="initAudioContext" v-if="!isReady && microActive">Je suis prêt(e)</button>
    <div v-if="!microActive && !isReady">
      <p>Le micro est désactiver, l'équipe ne peut pas participer au jeu. Pour activer le micro, il faut accéder aux paramètre de cette page web.</p>
      <button @click="initAudioContext">Retester l'activiation du micro</button>
      <button @click="readyWithoutMicro">Faire l'activité sans le micro</button>
    </div>
    <p>Delta time : {{ deltaTime }}</p>
    <p>Time : {{ Math.floor(currentTime / 100) }}</p>
    <p>T1 : {{ t1 }}</p>
    <p>T2 : {{ t2 }}</p>
    <p>Latence : {{ latency }}</p>
    <p>Timer server : {{ Math.floor((currentTime  + deltaTime) / 100) }}</p>
    <AudioListenerElement v-if="launchGame" :analyser="analyser" :microActive="microActive" :deltaTime="deltaTime" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useGameStore} from "../../../../stores/gameStore";
import { useMainStore } from "../../../../stores/mainStore";
import { getSocket } from "../../../../client";
import AudioListenerElement from './AudioListenerElement.vue';
import { CLAP_EVENT } from "../../../../common/Constants";

export default defineComponent({
    name: "StudentGameView",
    data() {
        return {
            publicPath: window.location.origin,
            mainStore: useMainStore(),
            gameStore: useGameStore(),
            socket: getSocket(),
            analyser: {} as AnalyserNode,
            microActive: true,
            isReady: false,
            launchGame: false,
            deltaTime: 0,
            deltaTimes: [],
            currentTime: Date.now(),
            t1: 0,
            t2: 0,
            latency: 0
        };
    },
    computed: {},
    components: { AudioListenerElement },
    mounted() {
      this.socket.on(CLAP_EVENT.CLAP_LAUNCH, (arg) => {
        this.launchGame= arg
      });
      setInterval(() => {
      this.currentTime = Date.now();
    }, 100);
    },
    methods: {
        async initAudioContext() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const context = new AudioContext();
          const source = context.createMediaStreamSource(stream);
          this.analyser = context.createAnalyser();

          source.connect(this.analyser);
          this.analyser.connect(context.destination);

          this.analyser.fftSize = 2048;
          this.analyser.smoothingTimeConstant = 0.8;
          this.sendReady(true)
        } catch (err) {
          this.microActive = false
        }
      },
      readyWithoutMicro() {
        this.sendReady(false)
      },
      sendReady(microIsActive: Boolean) {
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            const dateEmit = Date.now()
            this.socket.emit(CLAP_EVENT.CLAP_SYNCHRO, {
                roomId: this.mainStore.roomId,
            }, (response: number) => {
                const end = Date.now();
                this.latency = end - dateEmit;
                this.t1 = response - dateEmit - (this.latency / 2)
                this.t2 = response - end + (this.latency / 2)
                this.deltaTime += (this.t1 + this.t2) / 2
                if (i === 9) {
                  this.deltaTime = this.deltaTime / 10
                  this.socket.emit(CLAP_EVENT.CLAP_READY, {
                    roomId: this.mainStore.roomId,
                    microIsActive: true,
                  });
                }
            });
          }, 10 * i)
        }
        this.isReady = true;
      }
    },
});
</script>
