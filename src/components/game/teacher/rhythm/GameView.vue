<template>
  <div class="relative">
    <Gauge v-if="isPlaying" :content="score" />
    <p v-if="cantPlay">Aucun micro n'est activé. L'enigme ne peut pas être résolue. Passez à la suite</p>
    <p>student ready : {{ studentReady }}</p>
    <p>student with micro : {{ studentWithMicro }}</p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../../client";
import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import {EVENT, STEP, CLAPEVENT} from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";
import Gauge from './Gauge.vue';

// TODO : DYNAMIC SVG
export default defineComponent({
    name: "TeachcerGameView",
    props: {
        data: Object,
    },
    data() {
        return {
            publicPath: window.location.origin,
            mainStore: useMainStore(),
            gameStore: useGameStore(),
            socket: getSocket(),
            score: 0 as number,
            studentReady: 0,
            studentWithMicro: 0,
            isPlaying: false,
            cantPlay: false,
        };
    },
    mounted() {
        this.updateScore = this.updateScore.bind(this)
        this.socket.on(CLAPEVENT.CLAP_SCORE, this.updateScore);
        this.socket.on(CLAPEVENT.CLAP_READY, (arg) => {
            this.studentReady += 1
            if (arg) {
                this.studentWithMicro += 1
            }
        });
        this.socket.on(CLAPEVENT.CLAP_LAUNCH, (arg) => {
            this.isPlaying = arg
            this.cantPlay = !arg
        });
    },
    computed: {
        STEP() {
            return STEP;
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
