<template>
  <div class="relative">
    <Gauge :content="score" />
    <button class="col-span-12 mx-auto my-5" @click="next">
      Exercice reussi
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../../client";
import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import {EVENT, GAME_STEP, AUDIO_EVENT} from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";
import Gauge from './Gauge.vue';

export default defineComponent({
    name: "TeacherGameView",
    data() {
        return {
            publicPath: window.location.origin,
            mainStore: useMainStore(),
            gameStore: useGameStore(),
            socket: getSocket(),
            score: 0 as number,
        };
    },
    mounted() {
        this.updateScore = this.updateScore.bind(this)
        this.socket.on(AUDIO_EVENT.CLAP_SCORE, this.updateScore);
        this.socket.emit(AUDIO_EVENT.AUDIO_GAME_READY, {
          roomId: this.mainStore.roomId,
        }, (response: number) => {
            if (!response) {
            this.next()
          }
        });
    },
    computed: {
        GAMESTEP() {
            return GAME_STEP;
        },
    },
    methods: {
        next() {
            GameMasterManagerInstance.endGame()
        },
        updateScore(clapScore: number) {
            this.score += Number(clapScore) * 5
            this.score = Math.min(Math.max(this.score, 0), 100);
        }
    },
    components: { Gauge }
});
</script>
