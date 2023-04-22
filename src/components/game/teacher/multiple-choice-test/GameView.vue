<template>
  <div class="relative grid grid-cols-12">
    <div class="col-start-2 col-span-10 grid grid-cols-2 gap-x-10 gap-y-12">
      <div v-for="(answer, index) in answers" :v-bind="index" :data-id="index"
           class="bg-beige rounded-md shadow-md w-max-content h-full w-full p-20"
           :class="answer.status === 'valid' ? 'bg-green-light' : 'bg-beige'">
        <div v-show="gameStore.currentStep === STEP.PLAY">
          <span v-show="answer.status !== 'valid'" class="text-2xl text-beige-medium font-bold">{{ index + 1 }}</span>
          <Check v-show="answer.status === 'valid'" class="w-16"/>
        </div>
        <div v-show="gameStore.currentStep === STEP.END"
             class="flex flex-col items-center text-center text-green gap-5">
          <img :src="publicPath + '/src/assets/game-data/icons/'+ mainStore.getFullGameId +'/' + answer.icon" alt=""
               class="w-16 aspect-square pointer-events-none">
          <p class="mt-5 pointer-events-none">{{ answer.text }}</p>
        </div>
      </div>
    </div>
    <button v-show="gameStore.currentStep === STEP.END" class="mx-auto my-5" @click="next">Continuer</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../../client";
import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import {EVENT, STEP} from "../../../../common/Constants";
import type {Answer} from '../../../../common/Interfaces';
import Check from "../../../../assets/svg/ico-check.svg";

export default defineComponent({
  name: 'GameViewComponent',

  props: {
    teamId: {
      type: String,
      default: "1",
    }
  },
  data() {
    return {
      publicPath: window.location.origin,
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      socket: getSocket(),
    }
  },
  computed: {
    STEP() {
      return STEP
    },
    answers() {
      return this.gameStore.data.gameContent.map((content: any) => {
        return content.answers.find((answer: any) => answer.isValid);
      })
    }
  },
  mounted() {
    console.log('MOUNTED GAMEVIEW')
    this.answers[1].status = 'valid';

    this.socket.on(EVENT.TEAM_VALIDATION, (arg) => {
      this.answers[arg.teamId].status = 'valid';
      console.log('EVENT.TEAM_VALIDATION', arg, arg.teamId, this.answers[arg.teamId].status);
    });
  },
  methods: {
    next() {
      this.gameStore.currentStep = STEP.CONGRATS;
      this.socket.emit(EVENT.END_GAME, {
        roomId: this.mainStore.roomId
      })
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
