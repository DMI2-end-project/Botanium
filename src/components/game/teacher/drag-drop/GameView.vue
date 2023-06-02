<template>
  <div class="w-full h-full flex-1 flex items-center bg-background grid grid-cols-12 gap-4 px-8 text-center gap-5">
    <div class="col-span-9 flex gap-9 rounded-md px-10 pt-9 pb-14 bg-beige-medium">
      <div v-if="answers" v-for="(answer, index) in answers" :v-bind="index"
           class="w-full flex flex-col justify-center items-center gap-6">
        <div class=" w-full aspect-[5/9] bg-beige rounded-md flex items-center justify-center">
          {{ answer.label }}...
        </div>
        <h3 class="w-full bg-green text-beige rounded-md">
          {{ answer.molecule }}
        </h3>
      </div>
    </div>
    <button v-show="gameStore.currentStep === GAMESTEP.END" class="col-span-12 mx-auto my-5" @click="next">
      Continuer
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../../../stores/gameStore";
import {GAME_STEP} from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";

export default defineComponent({
  name: "TeacherGameView",
  data() {
    return {
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
  mounted() {
    console.log('answers', this.answers);
  },
  methods: {
    next() {
      GameMasterManagerInstance.endGame()
    },
  },
});
</script>
