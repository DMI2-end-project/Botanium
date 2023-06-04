<template>
  <div class="relative">
    <button class="mt-10" @click="startMicrophone" v-if="!isReady && microActive">Je suis prêt(e)</button>
    <div v-if="!microActive && !isReady">
      <p>Le micro est désactiver, l'équipe ne peut pas participer au jeu. Pour activer le micro, il faut accéder aux paramètre de cette page web.</p>
      <button @click="startMicrophone">Retester l'activiation du micro</button>
      <button @click="readyWithoutMicro">Faire l'activité sans le micro</button>
    </div>
    <!-- <p>Delta time : {{ deltaTime }}</p>
    <p>Time : {{ Math.floor(currentTime / 100) }}</p>
    <p>T1 : {{ t1 }}</p>
    <p>T2 : {{ t2 }}</p>
    <p>Latence : {{ latency }}</p>
    <p>Timer server : {{ Math.floor((currentTime  + deltaTime) / 100) }}</p> -->
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
import { TeamManagerInstance } from '../../../../common/TeamManager';

export default defineComponent({
    name: "StudentGameView",
    data() {
      return {
            stream: null as MediaStream | null,
            context: null as AudioContext | null,
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
            // currentTime: Date.now(),
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
    //   setInterval(() => {
    //   this.currentTime = Date.now();
    // }, 100);
      window.addEventListener("blur", this.stopMicrophone);
      window.addEventListener("focus", this.startMicrophone);
    },
    methods: {
        async startMicrophone() {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.context = new AudioContext();
          const source = this.context.createMediaStreamSource(this.stream);
          this.analyser = this.context.createAnalyser();

          source.connect(this.analyser);
          this.analyser.connect(this.context.destination);

          this.analyser.fftSize = 2048;
          this.analyser.smoothingTimeConstant = 0.8;
          this.sendReady(true)
        } catch (err) {
          this.microActive = false
        }
      },
      stopMicrophone() {
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        if (this.context) {
          this.context.close();
          this.context = null;
        }
      },
      readyWithoutMicro() {
        this.sendReady(false)
      },
      sendReady(hasMicro: Boolean) {
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
                  TeamManagerInstance.clapReady(hasMicro);
                }
            });
          }, 10 * i)
        }
        this.isReady = true;
      }
    },
});
</script>
