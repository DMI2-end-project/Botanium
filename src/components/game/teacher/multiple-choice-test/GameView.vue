<template>
  <div class="relative grid grid-cols-2 gap-4 px-8">
    <div v-for="(answer, index) in answers" :v-bind="index" class="w-full rounded-md p-3.5">
      <div :data-id="index" class="w-full h-full bg-beige rounded-md shadow-md w-max-content py-14 px-10"
           :class="answer.status === 'valid' && gameStore.currentStep === GAMESTEP.PLAY ? 'bg-green-light' : 'bg-beige'">
        <div v-show="gameStore.currentStep === GAMESTEP.PLAY">
          <span v-show="answer.status !== 'valid'" class="text-2xl text-beige-medium font-bold">{{ index + 1 }}</span>
          <!--Check v-show="answer.status === 'valid'" class="w-16"/-->
        </div>
        <div v-show="gameStore.currentStep === GAMESTEP.END"
             class="flex flex-col items-center text-center text-green gap-5">
          <img :src="publicPath + '/src/assets/game-data/icons/'+ mainStore.getFullGameId +'/' + answer.icon" alt=""
               class="w-16 pointer-events-none aspect-square">
          <span class="text-md pointer-events-none">{{ answer.text }}</span>
        </div>
      </div>
    </div>
    <button v-show="gameStore.currentStep === GAMESTEP.END" class="col-span-12 mx-auto my-5" @click="next">
      Continuer
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../../client";
import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import {GAME_STEP} from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager"

export default defineComponent({
  name: 'TeacherGameView',
  props: {
    data: Object,
  },
  data() {
    return {
      publicPath: window.location.origin,
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      socket: getSocket(),
    }
  },
  mounted() {
  },
  computed: {
    GAMESTEP() {
      return GAME_STEP
    },
    answers() {
      return this.gameStore.data.gameSequences[this.gameStore.currentSequence].gamemaster.answers
      /*
      let answers = this.gameStore.data.gameContent; //.filter((content: any, i: number) => i < this.gameStore.totalTeams);
      answers = answers.filter((content: any, i: number) => i < this.gameStore.totalTeams);
      return answers.map((content: any) => {
        return content.answers.find((answer: any) => answer.isValid);
      })
       */
    }
  },
  methods: {
    next() {
      GameMasterManagerInstance.endGame()
    }
  }
});
</script>
