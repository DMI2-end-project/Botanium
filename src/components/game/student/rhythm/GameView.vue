<template>
  <div class="relative">
    <button @click="initAudioContext" v-if="!isReady && microActive">Je suis prêt(e)</button>
    <div v-if="!microActive && !isReady">
      <p>Le micro est désactiver, l'équipe ne peut pas participer au jeu. Pour activer le micro, il faut accéder aux paramètre de cette page web.</p>
      <button @click="initAudioContext">Retester l'activiation du micro</button>
      <button @click="readyWithoutMicro">Faire l'activité sans le micro</button>
    </div>
    <AudioListenerElement v-if="isReady" :analyser="analyser" :microActive="microActive" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useGameStore} from "../../../../stores/gameStore";
import { useMainStore } from "../../../../stores/mainStore";
import { getSocket } from "../../../../client";
import AudioListenerElement from './AudioListenerElement.vue';
import { CLAPEVENT } from "../../../../common/Constants";

// TODO : DYNAMIC SVG
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
        };
    },
    computed: {},
    components: { AudioListenerElement },
    mounted() {
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
          this.socket.emit(CLAPEVENT.CLAP_READY, {
            roomId: this.mainStore.roomId,
            microIsActive: true
          });
          this.isReady = true;

        } catch (err) {
          this.microActive = false
        }
      },
      readyWithoutMicro() {
        this.socket.emit(CLAPEVENT.CLAP_READY, {
          roomId: this.mainStore.roomId,
          microIsActive: false
        });
        this.isReady = true;
      }
    },
});
</script>
