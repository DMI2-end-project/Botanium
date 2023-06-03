<template>
  <div class="relative grid grid-cols-12 gap-4 px-8">
    <div class="col-start-2 col-span-10 grid grid-cols-2 auto-rows-fr gap-4">
      <CardGame :answer-state="'none'" :card-state="cardState(answer, index)" v-for="(answer, index) in answers"
                :v-bind="index">
        <template v-slot:recto>
          <SvgIcon :name="answer.icon" class="w-16 aspect-square pointer-events-none"/>
          <span class="text-md pointer-events-none">{{ answer.text }}</span>
        </template>
        <template v-slot:verso>
          <div class="bg-red-500">
            <span class="text-2xl text-beige-medium font-bold">{{ index + 1 }}</span>
          </div>
        </template>
      </CardGame>
      <!--div v-for="(answer, index) in answers" :v-bind="index" class="w-full rounded-md p-3.5">
        <div :data-id="index" class="w-full h-full bg-beige rounded-md shadow-md w-max-content py-14 px-10"
             :class="answer.status === 'valid' && gameStore.currentStep === GAMESTEP.PLAY ? 'bg-green-light' : 'bg-beige'">
          <div v-show="gameStore.currentStep === GAMESTEP.PLAY">
            <span v-show="answer.status !== 'valid'" class="text-2xl text-beige-medium font-bold">{{ index + 1 }}</span>
            <Check v-show="answer.status === 'valid'" class="w-16"/>
          </div>
          <div v-show="gameStore.currentStep === GAMESTEP.END"
               class="flex flex-col items-center text-center text-green gap-5">
            <img :src="publicPath + '/src/assets/game-data/icons/'+ mainStore.getFullGameId +'/' + answer.icon" alt=""
                 class="w-16 pointer-events-none aspect-square">
            <span class="text-md pointer-events-none">{{ answer.text }}</span>
          </div>
        </div>
      </div-->
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
import CardGame from "../../CardGame.vue";
import SvgIcon from "../../../common/SvgIcon.vue";

export default defineComponent({
  name: 'TeacherGameView',
  components: {SvgIcon, CardGame},
  data() {
    return {
      publicPath: window.location.origin,
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      socket: getSocket(),
    }
  },
  computed: {
    GAMESTEP() {
      return GAME_STEP
    },
    answers() {
      return this.gameStore.data.gameSequences[this.gameStore.currentSequence].gamemaster.answers
    },
  },
  methods: {
    next() {
      GameMasterManagerInstance.endGame()
    },
    cardState(answer: any, index: number) {
      if (this.gameStore.currentStep === GAME_STEP.END) {
        return 'show';
      } else {
        if (answer.status === 'valid') {
          return 'validated';
        } else {
          return 'hide';
        }
      }
    }
  }
});
</script>
