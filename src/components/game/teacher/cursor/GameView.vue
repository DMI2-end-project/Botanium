<template>
  <div class="w-3/4 mx-auto">
    <div class="flex justify-between gap-24">
      <div v-for="(answer, index) in answers" :v-bind="index" @click="answer.isValid = true" class="box relative flex-1 h-[15vw] bg-yellow outline-2 outline-dashed outline-white rounded-lg  flex flex-col items-center justify-center" :class="answer.isValid ? '-outline-offset-2' : 'outline-offset-8'">
        <img :src="publicPath + '/src/assets/game-data/icons/00103/' + answer.icon" class="grayscale brightness-50 w-2/5 opacity-30">
        <div class="absolute w-full h-full bg-beige flex flex-col items-center justify-center outline-1 outline outline-beige-dark rounded-lg -outline-offset-8 transform transition-all duration-1000 delay-100" :class="answer.isValid ? 'scale-100 translate-y-0 opacity-1' : 'scale-110 -translate-y-14 opacity-0'">
          <img :src="publicPath + '/src/assets/game-data/icons/00103/' + answer.icon" class="w-2/5">
        </div>
      </div>
    </div>
    <button v-show="gameStore.currentStep === GAMESTEP.END" class="col-span-12 mx-auto my-5" @click="next">
      Continuer
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {useGameStore} from "../../../../stores/gameStore";
import { GAME_STEP } from "../../../../common/Constants";
import { GameMasterManagerInstance } from "../../../../common/GameMasterManager";

export default defineComponent({
  name: "TeacherGameView",
    data() {
      return {
      publicPath: window.location.origin,
      value: 50,
      gameStore: useGameStore(),
    }
  },
  computed: {
    GAMESTEP() {
      return GAME_STEP
    },
    answers() {
      return this.gameStore.data.gameSequences[this.gameStore.currentSequence].gamemaster.answers
    }
  },
  methods: {
      next() {
          GameMasterManagerInstance.endGame()
      },
  },
});
</script>

<style scoped>
.box {
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: outline-offset 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
